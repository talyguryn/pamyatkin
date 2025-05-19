"use client";
import React, { JSX } from 'react';

interface TextBlockProps {
  tag: keyof JSX.IntrinsicElements;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function TextBlock({
  tag,
  placeholder,
  value,
  onChange,
  className,
}: TextBlockProps) {
  const Tag = tag as any;
  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    onChange(e.currentTarget.textContent || '');
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    onChange(text);
  };

  return (
    <Tag
      className={`${className}`}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={handleInput}
      onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain').replace(/\r?\n/g, ' ');
        document.execCommand('insertText', false, text);
        onChange(text);
      }}
    >
      {value.split('\n').map((line, index) => (
        <p key={index} className="m-0">
          {line}
          {index < value.split('\n').length - 1 && <br />}
        </p>
      ))}
    </Tag>
  );
}