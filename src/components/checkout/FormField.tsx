import { cn } from '@/components/ui/cn';

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  type = 'text',
  placeholder,
  autoComplete,
  className,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="micro-label mb-1.5 block !text-[0.62rem]">
        {label}
        {required && <span className="text-gold-300"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          'w-full rounded border bg-ink-900 px-3.5 py-2.5 text-sm text-paper placeholder:text-muted-2',
          'transition-colors focus:outline-none focus:ring-0',
          error ? 'border-danger focus:border-danger' : 'border-ink-600 focus:border-gold-500/60',
        )}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
