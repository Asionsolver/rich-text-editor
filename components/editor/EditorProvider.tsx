"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";

export type PreviewMode = "desktop" | "mobile";

interface EmailMetadata {
  campaignName: string;
  subject: string;
  name: string;
  fromEmail: string;
  previewText: string;
}

interface EditorContextType {
  editor: Editor | null;
  metadata: EmailMetadata;
  updateMetadata: (key: keyof EmailMetadata, value: string) => void;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<EmailMetadata>({
    campaignName: "Campaign Name",
    subject: "This is text email",
    name: "Sitgram",
    fromEmail: "hello@sitgram.com",
    previewText: "Enter a preview text",
  });

  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline break-words cursor-pointer",
        },
      }),
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: `
      <p>Hi,</p>
      <p>This is an email for you, we hope you like it</p>
      <p></p>
      <p>Regards,<br>The team</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    `,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[300px]",
      },
    },
    immediatelyRender: false,
  });

  const updateMetadata = (key: keyof EmailMetadata, value: string) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <EditorContext.Provider
      value={{ editor, metadata, updateMetadata, previewMode, setPreviewMode }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEmailEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEmailEditor must be used within an EditorProvider");
  }
  return context;
}
