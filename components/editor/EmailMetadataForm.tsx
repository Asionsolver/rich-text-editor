"use client";

import React from "react";
import { useEmailEditor } from "./EditorProvider";
import { Pencil } from "lucide-react";

export default function EmailMetadataForm() {
  const { metadata, updateMetadata } = useEmailEditor();

  const EditableField = ({
    label,
    value,
    onChange,
    isTitle = false,
  }: {
    label?: string;
    value: string;
    onChange: (val: string) => void;
    isTitle?: boolean;
  }) => (
    <div className={`flex items-center gap-2 group ${isTitle ? "mb-2" : "mb-1"}`}>
      {label && <span className="text-gray-500 text-sm min-w-[60px]">{label}:</span>}
      <div className="relative flex-1 flex items-center max-w-sm">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-transparent outline-none border border-transparent hover:border-gray-200 focus:border-blue-500 rounded px-2 -ml-2 py-0.5 transition-colors w-full ${
            isTitle
              ? "text-[26px] font-bold text-gray-900 placeholder-gray-400"
              : "text-sm font-medium text-gray-900 placeholder-gray-400"
          }`}
          placeholder={`Enter ${label || "value"}...`}
        />
        <Pencil className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-6 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col mb-6">
      <EditableField
        value={metadata.campaignName}
        onChange={(val) => updateMetadata("campaignName", val)}
        isTitle
      />
      <div className="flex flex-col mt-2">
        <EditableField
          label="Subject"
          value={metadata.subject}
          onChange={(val) => updateMetadata("subject", val)}
        />
        <EditableField
          label="Name"
          value={metadata.name}
          onChange={(val) => updateMetadata("name", val)}
        />
        <EditableField
          label="From"
          value={metadata.fromEmail}
          onChange={(val) => updateMetadata("fromEmail", val)}
        />
        <EditableField
          label="Preview"
          value={metadata.previewText}
          onChange={(val) => updateMetadata("previewText", val)}
        />
      </div>
    </div>
  );
}
