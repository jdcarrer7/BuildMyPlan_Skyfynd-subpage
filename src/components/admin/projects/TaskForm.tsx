'use client';

import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (name: string) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
    // Keep focus for rapid entry
    inputRef.current?.focus();
  };

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
        focused ? 'bg-white/[0.02]' : ''
      }`}
    >
      <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
        <Plus className="w-3.5 h-3.5 text-[#52525B]" />
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') {
            setValue('');
            inputRef.current?.blur();
          }
        }}
        placeholder="Add a task..."
        className="flex-1 bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#3F3F46] outline-none"
      />
    </div>
  );
}
