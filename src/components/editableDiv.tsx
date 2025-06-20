import { useRef, useEffect } from 'react';

interface EditableDivProps {
  value?: string;
  onChange?: (value: string) => void;
  contentEditable?: boolean; // default is true
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  [key: string]: any; // for data-* and other props
}

export default function EditableDiv({
  value = '',
  onChange,
  contentEditable = true, // default is true
  className = '',
  style = {},
  placeholder = '',
  ...restProps // supports data-* and other props
}: EditableDivProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial content once
    if (divRef.current && divRef.current.innerHTML !== value) {
      divRef.current.innerHTML = value.replace(/\n/g, '<br>');
    }
  }, [value]);

  const handleInput = () => {
    if (divRef.current) {
      // Convert <br> tags back to line breaks
      const html = divRef.current.innerHTML.replace(/<br\s*\/?>/gi, '\n');
      onChange?.(html);
    }
  };

  const handleBlur = () => {
    // Clean up empty content
    if (divRef.current && divRef.current.innerHTML === '<br>') {
      divRef.current.innerHTML = '';
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable={contentEditable}
      className={className}
      style={{
        ...style,
      }}
      onInput={handleInput}
      onBlur={handleBlur}
      suppressContentEditableWarning
      data-placeholder={placeholder}
      spellCheck="false"
      {...restProps}
    />
  );
}
