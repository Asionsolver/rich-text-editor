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
  TextQuote,
  FileCode,
  ImagePlus,
  Baseline,
  Highlighter,
} from "lucide-react";
import { useState, useRef } from "react";
import {
  ToolbarButton,
  Dropdown,
  DropdownItem,
  ColorPickerOptions,
} from "./ToolbarElements";

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

  const handleColorChange = (color: string, type: 'text' | 'highlight') => {
    if (type === 'text') {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
    setRecentColors(prev => {
      const next = [color, ...prev.filter(c => c !== color)].slice(0, 10);
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
        editor.chain().focus().insertContent({ type: "customImage", attrs: { src: result } }).run();
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
            <Baseline className="w-[16px] h-[16px] text-[#4B5563]" strokeWidth={2.5} />
            <div className="w-full h-[3px] rounded-sm" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }} />
          </div>
        }
      >
        <ColorPickerOptions 
          color={editor.getAttributes('textStyle').color}
          onChange={(c) => handleColorChange(c, 'text')}
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
            <Highlighter className="w-[16px] h-[16px] text-[#4B5563]" strokeWidth={2.5} />
            <div className="w-full h-[3px] rounded-sm" style={{ backgroundColor: editor.getAttributes('highlight').color || 'transparent' }} />
          </div>
        }
      >
        <ColorPickerOptions 
          color={editor.getAttributes('highlight').color}
          onChange={(c) => handleColorChange(c, 'highlight')}
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
