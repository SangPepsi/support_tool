"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X } from "lucide-react"

type ChatMessage = { role: "user" | "assistant"; content: string }

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Xin chào! Mình là chatbot hỗ trợ VNPAY. Bạn cần hỏi gì?"
    }
  ])

  useEffect(() => {
    const stored = sessionStorage.getItem("vnpay_chat_history")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      } catch {
        // ignore invalid storage
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem("vnpay_chat_history", JSON.stringify(messages))
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    const nextMessages = [...messages, { role: "user", content: userMessage }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: nextMessages.slice(-10)
        })
      })
      const text = await res.text()
      let data: any = {}
      try {
        data = JSON.parse(text)
      } catch {
        data = { reply: text }
      }
      const reply =
        data?.reply ||
        (res.ok
          ? data?.detail || data?.error
          : `Lỗi gọi chatbot: ${data?.detail || data?.error || res.status}`) ||
        "Xin lỗi, mình chưa có câu trả lời phù hợp."
      setMessages(prev => [...prev, { role: "assistant", content: reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Có lỗi khi gọi chatbot. Vui lòng thử lại." }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <Button
          className="rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
      {open && (
        <Card className="w-[380px] shadow-2xl border-border bg-card/95 backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
          <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/60">
            <CardTitle className="flex items-center gap-2 text-sm text-card-foreground">
              <img
                src="/icon-dark-32x32.png"
                alt="VNPAY"
                className="h-5 w-5 rounded-sm"
              />
              VNPAY Chatbot
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-[320px] overflow-auto space-y-2 pr-1">
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}`}
                  className={
                    msg.role === "user"
                      ? "text-right"
                      : "text-left"
                  }
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "inline-block rounded-2xl bg-primary px-3 py-2 text-xs text-primary-foreground shadow-sm"
                        : "inline-block rounded-2xl bg-secondary px-3 py-2 text-xs text-foreground"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-muted-foreground">Đang trả lời...</div>
              )}
            </div>
            <div className="space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                className="min-h-[60px] bg-secondary border-border text-xs focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                Gửi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
