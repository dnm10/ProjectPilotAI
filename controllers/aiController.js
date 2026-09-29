const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Dynamically parse user requirements into task items without hardcoded strings
 * @param {string} requirements
 * @returns {Array<{title: string, description: string, story_points: number}>}
 */
function parseRequirementsDynamically(requirements) {
  const lines = (requirements || '')
    .split(/\r?\n|;|\.\s+/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter((line) => line.length > 5);

  if (lines.length > 0) {
    return lines.map((line) => ({
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
 * Generate development tasks from user requirements using Groq AI
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const generateTasks = async (req, res) => {
  try {
    const { requirements } = req.body;

    if (!requirements || !requirements.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Requirements are required',
      });
    }

    const trimmedReq = requirements.trim();
    let tasksList = null;

    if (process.env.GROQ_API_KEY) {
      try {
        const prompt = `You are an expert Agile project manager.
Based on the following project/sprint requirements, generate practical, actionable development tasks.

Requirements:
${trimmedReq}

Return ONLY valid JSON in exactly this structure:
{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description of the task",
      "story_points": 3
    }
  ]
}

Rules:
- Generate 3 to 8 specific tasks directly derived from the requirements.
- story_points must be an integer: 1, 2, 3, 5, or 8.
- Output pure JSON only without markdown formatting.`;

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
            tasksList = parsed.tasks;
          }
        }
      } catch (aiError) {
        console.warn('Groq AI completion error, falling back to dynamic parser:', aiError.message);
      }
    }

    if (!tasksList || tasksList.length === 0) {
      tasksList = parseRequirementsDynamically(trimmedReq);
    }

    const tasks = tasksList.map((task, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: task.title || `Task ${index + 1}`,
      description: task.description || '',
      story_points: Number(task.story_points) || 3,
      is_included: true,
    }));

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