"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PHONE_COUNTRIES } from "@/constants";

interface Country {
  code: string;
  dialCode: string;
  flag: string;
}

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
  onCountryChange?: (country: Country) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, countryCode = "eg", onCountryChange, ...props }, ref) => {
    const selected = PHONE_COUNTRIES.find((c) => c.code === countryCode) ?? PHONE_COUNTRIES[0];

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <select
          value={selected.code}
          onChange={(e) => {
            const next = PHONE_COUNTRIES.find((c) => c.code === e.target.value);
            if (next) onCountryChange?.(next);
          }}
          className="h-10 rounded-md border border-input bg-background px-2 text-sm"
          aria-label="Country code"
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.dialCode}
            </option>
          ))}
        </select>
        <input
          ref={ref}
          type="tel"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Phone number"
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
