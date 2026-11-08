"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={`prose max-w-none text-text-primary text-sm md:text-base leading-relaxed ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="mt-4 mb-2 text-xl font-bold text-text-primary border-b border-border pb-1">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="mt-3 mb-2 text-lg font-bold text-text-primary">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="mt-2 mb-1 text-base font-semibold text-text-primary">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => (
                        <ul className="mb-3 list-disc pl-5 space-y-1 text-text-primary">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-3 list-decimal pl-5 space-y-1 text-text-primary">{children}</ol>
                    ),
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="my-3 border-l-4 border-brand-primary bg-surface-muted/50 py-1.5 px-3 italic text-text-secondary rounded-r-md">
                            {children}
                        </blockquote>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-brand-primary">{children}</strong>
                    ),
                    table: ({ children }) => (
                        <div className="my-4 w-full overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-left text-sm">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-surface-muted text-xs uppercase text-text-secondary">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="border-b border-border px-4 py-2 font-semibold">{children}</th>
                    ),
                    td: ({ children }) => (
                        <td className="border-b border-border px-4 py-2 text-text-primary">{children}</td>
                    ),
                    code: ({ inline, className: codeClassName, children, ...props }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
                        const match = /language-(\w+)/.exec(codeClassName || "");
                        const codeString = String(children).replace(/\n$/, "");

                        if (!inline && (match || codeString.includes("\n"))) {
                            return (
                                <CodeBlock
                                    language={match ? match[1] : "text"}
                                    value={codeString}
                                />
                            );
                        }

                        return (
                            <code
                                className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-brand-primary"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
