"use client";

import React from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useEmailEditor } from "../editor/EditorProvider";

export default function PreviewPanel() {
  const { editor, metadata, previewMode, setPreviewMode } = useEmailEditor();

  const isMobile = previewMode === "mobile";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode("desktop")}
            className={`p-2 rounded-md transition-colors ${
              !isMobile
                ? "text-blue-600 bg-blue-50 border border-blue-200 shadow-sm"
                : "text-gray-400 hover:text-gray-600 border border-transparent"
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            className={`p-2 rounded-md transition-colors ${
              isMobile
                ? "text-blue-600 bg-blue-50 border border-blue-200 shadow-sm"
                : "text-gray-400 hover:text-gray-600 border border-transparent"
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#F9FAFB] p-8 overflow-y-auto flex justify-center">
        <div
          className={`bg-white border border-gray-200 rounded-xl shadow-sm w-full transition-all duration-300 ${
            isMobile ? "max-w-[375px]" : "max-w-2xl"
          }`}
        >
          {/* Email Header Info */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
            <div className="flex flex-col">
              <div className="text-[15px]">
                <span className="font-semibold text-gray-900">{metadata.name}</span>
                <span className="text-gray-500 ml-1">&lt;{metadata.fromEmail}&gt;</span>
              </div>
              <div className="text-[15px] text-gray-900 font-medium mt-0.5">
                {metadata.subject}
              </div>
              <div className="text-[14px] text-gray-500 mt-1">
                {metadata.previewText || "No preview available"}
              </div>
            </div>
          </div>

          {/* Email Body HTML */}
          <div
            className="p-6 text-[15px] text-gray-800 leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0 [&_a]:text-blue-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
          />
        </div>
      </div>
    </div>
  );
}
