import express from "express"
import { tavily } from '@tavily/core';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import cors from "cors";

import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";
import { middleware } from "./middleware";
import { prisma } from "./db";

const app = express()
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use(express.json())

const client = tavily({
    apiKey: process.env.TAVILY_API_KEY || "",
})

// GET /conversations - Get all conversations for the user
app.get("/conversations", middleware, async (req, res) => {
    try {
        const userId = req.userId as string;

        const conversations = await prisma.conversation.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                slug: true,
                // createdAt: true,
            },
            // orderBy: { createdAt: "desc" },
        });

        res.json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        console.error("Error fetching conversations", error);
        res.status(500).json({ success: false, error: "Failed to fetch conversations" });
    }
});

// POST /conversations - Create a new conversation
app.post("/conversations", middleware, async (req, res) => {
    try {
        const userId = req.userId as string;
        const { title } = req.body;

        const conversation = await prisma.conversation.create({
            data: {
                title: title || "New Conversation",
                slug: Math.random().toString(36).substring(7), // Simple slug for now
                userId,
            },
        });

        res.json({
            success: true,
            data: conversation,
        });
    } catch (error) {
        console.error("Error creating conversation", error);
        res.status(500).json({ success: false, error: "Failed to create conversation" });
    }
});


// POST /conversations/:conversationId - Add message and stream response
app.post("/conversations/:conversationId", middleware, async (req, res) => {
    try {
        const userId = req.userId as string;
        const { conversationId } = req.params;
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, error: "Query required" });
        }

        // Verify user owns this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation || conversation.userId !== userId) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        // Save user message to DB
        await prisma.message.create({
            data: {
                content: query,
                role: "USER",
                conversationId: conversationId as string,
            },
        });

        console.log("User message saved", { conversationId, userId });

        // Perform web search
        const websearchResponses = await client.search(query, {
            searchDepth: "advanced",
        });
        const websearchResult = websearchResponses.results;

        // Generate AI response
        const prompt = PROMPT_TEMPLATE.replace("{WEB_SEARCH_RESPONSES}", JSON.stringify(websearchResult)).replace(
            "{USER_QUERY}",
            query
        );

        const result = streamText({
            model: groq("llama-3.3-70b-versatile"),
            prompt,
            system: SYSTEM_PROMPT,
        });

        let fullResponse = "";

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Stream the response
        for await (const textPart of result.textStream) {
            fullResponse += textPart;
            res.write(textPart);
        }

        // Save AI response to DB
        await prisma.message.create({
            data: {
                content: fullResponse,
                role: "ASSISTANT",
                conversationId: conversationId as string,
            },
        });

        res.write("\n======SOURCES_START======\n");
        websearchResult.forEach((source) => {
            res.write(JSON.stringify(source) + "\n");
        });
        res.write("======SOURCES_END======\n");

        console.log("Assistant message saved", { conversationId, userId, messageLength: fullResponse.length });

        res.end();
    } catch (error) {
        console.error("Error processing conversation", error);
        res.status(500).json({ success: false, error: "Failed to process query" });
    }
});

// POST /perplexity-ask - One-off query (legacy endpoint, similar to POST /conversations/:id)
app.post("/perplexity-ask", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, error: "Query required" });
        }

        const websearchResponses = await client.search(query, {
            searchDepth: "advanced",
        });

        const websearchResult = websearchResponses.results;
        console.log("result: ",websearchResult);

        const prompt = PROMPT_TEMPLATE.replace("{WEB_SEARCH_RESPONSES}", JSON.stringify(websearchResult)).replace(
            "{USER_QUERY}",
            query
        );

        const result = streamText({
            model: groq("llama-3.3-70b-versatile"),
            prompt,
            system: SYSTEM_PROMPT,
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const textPart of result.textStream) {
            res.write(textPart);
        }

        res.write("\n======SOURCES_START======\n");
        websearchResult.forEach((source) => {
            res.write(JSON.stringify(source) + "\n");
        });
        res.write("======SOURCES_END======\n");

        console.log("One-off query processed", { query: query.substring(0, 50) });

        res.end();
    } catch (error) {
        console.error("Error processing ask query", error);
        res.status(500).json({ success: false, error: "Failed to process query" });
    }
});

// POST /follow-up-questions - Get follow-up questions based on conversation
app.post("/follow-up-questions", middleware, async (req, res) => {
    try {
        const userId = req.userId as string;
        const { conversationId } = req.body;

        if (!conversationId) {
            return res.status(400).json({ success: false, error: "ConversationId required" });
        }

        // Verify user owns this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    // orderBy: { createdAt: "asc" },
                    take: -10, // Last 10 messages
                },
            },
        });

        if (!conversation || conversation.userId !== userId) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        // Build context from conversation history
        const chatHistory = conversation.messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

        const followUpPrompt = `Based on this conversation:\n${chatHistory}\n\nGenerate 3 relevant follow-up questions the user might ask. Return as JSON array of strings.`;

        const result = streamText({
            model: groq("llama-3.3-70b-versatile"),
            prompt: followUpPrompt,
            system: "Generate follow-up questions concisely.",
        });

        let fullResponse = "";

        res.setHeader("Content-Type", "text/event-stream");

        for await (const textPart of result.textStream) {
            fullResponse += textPart;
            res.write(textPart);
        }

        console.log("Follow-up questions generated", { conversationId, userId });

        res.end();
    } catch (error) {
        console.error("Error generating follow-up questions", error);
        res.status(500).json({ success: false, error: "Failed to generate follow-up questions" });
    }
})


const port = Number(process.env.PORT ?? 3001);
const server = app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
});

server.on("error", (err) => {
    console.error("Backend failed to start", err);
});