import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      )}
      <input
        ref={ref}
        {...props}
        className={`rounded-md border bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 ${
          error ? "border-red-500" : "border-zinc-700"
        } ${className}`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";
export default Input;
