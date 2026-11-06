import { useEffect, useRef, useState } from 'react';

interface TimeFieldProps {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function TimeField({ id, label, hint, icon, value, onChange, error }: TimeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);
    return () => {
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  }, []);

  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-700"
      >
        <span className="text-blue-500">{icon}</span>
        {label}
      </label>
      <div
        className={[
          'flex items-center rounded-lg border-2 bg-white transition-all duration-150',
          focused
            ? 'border-blue-500 ring-2 ring-blue-200'
            : error
              ? 'border-red-300'
              : 'border-slate-200',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={1440}
          step={1}
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 font-mono text-base text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />
        <span className="px-3 text-xs font-medium text-ink-300 select-none">min</span>
      </div>
      <div className="mt-1 min-h-[18px] text-xs">
        {error ? (
          <span className="text-red-500 font-medium">{error}</span>
        ) : (
          <span className="text-ink-300">{hint}</span>
        )}
      </div>
    </div>
  );
}
