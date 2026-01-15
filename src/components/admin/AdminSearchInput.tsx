'use client';

import { useState, useCallback } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import SvgSearch from '@/svg_components/Search';
import SvgClose from '@/svg_components/Close';
import { cn } from '@/lib/cn';

interface AdminSearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export function AdminSearchInput({
  placeholder = 'Поиск...',
  onSearch,
  defaultValue = '',
}: AdminSearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = useDebouncedCallback((query: string) => {
    onSearch(query);
  }, 300);

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      debouncedSearch(newValue);
    },
    [debouncedSearch]
  );

  const handleClear = useCallback(() => {
    setValue('');
    debouncedSearch('');
  }, [debouncedSearch]);

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <SvgSearch
            className={cn(
              'h-5 w-5 transition-colors duration-200',
              isFocused ? 'stroke-primary' : 'stroke-muted-foreground'
            )}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground shadow-sm outline-none transition-all duration-200',
            'placeholder:text-muted-foreground',
            'hover:border-muted-foreground/50',
            'focus:border-primary focus:ring-2 focus:ring-primary/20'
          )}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-secondary"
          >
            <SvgClose className="h-4 w-4 stroke-muted-foreground transition-colors hover:stroke-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
