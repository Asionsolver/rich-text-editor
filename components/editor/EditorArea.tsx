"use client";

import React from "react";
import { EditorContent } from "@tiptap/react";
import { useEmailEditor } from "./EditorProvider";

export default function EditorArea() {
  const { editor } = useEmailEditor();

  return (
    <div className="flex-1 overflow-y-auto w-full bg-white [&_.tiptap]:h-full [&_.tiptap]:outline-none">
      <EditorContent editor={editor} className="h-full p-6 text-[15px] leading-relaxed text-gray-800" />
    </div>
  );
}
