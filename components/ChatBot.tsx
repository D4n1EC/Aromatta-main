"use client"
import { useState } from "react"
import { sendToGemini } from "@/lib/gemini-chat"

export function ChatBot() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([{ from: "bot", text: "Hola 👋 ¿En qué puedo ayudarte?" }])

  const handleSend = async () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { from: "user", text: input }])
    setInput("")
    try {
      const response = await sendToGemini(input)
      setMessages((prev) => [...prev, { from: "bot", text: response }])
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Hubo un error al conectar con la IA." }])
    }
  }

  return (
    <div className="p-4 bg-white rounded-b-lg shadow max-h-96 overflow-y-auto">
      <div className="space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-${msg.from === "user" ? "right" : "left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-xl ${
                msg.from === "user" ? "bg-purple-100 text-purple-900" : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border border-gray-300 px-3 py-2 rounded-l-md"
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-4 rounded-r-md hover:bg-purple-700"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
