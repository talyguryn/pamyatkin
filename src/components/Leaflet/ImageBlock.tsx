"use client";
import React, { useRef } from 'react';

interface ImageBlockProps {
  image: string | null;
  onImageChange: (file: File) => void;
  className?: string;
}

export default function ImageBlock({ image, onImageChange, className }: ImageBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageChange(file);
  };

  return (
    <div
      className={`bg-gray-100 ${!image && 'border-dashed border-1 border-stone-200'} flex items-center justify-center cursor-pointer group overflow-hidden hover:border-none ${className}`}
      onClick={handleClick}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span
          className={
            `text-gray-700 text-xs bg-gray-100 group-hover:bg-gray-200 w-full group-active:bg-gray-200 h-full flex text-center items-center justify-center transition-opacity duration-200 ${
              !image ? 'opacity-100' : 'opacity-0 group-hover:opacity-90'
            }`
          }
        >
          {`Добавьте фотографию`}
        </span>
      </div>
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleFile}
      />
    </div>
  );
}