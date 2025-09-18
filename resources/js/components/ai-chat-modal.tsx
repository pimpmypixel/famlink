import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Onboarding chat modal for welcome page
interface AIChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatModal({ open, onOpenChange }: AIChatModalProps) {
  const [messages, setMessages] = useState<{ role: string; content: string; timestamp?: string }[]>([]);
  const [question, setQuestion] = useState<{ id: number; text: string } | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      startOnboarding();
    } else {
      setMessages([]);
      setQuestion(null);
      setInput("");
      setCompleted(false);
    }
  }, [open]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input field after each question or message update
  React.useEffect(() => {
    if (open && !completed && !loading && inputRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [question, messages, loading, open, completed]);

  async function startOnboarding() {
    setLoading(true);
    setError(null);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch("/api/onboarding/question", {
        method: "GET",
        headers: {
          "X-CSRF-TOKEN": csrfToken || ""
        }
      });
      const data = await res.json();
      if (data.question) {
        setQuestion(data.question);
        setCompleted(false);
        setInput(""); // Clear input for new question
        // Use agent message if available, otherwise fallback to question text
        const messageContent = data.agent_message || data.question.text;
        setMessages([
          { role: "agent", content: messageContent, timestamp: new Date().toISOString() }
        ]);
      } else {
        setCompleted(true);
        setMessages([
          { role: "agent", content: data.message || "Tak for dine svar! Din profil er nu oprettet.", timestamp: new Date().toISOString() }
        ]);
      }
    } catch (err) {
      setError("Kunne ikke hente onboarding spørgsmål.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !question) return;
    setLoading(true);
    setError(null);
    // Show user answer
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input.trim(), timestamp: new Date().toISOString() }
    ]);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch("/api/onboarding/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || ""
        },
        body: JSON.stringify({ question_id: question.id, answer: input.trim() })
      });
      const data = await res.json();
      if (data.next_question) {
        setQuestion(data.next_question);
        setInput(""); // Clear input for new question
        // Use agent message if available, otherwise fallback to question text
        const messageContent = data.agent_message || data.next_question.text;
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: messageContent, timestamp: new Date().toISOString() }
        ]);
      } else {
        setCompleted(true);
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: data.message || "Tak for dine svar! Din profil er nu oprettet.", timestamp: new Date().toISOString() }
        ]);
      }
      setInput("");
    } catch (err) {
      setError("Kunne ikke sende svar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-background">
          <DialogTitle className="text-lg font-semibold">Onboarding chat</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Besvar spørgsmålene for at oprette din profil og få personlig hjælp.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-[70vh] w-full p-6">
          <div className="flex-1 overflow-y-auto mb-4 bg-muted/30 rounded-lg p-4 border">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">Start onboarding chatten</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg text-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-background border text-foreground"
                  }`}>
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                </div>
                {msg.timestamp && (
                  <div className={`text-xs text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {new Date(msg.timestamp).toLocaleString('da-DK', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {error && (
            <div className="text-red-500 mb-2 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
          {!completed && (
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                ref={inputRef}
                className="flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Skriv dit svar..."
                disabled={loading}
                autoFocus
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3"
              >
                {loading ? "Sender..." : "Send"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
