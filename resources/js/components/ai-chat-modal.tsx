import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AIChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatModal({ open, onOpenChange }: AIChatModalProps) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message arrives
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function streamResponse(userMessage: string) {
    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    try {
      const response = await fetch("/api/vizra-adk/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "customer_support",
          messages: [{ role: "user", content: userMessage }],
          stream: true,
          temperature: 0.8,
        }),
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                aiMessage += content;
                setMessages((prev) => {
                  // If last message is AI, update it; else, add new
                  if (prev.length && prev[prev.length - 1].role === "assistant") {
                    return [...prev.slice(0, -1), { role: "assistant", content: aiMessage }];
                  } else {
                    return [...prev, { role: "assistant", content: aiMessage }];
                  }
                });
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError("Failed to stream response.");
    } finally {
      setLoading(false);
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    streamResponse(input.trim());
    setInput("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-background">
          <DialogTitle className="text-lg font-semibold">Sagsbehandler chat</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Chat med mig om alt vedrørende din sag, familieret og tips fra den virkelige verden.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-[70vh] w-full p-6">
          <div className="flex-1 overflow-y-auto mb-4 bg-muted/30 rounded-lg p-4 border">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">Start en samtale med AI sagsbehandleren</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-background border text-foreground"
                }`}>
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {error && (
            <div className="text-red-500 mb-2 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv noget..."
              disabled={loading}
              autoFocus
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="px-6 py-3"
            >
              {loading ? "Tænker..." : "Send"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
