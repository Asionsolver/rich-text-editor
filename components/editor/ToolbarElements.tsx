"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, DropletOff, Baseline, Highlighter } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Editor } from "@tiptap/react";

export const MenuTooltip = ({ tooltip, shortcut }: { tooltip: string; shortcut?: string }) => {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.userAgent.includes("Mac"));
  }, []);

  return (
    <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap z-50 flex flex-col items-center gap-1.5 leading-none">
      <span>{tooltip}</span>
      {shortcut && (
        <div className="flex items-center gap-[3px] text-[10px] text-gray-300 font-sans tracking-wide mt-0.5">
          {shortcut.split("+").map((part, i) => {
            const displayPart =
              part === "Mod" ? (isMac ? "⌘" : "Ctrl") :
              part === "Shift" ? (isMac ? "⇧" : "Shift") :
              part === "Alt" ? (isMac ? "⌥" : "Alt") :
              part;
            return (
              <kbd key={i} className="bg-gray-800 border border-gray-700 px-1 py-[2px] rounded-sm min-w-[18px] text-center shadow-sm">
                {displayPart}
              </kbd>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ToolbarButton = ({
  isActive,
  onClick,
  children,
  className = "",
  tooltip,
  shortcut,
}: {
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
  shortcut?: string;
}) => (
  <div className="relative group flex items-center justify-center">
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
        isActive
          ? "bg-[#F3F4F6] text-gray-900"
          : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-gray-900"
      } ${className}`}
    >
      {children}
    </button>
    {tooltip && <MenuTooltip tooltip={tooltip} shortcut={shortcut} />}
  </div>
);
export const Dropdown = ({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
  tooltip,
  shortcut,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  tooltip?: string;
  shortcut?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        ref.current && 
        !ref.current.contains(target) &&
        document.contains(target)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative flex items-center justify-center group" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onToggle();
        }}
        className={`p-1.5 rounded-md flex items-center gap-0.5 transition-colors ${
          isOpen
            ? "bg-[#F3F4F6] text-gray-900"
            : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-gray-900"
        }`}
      >
        {trigger}
        <ChevronDown className="w-3 h-3 text-gray-500" />
      </button>

      {tooltip && !isOpen && (
        <MenuTooltip tooltip={tooltip} shortcut={shortcut} />
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl py-1 z-50 min-w-[140px]">
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  label,
  isActive,
  onClick,
  onClose,
}: {
  label: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
      onClose();
    }}
    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 flex items-center justify-between text-gray-700 transition-colors"
  >
    <span>{label}</span>
    {isActive && <Check className="w-3.5 h-3.5 text-gray-900" />}
  </button>
);

export const COLOR_PALETTE = [
  ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"],
  ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"],
  ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"],
  ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
  ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"],
  ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3c78d8", "#3c78d8", "#3c78d8"],
  ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"],
  ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"]
];

export const HexInput = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => {
  const [value, setValue] = useState(color ? color.replace("#", "").toUpperCase() : "");

  useEffect(() => {
    if (color) {
      setValue(color.replace("#", "").toUpperCase());
    }
  }, [color]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6).toUpperCase();
    setValue(val);
    if (val.length === 6) {
      onChange(`#${val}`);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className="w-full px-2 py-1.5 text-[13px] text-gray-700 border border-gray-200 rounded outline-none focus:border-gray-400 font-mono"
      placeholder="000000"
    />
  );
};

export const CustomColorPickerView = ({
  color,
  onChange,
  onAdd,
}: {
  color: string;
  onChange: (color: string) => void;
  onAdd: () => void;
}) => {
  return (
    <div className="flex flex-col p-3 gap-3 bg-white w-[236px]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-gray-700 font-medium">More Colors...</span>
      </div>
      <div className="w-full h-px bg-gray-100" />
      <HexColorPicker color={color} onChange={onChange} style={{ width: "100%", height: "160px" }} />
      <div className="flex flex-col gap-2">
        <HexInput color={color} onChange={onChange} />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onAdd();
          }}
          className="w-full py-1.5 flex items-center justify-center bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ColorPickerOptions = ({
  color,
  onChange,
  onClear,
  clearLabel = "Default",
  recentColors,
}: {
  color?: string;
  onChange: (color: string) => void;
  onClear: () => void;
  clearLabel?: string;
  recentColors: string[];
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(color || "#000000");

  if (showCustom) {
    return (
      <CustomColorPickerView
        color={customColor}
        onChange={setCustomColor}
        onAdd={() => onChange(customColor)}
      />
    );
  }

  return (
    <div className="flex flex-col p-2 gap-2 bg-white w-[236px]">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onClear();
        }}
        className="flex items-center gap-2 px-1 py-1 text-[13px] text-gray-700 hover:bg-gray-100 rounded transition-colors w-full"
      >
        <DropletOff className="w-4 h-4" />
        {clearLabel}
      </button>
      <div className="flex flex-col gap-1">
        {COLOR_PALETTE.map((row, i) => (
          <div key={i} className="flex items-center gap-1 justify-between">
            {row.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(c);
                }}
                className={`w-[18px] h-[18px] rounded-sm shrink-0 border hover:scale-110 transition-transform ${
                  color === c ? "ring-1 ring-gray-400 ring-offset-1 border-transparent" : "border-gray-200"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        ))}
      </div>
      {recentColors.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-xs text-gray-700 px-1">Recently Used</span>
          <div className="flex items-center gap-1 flex-wrap">
            {recentColors.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(c);
                }}
                className={`w-[18px] h-[18px] rounded-sm shrink-0 border hover:scale-110 transition-transform ${
                  color === c ? "ring-1 ring-gray-400 ring-offset-1 border-transparent" : "border-gray-200"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
      <div className="mt-1 flex border-t border-gray-100 pt-1">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowCustom(true);
          }}
          className="flex items-center px-1 py-1 text-[13px] text-gray-700 hover:bg-gray-100 w-full rounded cursor-pointer transition-colors relative"
        >
          <span>More Colors...</span>
        </button>
      </div>
    </div>
  );
};
