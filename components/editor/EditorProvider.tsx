"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Node, mergeAttributes, type CommandProps } from "@tiptap/core";
import { CustomImage } from "./CustomImage";

export const CustomCodeBlock = Node.create({
  name: "codeBlock",
  group: "block",
  content: "text*",
  marks: "",
  code: true,
  defining: true,

  parseHTML() {
    return [{ tag: "pre", preserveWhitespace: "full" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(HTMLAttributes, {
        class: "bg-gray-100 rounded-md p-4 text-[13px] font-mono text-gray-800 my-4 overflow-x-auto",
      }),
      ["code", {}, 0],
    ];
  },

  addCommands() {
    return {
      setCustomCodeBlock:
        () =>
        ({ commands }: CommandProps) =>
          commands.setNode("codeBlock"),
      toggleCodeBlock:
        () =>
        ({ commands }: CommandProps) =>
          commands.toggleNode("codeBlock", "paragraph"),
    };
  },

  addKeyboardShortcuts() {
    return { Backspace: () => false, Enter: () => false };
  },
});

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
  htmlContent: string;
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
  const [htmlContent, setHtmlContent] = useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        gapcursor: false,
        dropcursor: false,
      }),
      CustomCodeBlock,
      CustomImage,
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
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
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
        "data-gramm": "false",
        "data-gramm_editor": "false",
        "data-enable-grammarly": "false",
        "data-lt-active": "false",
        spellcheck: "false",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
  });

  const updateMetadata = (key: keyof EmailMetadata, value: string) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <EditorContext.Provider
      value={{
        editor,
        metadata,
        updateMetadata,
        previewMode,
        setPreviewMode,
        htmlContent,
      }}
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
