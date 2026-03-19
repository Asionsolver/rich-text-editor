import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Trash2, AlignLeft, AlignCenter, AlignRight, ImageUp } from "lucide-react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setCustomImage: (options: { src: string; alt?: string; width?: string; align?: string }) => ReturnType;
    };
  }
}

const ImageNodeView = (props: any) => {
  const { node, updateAttributes, deleteNode, selected } = props;
  const { src, alt, width, align } = node.attrs;

  let alignmentClass = "mx-auto";
  if (align === "left") alignmentClass = "ml-0 mr-auto";
  if (align === "right") alignmentClass = "ml-auto mr-0";

  return (
    <NodeViewWrapper
      className={`relative flex transition-all my-6 ${alignmentClass}`}
      style={{ width: width || "100%", maxWidth: "100%" }}
    >
      <div 
        className={`relative w-full rounded-lg overflow-hidden transition-all ${
          selected ? "ring-2 ring-blue-500 ring-offset-2" : "ring-1 ring-gray-200 shadow-sm"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src} 
          alt={alt || "uploaded image"} 
          className="w-full h-auto block cursor-pointer object-cover"
        />
      </div>

      {selected && (
        <div className="absolute bottom-full right-0 mb-2 w-max max-w-fit bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-lg p-1.5 flex flex-wrap justify-end items-center gap-1 z-50">
          <button
            type="button"
            onClick={() => updateAttributes({ align: "left" })}
            className={`p-1.5 rounded transition-colors ${align === 'left' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'} `}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => updateAttributes({ align: "center" })}
            className={`p-1.5 rounded transition-colors ${align === 'center' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'} `}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => updateAttributes({ align: "right" })}
            className={`p-1.5 rounded transition-colors ${align === 'right' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'} `}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" strokeWidth={2.5} />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={() => updateAttributes({ width: "50%" })}
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${width === '50%' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'} `}
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => updateAttributes({ width: "100%" })}
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${width === '100%' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'} `}
          >
            100%
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1 hidden sm:block" />

          <label className="p-1.5 hover:bg-gray-100 rounded text-gray-600 cursor-pointer transition-colors" title="Replace Image">
            <ImageUp className="w-4 h-4" strokeWidth={2.5} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => updateAttributes({ src: e.target?.result as string });
                  reader.readAsDataURL(file);
                  
                  // Reset value so the event fires even if they pick the same file again
                  e.target.value = "";
                }
              }}
            />
          </label>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={deleteNode}
            className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
            title="Delete Image"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: "100%" },
      align: { default: "center" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    let alignmentClass = "mx-auto";
    if (HTMLAttributes.align === "left") alignmentClass = "ml-0 mr-auto";
    if (HTMLAttributes.align === "right") alignmentClass = "ml-auto mr-0";

    return [
      "div",
      { class: `flex my-6 ${alignmentClass}`, style: `width: ${HTMLAttributes.width || "100%"}` },
      ["img", mergeAttributes(HTMLAttributes, { class: "w-full h-auto rounded-lg shadow-sm border border-gray-200 block object-cover" })],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  addCommands() {
    return {
      setCustomImage:
        (options: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
