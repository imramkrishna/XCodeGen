import dotenv from "dotenv"
import express from "express"
import { basePrompt as nodeBasePrompt } from "./defaults/node.js";
import { basePrompt as reactBasePrompt } from "./defaults/react.js";
import { BASE_PROMPT, getSystemPrompt } from "./prompts.js";
import cors from "cors"
import { GoogleGenAI } from "@google/genai";
import { MessageFormat } from "./defaults/message.js";
import { fullStackBasePrompt } from "./defaults/fullstack.js";
import { chatMessage } from "./defaults/chatMessage.js";
dotenv.config()
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
app.use(express.json())
// app.use(cors({
//     origin: ["https://x-code-gen.vercel.app"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }))
app.use(cors())
app.listen(3000, () => {
    console.log("Server is running on port 3000")

})
app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "qwen/qwen2.5-vl-32b-instruct:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt + "Return either node,react or fullstack based on what do you think this project should be in.If it is both frontend and backend then return fullstack.Only return a single string word either 'node' or 'react' or 'fullstack'. Donot return anything extra.",
                }
            ]
        })
    });
    const data:any = await response.json();
    const answer: string = (data?.choices?.[0]?.message?.content) ?? (data?.choices?.[0]?.content) ?? "";
    console.log(data)
    if (answer?.trim() == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.Make sure to make website responsive and beautiful as if it is made by one of the best ui ux designers.\n\n ${MessageFormat}\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer?.trim() == "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n ${MessageFormat}\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }
    if (answer?.trim() == "fullstack") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n ${MessageFormat}\n\n${fullStackBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n`],
            uiPrompts: [fullStackBasePrompt]
        })
        return;
    }
    res.status(403).json({
        reponse: "Sorry we could process this request for now."
    })
    return;
})
app.post("/chatmistral", async (req, res) => {
    try {
        const messages = req.body.messages

        console.log("eg of messages:   ", messages)
        let prompt = "";
        messages.map((message: { role: string; content: string }) => {
            prompt += message.content + "\n"
        })
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "mistralai/devstral-small:free",
                "messages": [
                    {
                        "role": "user",
                        "content": chatMessage + prompt
                    }
                ]
            })
        });
        const data = await response.json()
        res.json({
            response: data.choices[0].message.content
        })


    } catch (e) {
        console.log("Error while sending response", e)
        res.json({
            message: "Error while sending your request"
        })
    }
})
app.post("/chatqwen", async (req, res) => {
    try {
        const messages = req.body.messages

        console.log("eg of messages: ", messages)
        let prompt = "";
        messages.map((message: { role: string; content: string }) => {
            prompt += message.content + "\n"
        })
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "qwen/qwen3-30b-a3b:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });
        const data = await response.json()
        res.json({
            response: data.choices[0].message.content
        })


    } catch (e) {
        console.log("Error while sending response", e)
        res.json({
            message: "Error while sending your request"
        })
    }
})
app.post("/chatllama", async (req, res) => {
    try {
        const messages = req.body.messages

        console.log("eg of messages:   ", messages)
        let prompt = "";
        messages.map((message: { role: string; content: string }) => {
            prompt += message.content + "\n"
        })
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-4-scout:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });
        const data = await response.json()
        res.json({
            response: data.choices[0].message.content
        })


    } catch (e) {
        console.log("Error while sending response", e)
        res.json({
            message: "Error while sending your request"
        })
    }
})

app.post("/chatgemini", async (req, res) => {
    try {
        const messages = req.body.messages
        let prompt = "";
        messages.map((message: { role: string; content: string }) => {
            prompt += message.content + "\n"
        })

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        console.log(response.text)
        res.json({
            response: response.text
        })


    } catch (e) {
        console.log("Error while sending response", e)
        res.json({
            message: "Error while sending your request"
        })
    }
})
app.post("/chatmode", async (req, res) => {
    try {
        const messages = req.body.messages

        console.log("eg of messages:   ", messages)
        let prompt = "";
        messages.map((message: { role: string; content: string }) => {
            prompt += message.content + "\n"
        })
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "microsoft/mai-ds-r1:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature: 0
            })
        });
        const data = await response.json()
        console.log("Response from ai: ", data)
        res.json({
            response: data.choices[0].message.content
        })


    } catch (e) {
        console.log("Error while sending response", e)
        res.json({
            message: "Error while sending your request"
        })
    }
})