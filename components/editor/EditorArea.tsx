"use client";

import React, { memo } from "react";
import { EditorContent, Editor } from "@tiptap/react";
import { useEmailEditor } from "./EditorProvider";

import { BubbleToolbar } from "./BubbleToolbar";

const MemoizedEditor = memo(({ editor }: { editor: Editor | null }) => {
  return (
    <>
      <BubbleToolbar editor={editor} />
      <EditorContent editor={editor} className="h-full p-6 text-[15px] leading-relaxed text-gray-800" />
    </>
  );
});
MemoizedEditor.displayName = "MemoizedEditor";

export default function EditorArea() {
  const { editor } = useEmailEditor();

  return (
    <div className="flex-1 overflow-y-auto w-full bg-white [&_.tiptap]:h-full [&_.tiptap]:outline-none">
      <MemoizedEditor editor={editor} />
    </div>
  );
}
