"use client"
import { useState } from "react"
import { ChatBot } from "@/components/ChatBot"
import { MessageCircle } from "lucide-react"

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[360px] z-50">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-300">
            <div className="flex justify-between items-center bg-purple-600 text-white px-4 py-2">
              <span>Asistente Aromatta 🌿</span>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <ChatBot />
          </div>
        </div>
      )}
    </>
  )
}
