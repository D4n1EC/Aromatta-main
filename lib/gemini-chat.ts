import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyARgI-_0aFnRR4qsxrP_f3QQY9oFLHu-5k") // Reemplaza con tu clave real

export async function sendToGemini(message: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 100,
    },
  })

  const result = await chat.sendMessage(message)
  const response = await result.response
  return response.text()
}
