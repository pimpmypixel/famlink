import React, { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setOnboardingSession, getOnboardingSession, clearOnboardingSession, updateSessionActivity } from '../utils/cookies';
import { RefreshCw, Mail, CheckCircle, Sparkles, MessageSquare, Shield, Users, FileText, Clock } from 'lucide-react';

// Onboarding chat modal for welcome page
interface AIChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatModal({ open, onOpenChange }: AIChatModalProps) {
  const [messages, setMessages] = useState<{ id: string; role: string; content: React.ReactNode; timestamp?: string; isTyping?: boolean }[]>([]);
  const [question, setQuestion] = useState<{ key: string; text: string; options?: string[] } | null>(null);
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

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<React.ReactNode>('');

  // Function to show toast
  const showToastNotification = useCallback((message: React.ReactNode) => {
    setToastMessage(message);
    setShowToast(true);
    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowToast(false), 5000);
  }, []);

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
  const streamText = useCallback((fullText: React.ReactNode, messageIndex: number, speed: number = 50) => {
    setIsTyping(true);
    let currentText = '';
    const words = typeof fullText === 'string' ? fullText.split(' ') : [''];
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
  }, []);

  // Cleanup typing timeout on unmount
  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

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

  const startOnboarding = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // First try to get the question - it might return JSON if completed
      const response = await fetch('/api/onboarding/question', {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start onboarding');
      }

      // Check if response is JSON (completion) or event-stream
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.completed) {
          setCompleted(true);
          setMessages([{
            id: `msg-${Date.now()}`,
            role: "agent",
            content: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
            timestamp: new Date().toISOString()
          }]);
          showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
          setLoading(false);
          return;
        }
      }

      // Use EventSource for streaming
      const eventSource = new EventSource(`/api/onboarding/question?_token=${csrfToken}`);

      let currentMessage = '';

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'start') {
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
          // Check if onboarding is completed
          if (data.completed === true) {
            setCompleted(true);
            // Add completion message with streaming effect
            const completionMessage = <span className="flex items-center gap-1">Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering. <Sparkles className="w-4 h-4" /></span>;
            setMessages([{
              id: `msg-${Date.now()}`,
              role: "agent",
              content: '',
              timestamp: new Date().toISOString(),
              isTyping: true
            }]);
            // Start streaming into the newly added message
            setTimeout(() => streamText(completionMessage, 0), 0);
            // Show toast notification
            showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
            eventSource.close();
            setLoading(false);
            return;
          }

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

    } catch {
      setError("Kunne ikke starte onboarding chatten.");
      setLoading(false);
    }
  }, [streamText, showToastNotification]);

  const resumeOnboarding = useCallback(async (existingSessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // First try to get the question - it might return JSON if completed
      const response = await fetch(`/api/onboarding/question?session_id=${existingSessionId}&resumed=true`, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to resume onboarding');
      }

      // Check if response is JSON (completion) or event-stream
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.completed) {
          setCompleted(true);
          setMessages([{
            id: `msg-${Date.now()}`,
            role: "agent",
            content: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
            timestamp: new Date().toISOString()
          }]);
          showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
          setLoading(false);
          return;
        }
      }

      // Use EventSource for streaming with resumed session
      const eventSource = new EventSource(`/api/onboarding/question?session_id=${existingSessionId}&resumed=true&_token=${csrfToken}`);

      let currentMessage = '';

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'start') {
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
          // Check if onboarding is completed
          if (data.completed === true) {
            setCompleted(true);
            // Add completion message with streaming effect
            const completionMessage = <span className="flex items-center gap-1">Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering. <Sparkles className="w-4 h-4" /></span>;
            setMessages([{
              id: `msg-${Date.now()}`,
              role: "agent",
              content: '',
              timestamp: new Date().toISOString(),
              isTyping: true
            }]);
            // Start streaming into the newly added message
            setTimeout(() => streamText(completionMessage, 0), 0);
            // Show toast notification
            showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
            eventSource.close();
            setLoading(false);
            return;
          }

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

    } catch {
      setError("Kunne ikke genoptage onboarding chatten.");
      setLoading(false);
    }
  }, [streamText, showToastNotification]);

  // Handle modal open/close and session management
  React.useEffect(() => {
    if (open) {
      const existingSession = getOnboardingSession();
      if (existingSession) {
        setIsResumed(true);
        setMessages([{
          id: `msg-${Date.now()}`,
          role: "agent",
          content: <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Velkommen tilbage! Jeg har fundet din tidligere onboarding-session. Du var ved spørgsmål ${existingSession.progress.answered + 1} af ${existingSession.progress.total}. Lad os fortsætte, hvor vi slap.</span>,

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
  }, [open, startOnboarding, resumeOnboarding]);

  // Function to handle option button clicks
  const handleOptionClick = async (option: string) => {
    if (!question || !sessionId || loading || isTyping) return;

    // Submit immediately with the selected option
    await handleSendWithOption(option);
  };

  // Modified handleSend to accept an optional direct answer
  async function handleSend(e?: React.FormEvent, directAnswer?: string) {
    if (e) e.preventDefault();

    const answerToSend = directAnswer || input.trim();
    if (!answerToSend || !question || !sessionId) return;

    setLoading(true);
    setError(null);

    // Show user answer
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, role: "user", content: answerToSend, timestamp: new Date().toISOString() }
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
          answer: answerToSend,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const result = await response.json();
      const updatedSessionId = result.session_id || sessionId;
      setSessionId(updatedSessionId);

      // Check if onboarding is completed from the POST response
      if (result.completed === true) {
        setCompleted(true);
        // Add completion message with streaming effect
        const completionMessage = <span className="flex items-center gap-1">Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering. <Sparkles className="w-4 h-4" /></span>;
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
        // Show toast notification
        showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
        setLoading(false);
        return;
      }

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
            const completionMessage = <span className="flex items-center gap-1">Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering. <Sparkles className="w-4 h-4" /></span>;
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
            // Show toast notification
            showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
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

    } catch {
      setError("Kunne ikke sende svar.");
      setLoading(false);
    }
  }

  // Helper function for option clicks
  const handleSendWithOption = async (option: string) => {
    await handleSend(undefined, option);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-600 flex items-center gap-3 max-w-md">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-white hover:text-green-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <DialogContent className="w-[95vw] md:w-[80vw] lg:w-[70vw] max-w-none h-[95vh] flex flex-col bg-white dark:bg-gray-900 dark:border-blue-400 shadow-2xl p-0">
        <DialogHeader className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 pb-4 from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <DialogTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Onboarding Chat
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-700 dark:text-blue-300">
                {completed
                  ? "Onboarding er fuldført! Du kan nu begynde at bruge Famlink."
                  : isResumed
                  ? <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Genoptaget session - fortsæt hvor du slap</span>
                  : "Besvar spørgsmålene for at oprette din profil og få personlig hjælp."
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col h-[70vh] w-full">
          <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mx-6 mt-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium">Start onboarding chatten</p>
                <p className="text-xs text-gray-400 mt-1">Besvar spørgsmålene for at komme i gang</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block max-w-[80%] px-4 py-3 rounded-lg text-sm shadow-sm ${msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto border border-blue-700"
                  : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  }`}>
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                  {msg.isTyping && (
                    <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse"></span>
                  )}
                </div>
                {msg.timestamp && (
                  <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
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
            <div className="mx-6 mb-4 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Option buttons */}
          {!completed && question?.options && question.options.length > 0 && (
            <div className="mx-6 mb-4 flex flex-wrap gap-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOptionClick(option)}
                  disabled={loading || isTyping}
                  className="text-xs px-3 py-2 h-auto whitespace-nowrap border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

            {!completed && (
              <div className="mx-6 mb-6">
                <form onSubmit={(e) => handleSend(e)} className="flex gap-3">
                  <input
                    ref={inputRef}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Skriv dit svar..."
                    disabled={loading || isTyping}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    disabled={loading || !input.trim() || isTyping}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700 transition-colors"
                  >
                    {isTyping ? "AI skriver..." : loading ? "Sender..." : "Send"}
                  </Button>
                </form>
                <div className="flex justify-center mt-3">
                  <Button
                    onClick={handleRestart}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-6 px-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Genstart
                  </Button>
                </div>
              </div>
            )}
          {completed && (
            <div className="mx-6 mb-6 text-center">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-3 text-green-700 dark:text-green-400 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-semibold">Onboarding fuldført!</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Tak for dine svar! Du kan nu begynde at bruge Famlink.
                </p>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700 transition-colors"
              >
                Luk chat
              </Button>
            </div>
          )}
        </div>

        {/* Helpful Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-b-lg">
          <div className="grid grid-cols-3 gap-4 text-[10px] text-gray-500 dark:text-gray-400">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Sikker onboarding</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Personlig assistance</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>Intelligente svar</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Session gemmes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>AI-drevet onboarding</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Famlink Platform</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Family Focused</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
