'use client';

import { useState, useCallback } from 'react';
import { TextInput } from '@/components/ui/TextInput';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface AdminSearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export function AdminSearchInput({
  placeholder = 'Search...',
  onSearch,
  defaultValue = '',
}: AdminSearchInputProps) {
  const [value, setValue] = useState(defaultValue);

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

  return (
    <div className="w-full max-w-md">
      <TextInput
        label=""
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
