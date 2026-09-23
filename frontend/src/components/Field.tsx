interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export default function Field({ label, type = "text", value, onChange, error, placeholder }: FieldProps) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-ink/80 mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors
          ${error ? "border-alert" : "border-black/10 focus:border-primary"}`}
      />
      {error && <span className="block text-sm text-alert mt-1">{error}</span>}
    </label>
  );
}