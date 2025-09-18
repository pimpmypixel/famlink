import { useState } from 'react';

export default function Onboarding() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Welcome to Famlink! How can we help you get started?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: messages.length + 1, sender: 'guest', text: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Onboarding Chat</h1>
        <div className="flex flex-col gap-2 mb-4 h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-2 bg-gray-100 dark:bg-gray-700">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'guest' ? 'justify-end' : 'justify-start'}`}>
              <span className={`px-3 py-2 rounded-lg text-sm ${msg.sender === 'guest' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100'}`}>{msg.text}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Type your message..."
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
