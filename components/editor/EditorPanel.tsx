"use client";

import React from "react";
import EmailMetadataForm from "./EmailMetadataForm";
import Toolbar from "./Toolbar";
import EditorArea from "./EditorArea";
import VariablesFooter from "./VariablesFooter";

export default function EditorPanel() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col h-full overflow-y-auto">
      <EmailMetadataForm />
      
      <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden min-h-[400px]">
        <Toolbar />
        <EditorArea />
      </div>

      <VariablesFooter />
    </div>
  );
}
