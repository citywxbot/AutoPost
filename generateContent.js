import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateContent() {
  const chatRes = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Give me a short, original, inspiring quote for social media." }],
    model: "gpt-4",
  });

  const quote = chatRes.choices[0].message.content.trim();

  const imageRes = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Create a high-quality image inspired by this quote: "${quote}"`,
    n: 1,
    size: "1024x1024"
  });

  const imageUrl = imageRes.data[0].url;
  const imagePath = path.join('quote-image.png');
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(imagePath, Buffer.from(buffer));

  return { quote, imagePath };
}