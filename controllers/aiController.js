const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Dynamically parse user requirements into task items without hardcoded strings
 * @param {string} requirements
 * @returns {Array<{title: string, description: string, story_points: number}>}
 */
function parseRequirementsDynamically(requirements, maxTasks = 8) {
  const lines = (requirements || '')
    .split(/\r?\n|;|\.\s+/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter((line) => line.length > 5);

  let taskList = lines;
  if (taskList.length > maxTasks) {
    taskList = taskList.slice(0, maxTasks);
  }

  if (taskList.length > 0) {
    return taskList.map((line) => ({
      title: line.length > 60 ? `${line.slice(0, 57)}...` : line,
      description: line,
      story_points: 3,
    }));
  }

  return [
    {
      title: requirements.length > 60 ? `${requirements.slice(0, 57)}...` : requirements,
      description: requirements,
      story_points: 3,
    },
  ];
}

/**
 * Normalize and scale task estimated days so total estimated days <= sprint duration
 * @param {Array<any>} tasks
 * @param {number|null} sprintDuration
 */
function normalizeTaskDays(tasks, sprintDuration) {
  if (!sprintDuration || sprintDuration <= 0 || !Array.isArray(tasks) || tasks.length === 0) {
    return tasks;
  }

  const maxTasks = Math.max(1, sprintDuration);
  let workingTasks = tasks.length > maxTasks ? tasks.slice(0, maxTasks) : tasks;

  const n = workingTasks.length;
  if (n >= sprintDuration) {
    return workingTasks.map((t) => ({ ...t, estimated_days: 1 }));
  }

  const currentTotal = workingTasks.reduce((sum, t) => sum + (Number(t.estimated_days) || 1), 0);
  if (currentTotal <= sprintDuration) {
    return workingTasks;
  }

  const baseDays = 1;
  const remainingDays = sprintDuration - (n * baseDays);
  const totalPoints = workingTasks.reduce((sum, t) => sum + (Number(t.story_points) || 1), 0);

  const allocations = workingTasks.map((t, index) => {
    const pts = Number(t.story_points) || 1;
    const exact = totalPoints > 0 ? (pts / totalPoints) * remainingDays : remainingDays / n;
    const whole = Math.floor(exact);
    const remainder = exact - whole;
    return { index, whole, remainder };
  });

  const allocatedWhole = allocations.reduce((sum, a) => sum + a.whole, 0);
  const leftOver = remainingDays - allocatedWhole;

  allocations.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < leftOver; i++) {
    allocations[i % allocations.length].whole += 1;
  }

  allocations.sort((a, b) => a.index - b.index);

  return workingTasks.map((t, idx) => ({
    ...t,
    estimated_days: baseDays + allocations[idx].whole,
  }));
}

const generateTasks = async (req, res) => {
  try {
    const { requirements, startDate, endDate, duration } = req.body;

    if (!requirements || !requirements.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Requirements are required',
      });
    }

    const trimmedReq = requirements.trim();
    let sprintDuration = null;

    if (duration && !isNaN(Number(duration))) {
      sprintDuration = Math.max(1, Number(duration));
    } else if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) {
        sprintDuration = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      }
    }

    let maxTasks = 8;
    let minTasks = 3;
    if (sprintDuration && sprintDuration > 0) {
      maxTasks = Math.max(1, Math.min(8, sprintDuration));
      minTasks = Math.max(1, Math.min(3, maxTasks));
    }

    let tasksList = null;

    if (process.env.GROQ_API_KEY) {
      try {
        const durationInstruction = sprintDuration
          ? `\nSprint Duration: ${sprintDuration} day(s).\nCRITICAL REQUIREMENT: Generate at most ${maxTasks} tasks (since sprint duration is ${sprintDuration} days). The SUM of estimated_days across all tasks combined MUST NOT exceed ${sprintDuration} days.`
          : '';

        const prompt = `You are an expert Agile project manager.
Based on the following project/sprint requirements, generate practical, actionable development tasks.${durationInstruction}

Requirements:
${trimmedReq}

Return ONLY valid JSON in exactly this structure:
{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description of the task",
      "story_points": 3,
      "estimated_days": 2
    }
  ]
}

Rules:
- Generate between ${minTasks} and ${maxTasks} specific tasks (never more than ${maxTasks} tasks).
- story_points must be an integer: 1, 2, 3, 5, or 8.
- estimated_days must be an integer >= 1.
${sprintDuration ? `- The SUM of all tasks' estimated_days combined must be <= ${sprintDuration}.\n` : ''}- Output pure JSON only without markdown formatting.`;

        const completion = await groq.chat.completions.create({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        });

        const rawContent = completion.choices[0]?.message?.content || '';
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed?.tasks) && parsed.tasks.length > 0) {
            tasksList = parsed.tasks.slice(0, maxTasks);
          }
        }
      } catch (aiError) {
        console.warn('Groq AI completion error, falling back to dynamic parser:', aiError.message);
      }
    }

    if (!tasksList || tasksList.length === 0) {
      tasksList = parseRequirementsDynamically(trimmedReq, maxTasks);
    }

    const rawTasks = tasksList.slice(0, maxTasks).map((task, index) => {
      const rawPoints = Number(task.story_points) || 3;
      let estimatedDays = Number(task.estimated_days);
      if (!estimatedDays || isNaN(estimatedDays)) {
        estimatedDays = Math.max(1, Math.ceil(rawPoints / 2));
      }

      return {
        id: `task-${Date.now()}-${index}`,
        title: task.title || `Task ${index + 1}`,
        description: task.description || '',
        story_points: rawPoints,
        estimated_days: estimatedDays,
        is_included: true,
      };
    });

    const tasks = normalizeTaskDays(rawTasks, sprintDuration);

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('Task generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate tasks',
      error: error.message,
    });
  }
};

module.exports = {
  generateTasks,
};