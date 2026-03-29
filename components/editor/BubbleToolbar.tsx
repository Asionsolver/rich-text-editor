"use client";

import React, { useState, useEffect } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Baseline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
} from "lucide-react";
import {
  ToolbarButton,
  Dropdown,
  DropdownItem,
  ColorPickerOptions,
} from "./ToolbarElements";

export const BubbleToolbar = ({ editor }: { editor: Editor | null }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleHide = () => setIsHidden(true);
    window.addEventListener("hide-bubble-menu", handleHide);
    return () => window.removeEventListener("hide-bubble-menu", handleHide);
  }, []);

  useEffect(() => {
    if (!editor) return;
    const handleSelection = () => setIsHidden(false);
    editor.on("selectionUpdate", handleSelection);
    return () => {
      editor.off("selectionUpdate", handleSelection);
    };
  }, [editor]);

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

  const currentFormatLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("bulletList")) return "Bullet List";
    if (editor.isActive("orderedList")) return "Numbered List";
    if (editor.isActive("blockquote")) return "Quote";
    if (editor.isActive("codeBlock")) return "Code Block";
    return "Paragraph";
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, state }) => {
        if (isHidden) return false;
        const { selection } = state;
        
        // Prevent bubble menu from showing when an image is selected
        if (editor.isActive("image") || editor.isActive("customImage")) {
          return false;
        }

        return !selection.empty && editor.isFocused;
      }}
      className={`flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-xl px-2 py-1.5 z-50 transition-all ${isHidden ? "hidden" : ""}`}
    >
      {/* Format Selection */}
      <Dropdown
        isOpen={openDropdown === "format"}
        onToggle={() => toggleDropdown("format")}
        onClose={closeDropdown}
        trigger={
          <span className="text-[13px] font-medium px-1 text-gray-700 min-w-[80px] text-left">
            {currentFormatLabel()}
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Heading 2"
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          onClose={closeDropdown}
        />
        <DropdownItem
          label="Bullet List"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          onClose={closeDropdown}
        />
      </Dropdown>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      {/* Basic Marks */}
      <ToolbarButton
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="w-4 h-4" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="w-4 h-4" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive("link")}
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("URL", previousUrl);
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
      >
        <Link className="w-4 h-4" strokeWidth={2.5} />
      </ToolbarButton>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      {/* Colors */}
      <Dropdown
        isOpen={openDropdown === "textColor"}
        onToggle={() => toggleDropdown("textColor")}
        onClose={closeDropdown}
        trigger={
          <div className="flex flex-col items-center justify-center gap-px w-4">
            <Baseline className="w-4 h-4 text-[#4B5563]" strokeWidth={2.5} />
            <div
              className="w-full h-[2px] rounded-sm"
              style={{
                backgroundColor: editor.getAttributes("textStyle").color || "#000000",
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
          recentColors={recentColors}
        />
      </Dropdown>

      <Dropdown
        isOpen={openDropdown === "highlightColor"}
        onToggle={() => toggleDropdown("highlightColor")}
        onClose={closeDropdown}
        trigger={
          <div className="flex flex-col items-center justify-center gap-px w-4">
            <Highlighter className="w-4 h-4 text-[#4B5563]" strokeWidth={2.5} />
            <div
              className="w-full h-[2px] rounded-sm"
              style={{
                backgroundColor: editor.getAttributes("highlight").color || "transparent",
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

      <div className="w-px h-4 bg-gray-200 mx-1" />

      {/* Alignment */}
      <Dropdown
        isOpen={openDropdown === "align"}
        onToggle={() => toggleDropdown("align")}
        onClose={closeDropdown}
        trigger={
          <AlignLeft className="w-4 h-4 text-[#4B5563]" strokeWidth={2.5} />
        }
      >
        <DropdownItem
          label={<div className="flex items-center gap-2"><AlignLeft className="w-4 h-4" /> Left</div>}
          isActive={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          onClose={closeDropdown}
        />
        <DropdownItem
          label={<div className="flex items-center gap-2"><AlignLeft className="w-4 h-4 -scale-x-100" /> Center</div>}
          isActive={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          onClose={closeDropdown}
        />
        <DropdownItem
          label={<div className="flex items-center gap-2"><AlignLeft className="w-4 h-4 rotate-180" /> Right</div>}
          isActive={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          onClose={closeDropdown}
        />
      </Dropdown>
    </BubbleMenu>
  );
};
