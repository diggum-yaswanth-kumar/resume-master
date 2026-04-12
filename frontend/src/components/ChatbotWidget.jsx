import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, SendHorizontal, Sparkles, X } from 'lucide-react';
import api from '../services/api';

const starterPrompts = [
  'How can I improve my resume for ATS screening?',
  'What should I include in a strong software engineer resume?',
  'How do I prepare for a job interview after applying?',
];

const initialMessages = [
  {
    role: 'assistant',
    content: 'Ask me about resumes, ATS tips, interview prep, or job applications. I can help right from this page.',
  },
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;

    const userMessage = { role: 'user', content: message };
    const history = messages.map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/chatbot', { message, history });
      setMessages((current) => [...current, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      const messageText = err.response?.data?.detail;
      const friendlyMessage =
        typeof messageText === 'string'
          ? messageText
          : 'The chatbot is unavailable right now. Check the backend and Gemini key.';
      setError(friendlyMessage);
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: 'I could not answer just now. Please try again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[28px] border border-cyan-400/20 bg-slate-950 text-white shadow-[0_20px_80px_rgba(14,165,233,0.25)] backdrop-blur xl:max-w-md">
          <div className="bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_55%),linear-gradient(180deg,#0f172a_0%,#020617_100%)] p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-100">
                  AI Copilot
                </div>
                <h2 className="text-2xl font-extrabold leading-tight">Chat with Resume Master AI</h2>
                <p className="mt-2 text-sm text-slate-300">Get resume tips, ATS help, and job-search advice in real time.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/90 text-white transition hover:bg-cyan-400"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-blue-400/20 bg-slate-900/70 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-slate-800"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-3">
              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-200">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {error && (
                <div className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-3 flex items-end gap-3">
                <label className="sr-only" htmlFor="chatbot-input">Ask the chatbot</label>
                <textarea
                  id="chatbot-input"
                  rows={2}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSubmit(event);
                    }
                  }}
                  placeholder="Ask about resumes, ATS keywords, interview prep..."
                  className="min-h-[60px] flex-1 resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex h-[60px] items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <SendHorizontal className="h-4 w-4" />
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-4 text-base font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.5)] transition hover:-translate-y-0.5 hover:brightness-110"
      >
        {isOpen ? <Sparkles className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        {isOpen ? 'AI Ready' : 'Chat with AI'}
      </button>
    </div>
  );
};

export default ChatbotWidget;
