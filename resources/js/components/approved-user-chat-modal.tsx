import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, Sparkles, MessageSquare, Shield, Users, FileText, Clock, Send } from 'lucide-react';

// Approved user chat modal for authenticated users with role-based access
interface ApprovedUserChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApprovedUserChatModal({ open, onOpenChange }: ApprovedUserChatModalProps) {
  const [messages, setMessages] = useState<{ id: string; role: string; content: React.ReactNode; timestamp?: string; isTyping?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
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

  const loadMessages = useCallback(async (retryCount = 0) => {
    // Skip API calls in test environments
    if (window.location.hostname === '127.0.0.1' || window.location.hostname.includes('test')) {
      setLoadingMessages(false);
      return;
    }

    const maxRetries = 3;
    const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff

    setLoadingMessages(true);
    setError(null);

    try {
      // Use fetch with credentials for session authentication
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/chat/messages', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin', // Include session cookies
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          throw new Error('Du er ikke logget ind. Genindlæs siden og prøv igen.');
        } else if (response.status === 403) {
          throw new Error('Du har ikke adgang til denne funktion.');
        } else if (response.status === 429) {
          throw new Error('For mange anmodninger. Vent et øjeblik og prøv igen.');
        } else if (response.status >= 500) {
          throw new Error('Serverfejl. Prøv igen om et øjeblik.');
        } else {
          throw new Error(`Kunne ikke indlæse beskeder (${response.status})`);
        }
      }

      const data = await response.json();

      if (!data.messages) {
        throw new Error('Ugyldigt svar fra serveren');
      }

      setMessages(data.messages || []);
      setSessionId(data.session_id);
      setError(null); // Clear any previous errors

    } catch (err: unknown) {
      console.error('Error loading messages:', err);

      // Handle different types of errors
      let errorMessage = 'Kunne ikke indlæse beskeder.';

      const error = err as Error;
      if (error.name === 'AbortError') {
        errorMessage = 'Anmodningen tog for lang tid. Tjek din internetforbindelse.';
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Netværksfejl. Tjek din internetforbindelse og prøv igen.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Retry logic for network errors
      if (retryCount < maxRetries && (
        error.name === 'AbortError' ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.message?.includes('Serverfejl')
      )) {
        console.log(`Retrying message load (attempt ${retryCount + 1}/${maxRetries}) in ${retryDelay}ms...`);
        setTimeout(() => loadMessages(retryCount + 1), retryDelay);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Function to restart chat session
  const handleRestart = () => {
    setMessages([]);
    setInput("");
    setSessionId(null);
    setError(null);
    // Start new session
    loadMessages();
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input field when modal opens
  React.useEffect(() => {
    if (open && !loading && !isTyping && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, loading, isTyping]);

  // Load messages when modal opens
  React.useEffect(() => {
    if (open && window.location.hostname !== '127.0.0.1') {
      loadMessages();
    } else {
      // Clean up any ongoing typing effects
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setMessages([]);
      setInput("");
      setSessionId(null);
      setIsTyping(false);
    }
  }, [open, loadMessages]);

  // Handle sending message
  const handleSend = async (e?: React.FormEvent, retryCount = 0) => {
    if (e) e.preventDefault();

    const messageToSend = input.trim();
    if (!messageToSend || loading || isTyping) return;

    const maxRetries = 2;
    const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff

    setLoading(true);
    setError(null);

    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageToSend,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Use fetch with credentials for session authentication
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for streaming

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        credentials: 'same-origin', // Include session cookies
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          throw new Error('Du er ikke logget ind. Genindlæs siden og prøv igen.');
        } else if (response.status === 403) {
          throw new Error('Du har ikke adgang til denne funktion.');
        } else if (response.status === 429) {
          throw new Error('For mange anmodninger. Vent et øjeblik og prøv igen.');
        } else if (response.status >= 500) {
          throw new Error('Serverfejl. Prøv igen om et øjeblik.');
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Kunne ikke sende besked (${response.status})`);
        }
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        // Add empty AI message that will be filled by streaming
        const aiMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: '',
          timestamp: new Date().toISOString(),
          isTyping: true
        }]);

        let hasReceivedData = false;
        const streamTimeout = setTimeout(() => {
          if (!hasReceivedData) {
            controller.abort();
            throw new Error('Streaming timeout - ingen data modtaget');
          }
        }, 10000);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          hasReceivedData = true;
          clearTimeout(streamTimeout);

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'chunk' && data.content) {
                  // Update the AI message with streaming content
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const aiMessage = newMessages[aiMessageIndex - 1];
                    if (aiMessage) {
                      aiMessage.content = (aiMessage.content || '') + data.content;
                    }
                    return newMessages;
                  });
                } else if (data.type === 'complete') {
                  // Mark as not typing
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const aiMessage = newMessages[aiMessageIndex - 1];
                    if (aiMessage) {
                      aiMessage.isTyping = false;
                    }
                    return newMessages;
                  });
                  setSessionId(data.session_id);
                  break;
                } else if (data.type === 'error') {
                  throw new Error(data.message || 'Der opstod en fejl under streaming.');
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError);
                throw new Error('Ugyldigt svar fra serveren');
              }
            }
          }
        }
      }

    } catch (err: unknown) {
      console.error('Error sending message:', err);

      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1));
      setInput(messageToSend); // Restore the input

      // Handle different types of errors
      let errorMessage = 'Kunne ikke sende besked.';

      const error = err as Error;
      if (error.name === 'AbortError') {
        errorMessage = 'Anmodningen tog for lang tid. Tjek din internetforbindelse.';
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Netværksfejl. Tjek din internetforbindelse og prøv igen.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Retry logic for network errors
      if (retryCount < maxRetries && (
        error.name === 'AbortError' ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.message?.includes('Serverfejl') ||
        error.message?.includes('timeout')
      )) {
        console.log(`Retrying message send (attempt ${retryCount + 1}/${maxRetries}) in ${retryDelay}ms...`);
        setTimeout(() => handleSend(undefined, retryCount + 1), retryDelay);
        return;
      }

      setError(errorMessage);

      // Show detailed error for admin users (this will be checked on backend)
      if (error.message?.includes('admin')) {
        showToastNotification(<span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Admin fejl: {error.message}</span>);
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
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

      <DialogContent className="w-[95vw] md:w-[80vw] lg:w-[70vw] max-w-none h-[95vh] flex flex-col bg-white dark:bg-gray-900 shadow-2xl p-0 border-0">
        <DialogHeader className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 pb-4 from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="flex items-center justify-between px-6 py-1">
            <div>
              <DialogTitle className="text-xl pt-2 font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Famlink AI Assistant
              </DialogTitle>
              <DialogDescription className="text-xs mt-2 text-blue-700 dark:text-blue-300">
                Få hjælp og svar på spørgsmål om Famlink og dine sager.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[70vh] w-full">
          <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mx-6 mt-6">
            {loadingMessages && messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                </div>
                <p className="text-sm font-medium">Indlæser beskeder...</p>
                <p className="text-xs text-gray-400 mt-1">Forbinder til AI-assistenten</p>
              </div>
            )}
            {messages.length === 0 && !loadingMessages && !error && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium">Start en samtale</p>
                <p className="text-xs text-gray-400 mt-1">Stil spørgsmål om Famlink eller dine sager</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block max-w-[80%] px-4 py-3 rounded-lg text-sm shadow-sm ${msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
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
            <div className="mx-6 mb-4 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Forbindelsesfejl</p>
                    <p className="text-xs opacity-90">{error}</p>
                  </div>
                </div>
                <Button
                  onClick={() => loadMessages()}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/20"
                  disabled={loadingMessages}
                >
                  {loadingMessages ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Prøv igen
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="mx-6 mb-6">
            <div className="flex items-center justify-between mb-3">
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
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                ref={inputRef}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Skriv dit spørgsmål..."
                disabled={loading || isTyping}
                autoFocus
              />
              <Button
                type="submit"
                disabled={loading || !input.trim() || isTyping}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {isTyping ? "AI skriver..." : loading ? "Sender..." : "Send"}
                {!loading && !isTyping && <Send className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </div>
        </div>

        {/* Helpful Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-b-lg">
          <div className="grid grid-cols-3 gap-4 text-[10px] text-gray-500 dark:text-gray-400">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Sikker kommunikation</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Rolle-baseret adgang</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>Intelligente svar</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>AI-drevet assistance</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Famlink Platform</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Fortrolig</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Familie-fokuseret</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
