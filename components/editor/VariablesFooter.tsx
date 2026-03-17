"use client";

import React from "react";
import { useEmailEditor } from "./EditorProvider";

export default function VariablesFooter() {
  const { editor } = useEmailEditor();

  const variables = [
    { label: "First name", tag: "{{first_name}}" },
    { label: "Last name", tag: "{{last_name}}" },
    { label: "Email", tag: "{{email}}" },
    { label: "Unsubscribe URL", tag: "{{unsubscribe_url}}" },
  ];

  const insertVariable = (tag: string) => {
    if (editor) {
      editor.chain().focus().insertContent(tag).run();
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Available variables</h3>
      <div className="flex flex-wrap gap-2">
        {variables.map((v) => (
          <button
            key={v.tag}
            onClick={() => insertVariable(v.tag)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <span>{v.label}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{v.tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
