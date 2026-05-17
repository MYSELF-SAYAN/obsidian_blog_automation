import OpenAI from "openai";
import { config } from "../config";
import { ScrapedContent } from "../types";
import logger from "../logger";

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function convertToMarkdown(
  scrapedContent: ScrapedContent,
): Promise<string> {
  const prompt = `Convert the following blog content into well-structured markdown format. Output ONLY the raw markdown - no code fences, no metadata, no backticks.

Title: ${scrapedContent.title}
Source URL: ${scrapedContent.url}
Author: ${scrapedContent.author || "Unknown"}
Published Date: ${scrapedContent.publishedDate || "Unknown"}

Content:
${scrapedContent.content}

Requirements:
1. Start with H1 header with the title
2. Add a brief metadata section (Source, Published, Tags) after the title
3. Use H2 for main sections, H3 for subsections
4. Preserve code blocks with proper language hints
5. Add bullet points or numbered lists where appropriate
6. Keep the markdown clean and readable
7. Preserve important technical terms and code snippets
8. Do NOT use markdown code fences (no \`\`\`)
9. Should not have more than 300 words
`;

  logger.ai(`Converting content to markdown: "${scrapedContent.title}"`);

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "You are an expert markdown formatter. Always output clean, well-structured markdown.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });

  const markdown = response.choices[0].message.content || "";
  logger.ai(`Markdown generated, length: ${markdown.length} characters`);

  return markdown;
}
