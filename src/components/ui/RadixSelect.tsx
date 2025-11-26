"use client";
import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface RadixSelectProps {
  value?: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

const RadixSelect: React.FC<RadixSelectProps> = ({ value, onChange, options, placeholder = "Sélectionner", className }) => {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className={`inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white text-gray-900 input-gradient ${className || ""}`} aria-label="Select">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white border rounded-lg shadow-xl">
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item key={opt} value={opt} className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="w-4 h-4 text-blue-600" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default RadixSelect;
