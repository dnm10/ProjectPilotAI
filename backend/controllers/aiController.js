const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateTasks = async (req, res) => {
  try {
    const { requirements } = req.body;

    if (!requirements || !requirements.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Requirements are required',
      });
    }

    const prompt = `
You are an expert Agile project manager.

Based on the following project/sprint requirements, generate a list of practical development tasks.

Requirements:
${requirements}

Return ONLY valid JSON in exactly this format:
{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed task description",
      "story_points": 3
    }
  ]
}

Rules:
- Generate 4 to 8 tasks.
- Tasks must be specific and actionable.
- Do not invent unrelated requirements.
- story_points must be one of: 1, 2, 3, 5, 8.
- Do not include markdown or explanations outside the JSON.
`;

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

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response received from Groq');
    }

    const result = JSON.parse(content);

    const tasks = result.tasks.map((task, index) => ({
      id: `draft-${Date.now()}-${index}`,
      title: task.title,
      description: task.description,
      story_points: task.story_points,
      is_included: true,
    }));

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('AI task generation error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate tasks with AI',
      error: error.message,
    });
  }
};

module.exports = {
  generateTasks,
};