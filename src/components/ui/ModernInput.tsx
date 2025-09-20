// src/components/ui/ModernInput.tsx
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";

export interface ModernInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
}

const inputVariants: Record<
  NonNullable<ModernInputProps["variant"]>,
  string
> = {
  default:
    "border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20",
  filled:
    "border-0 bg-gray-100 focus:bg-white focus:ring-blue-500/20 focus:shadow-md",
  outlined:
    "border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/10",
};

const inputSizes: Record<NonNullable<ModernInputProps["size"]>, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
};

export function ModernInput({
  className,
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = "default",
  size = "md",
  type = "text",
  id: idProp,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  ...props
}: ModernInputProps) {
  // ✅ ID estável (SSR/CSR) — elimina hydration mismatch
  const reactId = React.useId();
  const inputId = idProp ?? `input-${reactId}`;

  const isPassword = type === "password";
  const [showPassword, setShowPassword] = React.useState(false);
  const actualType = isPassword && showPassword ? "text" : type;

  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(
    !!value || !!defaultValue
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Floating Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-3 transition-all duration-200 ease-in-out pointer-events-none",
              "text-gray-500 bg-white px-1",
              isFocused || hasValue
                ? "top-0 text-xs font-medium text-blue-600 -translate-y-1/2"
                : "top-1/2 text-base -translate-y-1/2",
              leftIcon && "left-10"
            )}
          >
            {label}
          </label>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          id={inputId}
          type={actualType}
          className={cn(
            "w-full rounded-xl transition-all duration-200 ease-in-out",
            "focus:outline-none focus:ring-4",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "placeholder:text-gray-400",
            inputVariants[variant],
            inputSizes[size],
            leftIcon && "pl-10",
            ((rightIcon && !isPassword) || isPassword) && "pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            label && "pt-6 pb-2",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onChange={handleInputChange}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />

        {/* Right Icon OU Password Toggle (um só) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          ) : rightIcon ? (
            <div className="text-gray-400">{rightIcon}</div>
          ) : null}
        </div>
      </div>

      {/* Error / Hint */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-2 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}

export default ModernInput;
