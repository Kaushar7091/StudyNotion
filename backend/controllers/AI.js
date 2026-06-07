const { generateAIResponse } = require("../utils/aiHelper");

// Controller to handle student questions about a course
exports.askAITutor = async (req, res) => {
    try {
        const { question, courseName, currentTopic } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, message: "Question is required" });
        }

        // Define a strong persona/role for the AI
        const systemInstruction = `You are a helpful, expert AI programming tutor on StudyNotion, an online education platform. 
Keep your answers clear, concise, and focused on helping the student learn. Always format code using markdown.`;

        // Contextualize the prompt
        const prompt = `The student is currently learning the topic "${currentTopic}" in the course "${courseName}". 
Here is their question: "${question}"`;

        const reply = await generateAIResponse(prompt, systemInstruction);

        return res.status(200).json({
            success: true,
            message: "Response generated successfully",
            data: reply,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
            error: error.message,
        });
    }
};
