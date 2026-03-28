"use client";

import React from "react";
import { useEmailEditor } from "./EditorProvider";
import {
  Undo,
  Redo,
  Heading,
  List,
  ListOrdered,
  Quote,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  Link,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  ChevronDown,
  Check,
  TextQuote,
  FileCode,
  ImagePlus,
  DropletOff,
  Baseline,
  Highlighter,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ToolbarButton = ({
  isActive,
  onClick,
  children,
  className = "",
  tooltip,
}: {
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
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
    {tooltip && (
      <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
        {tooltip}
      </div>
    )}
  </div>
);

const Dropdown = ({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
  tooltip,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  tooltip?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
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
        <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap z-[60]">
          {tooltip}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl py-1 z-50 min-w-[140px]">
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({
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

const COLOR_PALETTE = [
  [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
  ],
  [
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
  ],
  [
    "#e6b8af",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#cfe2f3",
    "#d9d2e9",
    "#ead1dc",
  ],
  [
    "#dd7e6b",
    "#ea9999",
    "#f9cb9c",
    "#ffe599",
    "#b6d7a8",
    "#a2c4c9",
    "#a4c2f4",
    "#9fc5e8",
    "#b4a7d6",
    "#d5a6bd",
  ],
  [
    "#cc4125",
    "#e06666",
    "#f6b26b",
    "#ffd966",
    "#93c47d",
    "#76a5af",
    "#6d9eeb",
    "#6fa8dc",
    "#8e7cc3",
    "#c27ba0",
  ],
  [
    "#a61c00",
    "#cc0000",
    "#e69138",
    "#f1c232",
    "#6aa84f",
    "#45818e",
    "#3c78d8",
    "#3d85c6",
    "#674ea7",
    "#a64d79",
  ],
  [
    "#5b0f00",
    "#660000",
    "#783f04",
    "#7f6000",
    "#274e13",
    "#0c343d",
    "#1c4587",
    "#073763",
    "#20124d",
    "#4c1130",
  ],
];

const ColorPickerOptions = ({
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
                  color === c
                    ? "ring-1 ring-gray-400 ring-offset-1 border-transparent"
                    : "border-gray-200"
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
                  color === c
                    ? "ring-1 ring-gray-400 ring-offset-1 border-transparent"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
      <div className="mt-1 flex border-t border-gray-100 pt-1">
        <label className="flex items-center px-1 py-1 text-[13px] text-gray-700 hover:bg-gray-100 w-full rounded cursor-pointer transition-colors relative">
          <span>More Colors...</span>
          <input
            type="color"
            value={color || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

export default function Toolbar() {
  const { editor } = useEmailEditor();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => setOpenDropdown(null);

  const handleColorChange = (color: string, type: "text" | "highlight") => {
    if (type === "text") {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
    setRecentColors((prev) => {
      const next = [color, ...prev.filter((c) => c !== color)].slice(0, 10);
      return next;
    });
    closeDropdown();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        (editor.chain().focus() as any).setCustomImage({ src: result }).run();
      };
      reader.readAsDataURL(file);
      // Reset input value so the same file (or consecutive files) can be selected again
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-gray-200 bg-white">
      <ToolbarButton
        tooltip="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200 mx-1.5" />

      <Dropdown
        isOpen={openDropdown === "heading"}
        onToggle={() => toggleDropdown("heading")}
        onClose={closeDropdown}
        tooltip="Headings"
        trigger={
          <span className="font-serif font-medium text-[16px] px-0.5 leading-none h-[18px] flex items-center text-[#4B5563]">
            H
          </span>
        }
      >
        <DropdownItem
          label="Paragraph"
          isActive={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Heading 1"
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Heading 2"
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Heading 3"
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Heading 4"
          isActive={editor.isActive("heading", { level: 4 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Heading 5"
          isActive={editor.isActive("heading", { level: 5 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Heading 6"
          isActive={editor.isActive("heading", { level: 6 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          onClose={closeDropdown}
        />
      </Dropdown>

      <Dropdown
        isOpen={openDropdown === "list"}
        onToggle={() => toggleDropdown("list")}
        onClose={closeDropdown}
        tooltip="Lists"
        trigger={
          <List
            className="w-[18px] h-[18px] text-[#4B5563]"
            strokeWidth={2.5}
          />
        }
      >
        <DropdownItem
          label="Bullet List"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Numbered List"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          onClose={closeDropdown}
        />
      </Dropdown>

      <ToolbarButton
        tooltip="Indent / Blockquote"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <TextQuote className="w-[18px] h-[18px] shrink-0" strokeWidth={2.5} />
      </ToolbarButton>

      <ToolbarButton
        tooltip="Code Block"
        isActive={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <FileCode className="w-[18px] h-[18px] shrink-0" strokeWidth={2.5} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200 mx-1.5" />

      <Dropdown
        isOpen={openDropdown === "textColor"}
        onToggle={() => toggleDropdown("textColor")}
        onClose={closeDropdown}
        tooltip="Text Color"
        trigger={
          <div className="flex flex-col items-center justify-center gap-[1px] w-[18px]">
            <Baseline
              className="w-[16px] h-[16px] text-[#4B5563]"
              strokeWidth={2.5}
            />
            <div
              className="w-full h-[3px] rounded-sm"
              style={{
                backgroundColor:
                  editor.getAttributes("textStyle").color || "#000000",
              }}
            />
          </div>
        }
      >
        <ColorPickerOptions
          color={editor.getAttributes("textStyle").color}
          onChange={(c) => handleColorChange(c, "text")}
          onClear={() => {
            editor.chain().focus().unsetColor().run();
            closeDropdown();
          }}
          clearLabel="Default"
          recentColors={recentColors}
        />
      </Dropdown>

      <Dropdown
        isOpen={openDropdown === "highlightColor"}
        onToggle={() => toggleDropdown("highlightColor")}
        onClose={closeDropdown}
        tooltip="Highlight Color"
        trigger={
          <div className="flex flex-col items-center justify-center gap-[1px] w-[18px]">
            <Highlighter
              className="w-[16px] h-[16px] text-[#4B5563]"
              strokeWidth={2.5}
            />
            <div
              className="w-full h-[3px] rounded-sm"
              style={{
                backgroundColor:
                  editor.getAttributes("highlight").color || "transparent",
              }}
            />
          </div>
        }
      >
        <ColorPickerOptions
          color={editor.getAttributes("highlight").color}
          onChange={(c) => handleColorChange(c, "highlight")}
          onClear={() => {
            editor.chain().focus().unsetHighlight().run();
            closeDropdown();
          }}
          clearLabel="No Fill"
          recentColors={recentColors}
        />
      </Dropdown>

      <div className="w-px h-5 bg-gray-200 mx-1.5" />

      <ToolbarButton
        tooltip="Bold"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Italic"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Strikethrough"
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Code"
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Underline"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>

      <ToolbarButton
        tooltip="Link"
        isActive={editor.isActive("link")}
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("URL", previousUrl);
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      >
        <Link className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200 mx-1.5" />

      <ToolbarButton
        tooltip="Superscript"
        isActive={editor.isActive("superscript")}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <Superscript className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Subscript"
        isActive={editor.isActive("subscript")}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <Subscript className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200 mx-1.5" />

      <ToolbarButton
        tooltip="Align Left"
        isActive={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Align Center"
        isActive={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Align Right"
        isActive={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        tooltip="Align Justify"
        isActive={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="w-[18px] h-[18px]" strokeWidth={2.5} />
      </ToolbarButton>

      <div className="ml-auto flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
        >
          <ImagePlus className="w-[18px] h-[18px]" strokeWidth={2.5} />
          Add
        </button>
      </div>
    </div>
  );
}
