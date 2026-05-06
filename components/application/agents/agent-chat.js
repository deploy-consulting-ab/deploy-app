'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUGGESTED_PROMPTS = [
    'What are my current project assignments?',
    'Show me open opportunities',
    'What are the financial results for last fiscal year?',
    'How many holidays do I have remaining?',
];

function ThinkingIndicator() {
    return (
        <div className="flex items-center gap-1.5 px-1 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
        </div>
    );
}

function MarkdownContent({ content }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ children }) => (
                    <p className="mb-2 last:mb-0 text-[15px] leading-7">{children}</p>
                ),
                h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-base font-bold mb-1.5 mt-3 first:mt-0">{children}</h3>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ inline, children }) =>
                    inline ? (
                        <code className="px-1 py-0.5 rounded bg-muted text-sm font-mono">
                            {children}
                        </code>
                    ) : (
                        <pre className="p-3 rounded-lg bg-muted text-sm font-mono overflow-x-auto mb-2">
                            <code>{children}</code>
                        </pre>
                    ),
                table: ({ children }) => (
                    <div className="overflow-x-auto mb-2">
                        <table className="w-full text-sm border-collapse">{children}</table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
                th: ({ children }) => (
                    <th className="px-2 py-1.5 text-left font-semibold border border-border/60">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="px-2 py-1.5 border border-border/60">{children}</td>
                ),
                hr: () => <hr className="my-3 border-border/60" />,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground mb-2">
                        {children}
                    </blockquote>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const textContent =
        message.parts
            ?.filter((p) => p.type === 'text')
            .map((p) => p.text)
            .join('') ?? '';

    if (!isUser && !textContent) return null;

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border/60 text-muted-foreground'
                }`}
            >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            {isUser ? (
                <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-base leading-relaxed bg-primary text-primary-foreground">
                    {textContent}
                </div>
            ) : (
                <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-base leading-relaxed bg-card border border-border/60 text-foreground shadow-sm">
                    <MarkdownContent content={textContent} />
                </div>
            )}
        </div>
    );
}

function WelcomeScreen({ onPromptClick }) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-8 py-12 px-4">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Bot className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-foreground tracking-tight">
                        Tilde Agent
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        Ask me about assignments, opportunities, financials, timereports, and more.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => onPromptClick(prompt)}
                        className="text-left px-3.5 py-3 rounded-xl border border-border/70 bg-card hover:bg-accent hover:border-border transition-colors text-[15px] text-muted-foreground hover:text-foreground shadow-sm hover:cursor-pointer"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function AgentChatComponent() {
    const { messages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/agent',
        }),
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    });

    const [input, setInput] = useState('');

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const isLoading = status === 'submitted' || status === 'streaming';
    const hasMessages = messages.length > 0;
    const isThinking = isLoading;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }, []);

    useEffect(() => {
        adjustTextareaHeight();
    }, [input, adjustTextareaHeight]);

    const submit = useCallback(() => {
        const text = (input ?? '').trim();
        if (!text || isLoading) return;
        sendMessage({ text });
        setInput('');
    }, [input, isLoading, sendMessage, setInput]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
            }
        },
        [submit]
    );

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto overflow-y-auto">
            <div className="flex-1 md:px-6">
                {!hasMessages ? (
                    <WelcomeScreen
                        onPromptClick={(p) => {
                            sendMessage({ text: p });
                        }}
                    />
                ) : (
                    <div className="flex flex-col gap-6 py-6 px-1 pb-32">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}

                        {isThinking && (
                            <div className="flex gap-3">
                                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 bg-muted border border-border/60 text-muted-foreground">
                                    <Bot className="w-3.5 h-3.5" />
                                </div>
                                <div className="px-3.5 py-1 rounded-2xl rounded-tl-sm bg-card border border-border/60 shadow-sm">
                                    <ThinkingIndicator />
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-destructive text-center py-2">
                                Something went wrong. Please try again.
                            </p>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 pt-3 pb-2 bg-background">
                <div className="flex items-end gap-2 rounded-2xl border border-border/70 bg-card shadow-sm px-3 py-2.5">
                    <textarea
                        ref={textareaRef}
                        value={input ?? ''}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about assignments, opportunities, financials…"
                        rows={1}
                        disabled={isLoading}
                        className="flex-1 resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 outline-none min-h-[24px] max-h-40 py-0.5 disabled:opacity-50"
                    />
                    <Button
                        type="button"
                        size="icon"
                        onClick={submit}
                        disabled={!(input ?? '').trim() || isLoading}
                        className="shrink-0 w-8 h-8 rounded-xl hover:cursor-pointer"
                    >
                        {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Send className="w-3.5 h-3.5" />
                        )}
                    </Button>
                </div>
                <p className="text-center text-[11px] text-muted-foreground/50 mt-2">
                    Agent may make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
}
