import EditorPanel from "@/components/editor/EditorPanel";
import PreviewPanel from "@/components/preview/PreviewPanel";
import { EditorProvider } from "@/components/editor/EditorProvider";

export default function Home() {
  return (
    <EditorProvider>
      <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex flex-col font-sans">
      <header className="px-8 py-5 flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center">
          Plain text editor
        </h1>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-[#1A56DB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Save
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors shadow-sm">
            Test email
          </button>
        </div>
      </header>

      <main className="flex-1 px-8 pb-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)]">
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          <EditorPanel />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          <PreviewPanel />
        </div>
      </main>
    </div>
    </EditorProvider>
  );
}
