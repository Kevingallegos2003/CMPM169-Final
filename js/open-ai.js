import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
});

const Conversation = z.object({
	responses: z.array(z.string())
});

let personality1 = "happy";
let personality2 = "mad";

// Send out the prompt to the OpenAI API Model
const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {
		"role": "user",
		"content": [{ "type": "text", "text": `Start a conversation as someone who is feeling ${personality1} today` }]
	},
  ],
  response_format: zodResponseFormat(Conversation, "conversation"),
});

let currentConversation = [];

completion.then((result) => function () {
	
	currentConversation.Add(result.choices[0].message);
	console.log(result[0].responses[0]);
});