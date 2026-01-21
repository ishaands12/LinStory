import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX styles

export default function AIChatWidget({ context }) {
    // ... existing state ...
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: "Hi! I'm 'Lin', your Algebra sidekick. Stuck? Ask me anything!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    context: context || "General Linear Algebra"
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Server Error (${res.status}): ${errText}`);
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.reply || "Error getting response." }]);
        } catch (e) {
            console.error("Chat Error:", e);
            setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Error: ${e.message}. (Backend might be restarting)` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    background: 'rgba(20, 20, 20, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    marginBottom: '1rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>✨ Lin (AI Tutor)</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                padding: '0.8rem 1rem',
                                borderRadius: '12px',
                                maxWidth: '85%',
                                lineHeight: '1.4',
                                fontSize: '0.9rem'
                            }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.5rem' }} {...props} />,
                                        code: ({ node, inline, className, children, ...props }) => {
                                            return inline ? (
                                                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }} {...props}>
                                                    {children}
                                                </code>
                                            ) : (
                                                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', overflowX: 'auto' }}>
                                                    <code {...props}>{children}</code>
                                                </pre>
                                            )
                                        }
                                    }}
                                >
                                    {m.content}
                                </ReactMarkdown>
                            </div>
                        ))}
                        {loading && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '1rem' }}>Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '1rem',
                        borderTop: '1px solid var(--glass-border)',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about vectors, matrices..."
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '0.8rem 1rem',
                                color: 'white'
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            style={{
                                background: 'var(--accent)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    border: 'none',
                    boxShadow: '0 0 20px var(--primary-glow)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    transition: 'transform 0.2s ease'
                }}
            >
                {isOpen ? '×' : '🤖'}
            </button>
        </div>
    );
}
