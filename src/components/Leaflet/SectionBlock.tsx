"use client";
import React from 'react';
import TextBlock from './TextBlock';

interface SectionBlockProps {
  titlePlaceholder: string;
  textPlaceholder: string;
  title: string;
  text: string;
  onTitleChange: (value: string) => void;
  onTextChange: (value: string) => void;
}

export default function SectionBlock({
  titlePlaceholder,
  textPlaceholder,
  title,
  text,
  onTitleChange,
  onTextChange,
}: SectionBlockProps) {
  return (
    <div className="flex flex-col gap-[12px] mb-[28px] w-[380px]">
      <TextBlock
      tag="h2"
      placeholder={titlePlaceholder}
      value={title}
      onChange={onTitleChange}
      className="text-[12px] font-bold leading-[1]"
      />

      <TextBlock
      tag="div"
      placeholder={textPlaceholder}
      value={text}
      onChange={onTextChange}
      className="text-[11px] flex flex-col gap-[10px] leading-[1.3]"
      />
    </div>
  );
}