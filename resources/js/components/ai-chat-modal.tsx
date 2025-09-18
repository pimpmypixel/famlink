import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setOnboardingSession, getOnboardingSession, clearOnboardingSession, updateSessionActivity } from '../utils/cookies';

// Onboarding chat modal for welcome page
interface AIChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatModal({ open, onOpenChange }: AIChatModalProps) {
  const [messages, setMessages] = useState<{ id: string; role: string; content: string; timestamp?: string; isTyping?: boolean }[]>([]);
  const [question, setQuestion] = useState<{ key: string; text: string } | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to restart onboarding
  const handleRestart = () => {
    clearOnboardingSession();
    setMessages([]);
    setQuestion(null);
    setInput("");
    setCompleted(false);
    setSessionId(null);
    setIsResumed(false);
    setError(null);
    startOnboarding();
  };

  // Function to create streaming words effect
  const streamText = (fullText: string, messageIndex: number, speed: number = 50) => {
    setIsTyping(true);
    let currentText = '';
    const words = fullText.split(' ');
    let wordIndex = 0;

    const typeNextWord = () => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        wordIndex++;

        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[messageIndex]) {
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              content: currentText,
              isTyping: true
            };
          }
          return newMessages;
        });

        typingTimeoutRef.current = setTimeout(typeNextWord, speed);
      } else {
        // Finished typing
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[messageIndex]) {
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              content: fullText,
              isTyping: false
            };
          }
          return newMessages;
        });
        setIsTyping(false);
      }
    };

    typeNextWord();
  };

  // Cleanup typing timeout on unmount
  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (open) {
      const existingSession = getOnboardingSession();
      if (existingSession) {
        setIsResumed(true);
        setMessages([{
          id: `msg-${Date.now()}`,
          role: "agent",
          content: `🔄 Welcome back! I've found your previous onboarding session. You were at question ${existingSession.progress.answered + 1} of ${existingSession.progress.total}. Let's continue where we left off.`,
          timestamp: new Date().toISOString()
        }]);
        resumeOnboarding(existingSession.sessionId);
      } else {
        startOnboarding();
      }
    } else {
      // Clean up any ongoing typing effects
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setMessages([]);
      setQuestion(null);
      setInput("");
      setCompleted(false);
      setSessionId(null);
      setIsTyping(false);
      setIsResumed(false);
    }
  }, [open]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input field after each question or message update
  React.useEffect(() => {
    if (open && !completed && !loading && !isTyping && inputRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [question, messages, loading, open, completed, isTyping]);

  async function startOnboarding() {
    setLoading(true);
    setError(null);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // Use EventSource for streaming
      const eventSource = new EventSource(`/api/onboarding/question?_token=${csrfToken}`);

      let currentMessage = '';
      let currentQuestion = null;
      let currentSessionId = null;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'start') {
          currentQuestion = data.question;
          currentSessionId = data.session_id;
          setQuestion(data.question);
          setSessionId(data.session_id);
          setCompleted(false);
          setInput('');
          // Set cookie with session data
          setOnboardingSession(data.session_id, {
            answered: 0,
            total: 16, // This should come from the backend
            currentQuestionKey: data.question?.key,
          });
          // Start with empty message that will be filled by streaming
          setMessages([{
            id: `msg-${Date.now()}`,
            role: "agent",
            content: '',
            timestamp: new Date().toISOString(),
            isTyping: true
          }]);
        } else if (data.type === 'chunk') {
          currentMessage += data.content;
          // For streaming effect, we'll handle this differently
          // Just accumulate the message for now
        } else if (data.type === 'complete') {
          // Start streaming the accumulated message
          if (currentMessage.trim()) {
            // The message was already added in the 'start' event, so stream into index 0
            streamText(currentMessage.trim(), 0);
          }
          eventSource.close();
          setLoading(false);
        } else if (data.type === 'error') {
          setError(data.message || 'Der opstod en fejl med streaming.');
          // Don't stop the chat, just show error and continue
          if (data.fallback) {
            setMessages([{
              id: `msg-${Date.now()}`,
              role: "agent",
              content: data.fallback,
              timestamp: new Date().toISOString()
            }]);
          }
          eventSource.close();
          setLoading(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        // Don't show error to user, just try to continue
        // The chat should still work even if streaming fails
        setLoading(false);
        // Close the connection but don't stop the flow
        eventSource.close();
      };

    } catch (err) {
      setError("Kunne ikke starte onboarding chatten.");
      setLoading(false);
    }
  }

  async function resumeOnboarding(existingSessionId: string) {
    setLoading(true);
    setError(null);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // Use EventSource for streaming with resumed session
      const eventSource = new EventSource(`/api/onboarding/question?session_id=${existingSessionId}&resumed=true&_token=${csrfToken}`);

      let currentMessage = '';
      let currentQuestion = null;
      let currentSessionId = null;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'start') {
          currentQuestion = data.question;
          currentSessionId = data.session_id;
          setQuestion(data.question);
          setSessionId(data.session_id);
          setCompleted(false);
          setInput('');
          // Update cookie with current session data
          updateSessionActivity(data.session_id, {
            answered: data.answers ? Object.keys(data.answers).length : 0,
            total: 16,
            currentQuestionKey: data.question?.key,
          });
          // Start with empty message that will be filled by streaming
          setMessages([{
            id: `msg-${Date.now()}`,
            role: "agent",
            content: '',
            timestamp: new Date().toISOString(),
            isTyping: true
          }]);
        } else if (data.type === 'chunk') {
          currentMessage += data.content;
          // For streaming effect, we'll handle this differently
          // Just accumulate the message for now
        } else if (data.type === 'complete') {
          // Start streaming the accumulated message
          if (currentMessage.trim()) {
            // The message was already added in the 'start' event, so stream into index 0
            streamText(currentMessage.trim(), 0);
          }
          eventSource.close();
          setLoading(false);
        } else if (data.type === 'error') {
          setError(data.message || 'Der opstod en fejl med streaming.');
          // Don't stop the chat, just show error and continue
          if (data.fallback) {
            setMessages([{
              id: `msg-${Date.now()}`,
              role: "agent",
              content: data.fallback,
              timestamp: new Date().toISOString()
            }]);
          }
          eventSource.close();
          setLoading(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        // Don't show error to user, just try to continue
        // The chat should still work even if streaming fails
        setLoading(false);
        // Close the connection but don't stop the flow
        eventSource.close();
      };

    } catch (err) {
      setError("Kunne ikke genoptage onboarding chatten.");
      setLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !question || !sessionId) return;
    setLoading(true);
    setError(null);

    // Store the current message count before adding user message
    const currentMessageCount = messages.length;

    // Show user answer
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, role: "user", content: input.trim(), timestamp: new Date().toISOString() }
    ]);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // First, submit the answer via POST
      const response = await fetch('/api/onboarding/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({
          question_key: question.key,
          answer: input.trim(),
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const result = await response.json();
      const updatedSessionId = result.session_id || sessionId;
      setSessionId(updatedSessionId);

      // Update session activity in cookie
      updateSessionActivity(updatedSessionId);

      // Then use EventSource to stream the next question
      const eventSource = new EventSource(`/api/onboarding/stream/${updatedSessionId}?_token=${csrfToken}`);

      let currentMessage = '';
      let nextQuestion: { key: string; text: string } | null = null;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'start') {
          nextQuestion = data.question;
          setInput(''); // Clear input immediately
        } else if (data.type === 'chunk') {
          currentMessage += data.content;
          // For streaming effect, accumulate but don't update UI yet
        } else if (data.type === 'complete') {
          // Check if onboarding is completed
          if (data.completed === true) {
            setCompleted(true);
            // Add completion message with streaming effect
            const completionMessage = data.message || "Tak for dine svar! Du er nu klar til at bruge Famlink. Velkommen! 🎉";
            setMessages(prev => {
              const newMessages = [...prev, {
                id: `msg-${Date.now()}`,
                role: "agent",
                content: '',
                timestamp: new Date().toISOString(),
                isTyping: true
              }];
              // Start streaming into the newly added message
              setTimeout(() => streamText(completionMessage, newMessages.length - 1), 0);
              return newMessages;
            });
            eventSource.close();
            setLoading(false);
            return;
          }

          // Update with final content and set the next question
          if (nextQuestion) {
            setQuestion(nextQuestion);
          }

          // Start streaming the accumulated message
          if (currentMessage.trim()) {
            setMessages(prev => {
              const newMessages = [...prev, {
                id: `msg-${Date.now()}`,
                role: "agent",
                content: '',
                timestamp: new Date().toISOString(),
                isTyping: true
              }];
              const newMessageIndex = newMessages.length - 1;
              // Start streaming into the newly added message
              setTimeout(() => streamText(currentMessage.trim(), newMessageIndex), 0);
              return newMessages;
            });
          }

          eventSource.close();
          setLoading(false);
        } else if (data.type === 'error') {
          setError(data.message || 'Der opstod en fejl med streaming.');
          // Don't stop the chat, just show error and continue
          if (data.fallback) {
            setMessages(prev => [...prev, {
              id: `msg-${Date.now()}`,
              role: "agent",
              content: data.fallback,
              timestamp: new Date().toISOString()
            }]);
          }
          eventSource.close();
          setLoading(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        // Don't show error to user for EventSource errors, just continue
        // The chat should still work even if streaming fails
        setLoading(false);
        eventSource.close();
      };

    } catch (err) {
      setError("Kunne ikke sende svar.");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">Onboarding chat</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {completed
                  ? "Onboarding er fuldført! Du kan nu begynde at bruge Famlink."
                  : isResumed
                  ? "🔄 Genoptaget session - fortsæt hvor du slap"
                  : "Besvar spørgsmålene for at oprette din profil og få personlig hjælp."
                }
              </DialogDescription>
            </div>
            {!completed && (
              <Button
                onClick={handleRestart}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                🔄 Genstart
              </Button>
            )}
          </div>
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
                  {msg.isTyping && (
                    <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse"></span>
                  )}
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
                disabled={loading || isTyping}
                autoFocus
              />
              <Button
                type="submit"
                disabled={loading || !input.trim() || isTyping}
                className="px-6 py-3"
              >
                {isTyping ? "AI skriver..." : loading ? "Sender..." : "Send"}
              </Button>
            </form>
          )}
          {completed && (
            <div className="text-center py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Onboarding fuldført!</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Tak for dine svar! Du kan nu begynde at bruge Famlink.
                </p>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="px-6 py-2"
              >
                Luk chat
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
