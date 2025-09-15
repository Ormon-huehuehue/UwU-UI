"use client"

import React from 'react';
import { CopyButton } from './copy-button';
import { Highlight, PrismTheme } from 'prism-react-renderer';
import theme from '@/styles/prism-theme.json';

interface CodeSnippetProps {
  title?: string;
  code: string;
  language?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  title,
  code,
  language = 'typescript',
}) => {
  const lines = code.trim().split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  return (
    <div className="border rounded-2xl overflow-hidden pointer-events-auto" style={{ borderColor: 'var(--editor-border)' }}>
      {title ? (
        <div className="flex items-center justify-between pl-4 pr-3 py-2 border-b h-11" style={{ borderColor: 'var(--editor-border)', backgroundColor: 'var(--editor-bg)' }}>
          <h3 className="text-white text-sm font-medium">{title}</h3>
          <CopyButton onCopy={handleCopy} />
        </div>
      ) : null}
      <div className="py-4 relative overflow-y-auto max-h-[calc(530px-44px)]" style={{ backgroundColor: 'var(--editor-bg)' }}>
        {!title && (
          <div className={`absolute ${
            lines.length === 1 
              ? "top-1/2 -translate-y-1/2 right-3" 
              : "top-4 right-3"
          }`}>
            <CopyButton
              onCopy={handleCopy}
            />
          </div>
        )}
        <Highlight
          theme={theme as PrismTheme}
          code={code.trim()}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} text-[13px] overflow-x-auto font-mono font-medium`} style={style}>
              {tokens.map((line, i) => (
                <div 
                  key={i} 
                  {...getLineProps({ line })} 
                  className="flex items-center py-px px-4"
                  style={{ 
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--editor-border)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span className="mr-4 select-none text-muted-foreground text-right text-[10px] items-center flex">
                    {i + 1}
                  </span>
                  <span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};