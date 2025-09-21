import { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { RefreshCw, Mail, CheckCircle } from 'lucide-react';
import { setOnboardingSession, getOnboardingSession, clearOnboardingSession, updateSessionActivity } from '../utils/cookies';

interface Question {
  key: string;
  text: string;
  options?: string[];
}

interface Message {
  id: number;
  sender: 'system' | 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function Onboarding() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'system', text: 'Welcome to Famlink! Let\'s get you started with a personalized onboarding experience.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<React.ReactNode>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showToastNotification = useCallback((message: React.ReactNode) => {
    setToastMessage(message);
    setShowToast(true);
    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowToast(false), 5000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startOnboarding = useCallback(async () => {
    try {
      setIsLoading(true);
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
          setIsCompleted(true);
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'assistant',
            text: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
            timestamp: new Date()
          }]);
          showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
        }
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'start') {
                  setSessionId(data.session_id);
                  setCurrentQuestion(data.question);
                  // Set cookie with session data
                  setOnboardingSession(data.session_id, {
                    answered: 0,
                    total: 16, // This should come from the backend
                    currentQuestionKey: data.question?.key,
                  });
                } else if (data.type === 'chunk') {
                  setMessages(prev => [...prev, {
                    id: Date.now(),
                    sender: 'assistant',
                    text: data.content,
                    timestamp: new Date()
                  }]);
                } else if (data.type === 'complete') {
                  setCurrentQuestion(data.question);
                  if (data.completed) {
                    setIsCompleted(true);
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      sender: 'assistant',
                      text: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
                      timestamp: new Date()
                    }]);
                    // Show toast notification
                    showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
                  }
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }

          buffer = lines[lines.length - 1]; // Keep incomplete line for next iteration
        }
      }
    } catch (error) {
      console.error('Error starting onboarding:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'system',
        text: 'Sorry, there was an error starting the onboarding process. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [showToastNotification]);

  const resumeOnboarding = useCallback(async (existingSessionId: string) => {
    try {
      setIsLoading(true);
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
          setIsCompleted(true);
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'assistant',
            text: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
            timestamp: new Date()
          }]);
          showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
        }
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'start') {
                  // Don't override sessionId for resumed sessions
                  setCurrentQuestion(data.question);
                  // Update cookie with current session data
                  updateSessionActivity(existingSessionId, {
                    answered: data.answers ? Object.keys(data.answers).length : 0,
                    total: 16,
                    currentQuestionKey: data.question?.key,
                  });
                } else if (data.type === 'chunk') {
                  setMessages(prev => [...prev, {
                    id: Date.now(),
                    sender: 'assistant',
                    text: data.content,
                    timestamp: new Date()
                  }]);
                } else if (data.type === 'complete') {
                  setCurrentQuestion(data.question);
                  if (data.completed) {
                    setIsCompleted(true);
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      sender: 'assistant',
                      text: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
                      timestamp: new Date()
                    }]);
                    // Show toast notification
                    showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
                  }
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }

          buffer = lines[lines.length - 1];
        }
      }
    } catch (error) {
      console.error('Error resuming onboarding:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'system',
        text: 'Sorry, there was an error resuming your onboarding session. Starting fresh...',
        timestamp: new Date()
      }]);
      // Fallback to starting new session
      clearOnboardingSession();
      startOnboarding();
    } finally {
      setIsLoading(false);
    }
  }, [showToastNotification, startOnboarding]);

  // Start onboarding when component mounts
  useEffect(() => {
    const existingSession = getOnboardingSession();

    if (existingSession) {
      // Resume existing session
      setIsResumed(true);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'system',
        text: `Welcome back! I've found your previous onboarding session. You were at question ${existingSession.progress.answered + 1} of ${existingSession.progress.total}. Let's continue where we left off.`,
        timestamp: new Date()
      }]);
      resumeOnboarding(existingSession.sessionId);
    } else {
      // Start new session
      startOnboarding();
    }
  }, [startOnboarding, resumeOnboarding]);

  const submitAnswer = async (answer: string) => {
    if (!currentQuestion || !sessionId) return;

    try {
      setIsLoading(true);

      // Clear input immediately when starting to submit
      setInput('');

      // Add user message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'user',
        text: answer,
        timestamp: new Date()
      }]);

      const response = await fetch('/api/onboarding/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          question_key: currentQuestion.key,
          answer: answer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit answer');
      }

      await response.json();

      // Update session activity in cookie
      updateSessionActivity(sessionId);

      // Get next question
      await getNextQuestion();

    } catch (error) {
      console.error('Error submitting answer:', error);
      // Restore the input if there was an error
      setInput(answer);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'system',
        text: `Error: ${error instanceof Error ? error.message : 'Failed to submit answer'}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextQuestion = async () => {
    try {
      const response = await fetch(`/api/onboarding/question?session_id=${sessionId}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get next question');
      }

      // Check if response is JSON (completion) or event-stream
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.completed) {
          setIsCompleted(true);
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'assistant',
            text: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
            timestamp: new Date()
          }]);
          showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
        }
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'start') {
                  // Only update sessionId if we don't have one yet
                  if (!sessionId) {
                    setSessionId(data.session_id);
                  }
                  setCurrentQuestion(data.question);
                } else if (data.type === 'chunk') {
                  setMessages(prev => [...prev, {
                    id: Date.now(),
                    sender: 'assistant',
                    text: data.content,
                    timestamp: new Date()
                  }]);
                } else if (data.type === 'complete') {
                  setCurrentQuestion(data.question);
                  if (data.completed) {
                    setIsCompleted(true);
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      sender: 'assistant',
                      text: 'Tak for dine svar! Du er nu klar til at bruge Famlink. Vi har sendt dig en email med en opsummering.',
                      timestamp: new Date()
                    }]);
                    // Show toast notification
                    showToastNotification(<span className="flex items-center gap-1"><Mail className="w-4 h-4" /> En email er blevet sendt til dig med en opsummering af dine svar!</span>);
                  }
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }

          buffer = lines[lines.length - 1];
        }
      }
    } catch (error) {
      console.error('Error getting next question:', error);
    }
  };

  const handleSend = async (e?: React.FormEvent, directAnswer?: string) => {
    if (e) e.preventDefault();

    const answerToSend = directAnswer || input.trim();
    if (!answerToSend || isLoading) return;

    await submitAnswer(answerToSend);
  };

  const handleRestart = () => {
    // Clear session and start fresh
    clearOnboardingSession();
    setMessages([
      { id: Date.now(), sender: 'system', text: 'Welcome to Famlink! Let\'s get you started with a fresh onboarding experience.', timestamp: new Date() }
    ]);
    setSessionId('');
    setCurrentQuestion(null);
    setIsCompleted(false);
    setIsResumed(false);
    setInput('');
    startOnboarding();
  };

  const handleSkip = () => {
    if (isCompleted) {
      router.visit('/dashboard');
    }
  };

  const handleOptionClick = async (option: string) => {
    if (isLoading) return;

    // Submit immediately with the selected option
    await handleSend(undefined, option);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-white hover:text-green-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Famlink Onboarding
              </h1>
              {isResumed && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <RefreshCw className="w-4 h-4" />
                  Resumed session
                </p>
              )}
              {currentQuestion && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Question {currentQuestion.key}
                </p>
              )}
            </div>
            {!isCompleted && (
              <button
                onClick={handleRestart}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition"
                title="Restart onboarding"
              >
                <RefreshCw className="w-4 h-4 mr-1 inline" />
                Restart
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : msg.sender === 'assistant'
                    ? 'bg-green-100 dark:bg-green-800 text-gray-900 dark:text-gray-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!isCompleted ? (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {/* Option buttons */}
              {currentQuestion?.options && currentQuestion.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      disabled={isLoading}
                      className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={(e) => handleSend(e)} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Type your answer..."
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSkip}
                className="w-full px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
