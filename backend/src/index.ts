import dotenv from "dotenv"
import Anthropic from '@anthropic-ai/sdk';
import express from "express"
import { TextBlock } from "@anthropic-ai/sdk/resources/messages";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import OpenAI from "openai";
import cors from "cors"
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { MessageFormat } from "./defaults/message";
dotenv.config()
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
})
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const app = express();
app.use(express.json())
app.use(cors())
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    /*
     **** CLAUDE API ****
    const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 200,
        system: "Return either node or react based on what do you think this project should be in .Only return a single string word either 'node' or 'react'. onot return anything extra.",
        messages: [
            { "role": "user", "content": prompt }
        ]
    });
    const answer = (response.content[0] as TextBlock).text;
    */
   const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt+"Return either node or react based on what do you think this project should be in .Only return a single string word either 'node' or 'react'. onot return anything extra.",
        });
        let answer=response.text;
        console.log("This is answer:",answer?.trim())
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
    res.status(403).json({
        message: "Sorry this cant be built using current version of this app."
    })
    return;
})
app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages



        // const response = await anthropic.messages.create({
        //     model: "claude-3-7-sonnet-20250219",
        //     max_tokens: 10000,
        //     system: getSystemPrompt(),
        //     messages: messages
        // })
        // console.log(response);
        // res.json({
        //     response:response
        // })

        /*
         *****FOR CLAUDE LLM ******
         const response = openai.chat.completions.create({
             model: "gpt-4o-mini",
             store: true,
             messages: messages,
         });
         */

        /* 
        **** FOR GEMINI API *****  */
       console.log("eg of messages:   ",messages)
       let prompt="";
       messages.map((message: { role: string; content: string })=>{
        prompt+=message.content +"\n"
       })
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        console.log(response.text)
        res.send({
            response:response.text
        })
             
    
    } catch (e) {
        console.log("Error while sending response", e)
        res.json({
            message: "Error while sending your request"
        })
    }
})

