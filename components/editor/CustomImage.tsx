"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Trash2, AlignLeft, AlignCenter, AlignRight, ImageUp } from "lucide-react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setCustomImage: (options: {
        src: string;
        alt?: string;
        width?: string;
        align?: string;
      }) => ReturnType;
    };
  }
}

// ─── Preset widths ────────────────────────────────────────────────────────────
const PRESETS = ["25%", "50%", "75%", "100%"] as const;
type Preset = (typeof PRESETS)[number];

// ─── 8-point resize handle definitions ───────────────────────────────────────
// `dir`: horizontal direction multiplier for deltaX
//   +1  = right-side handle  (drag right → wider)
//   -1  = left-side handle   (drag right → narrower)
//   +1  = top/bottom handles (treat same as right, horizontal drag)
const HANDLES = [
  { id: "nw", cursor: "nw-resize", style: { top: "-5px", left: "-5px" },                          dir: -1 },
  { id: "n",  cursor: "n-resize",  style: { top: "-5px", left: "50%", transform: "translateX(-50%)" }, dir: 1 },
  { id: "ne", cursor: "ne-resize", style: { top: "-5px", right: "-5px" },                          dir: 1 },
  { id: "e",  cursor: "e-resize",  style: { top: "50%",  right: "-5px", transform: "translateY(-50%)" }, dir: 1 },
  { id: "se", cursor: "se-resize", style: { bottom: "-5px", right: "-5px" },                       dir: 1 },
  { id: "s",  cursor: "s-resize",  style: { bottom: "-5px", left: "50%", transform: "translateX(-50%)" }, dir: 1 },
  { id: "sw", cursor: "sw-resize", style: { bottom: "-5px", left: "-5px" },                        dir: -1 },
  { id: "w",  cursor: "w-resize",  style: { top: "50%",  left: "-5px", transform: "translateY(-50%)" }, dir: -1 },
] as const;

// ─── ImageNodeView ────────────────────────────────────────────────────────────
const ImageNodeView = (props: any) => {
  const { node, updateAttributes, deleteNode, selected } = props;
  const { src, alt, width = "100%", align = "center" } = node.attrs;

  // ref to the image container (width-controlled div, NOT NodeViewWrapper)
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [liveWidth, setLiveWidth] = useState<string | null>(null);

  // Only the committed attr width (or live if resizing)
  const displayWidth = liveWidth ?? width ?? "100%";

  // Active preset: exact string match only
  const activePreset: Preset | null = (PRESETS as readonly string[]).includes(width)
    ? (width as Preset)
    : null;

  // Alignment class for the image container (margin-based)
  const alignStyle: React.CSSProperties =
    align === "left"
      ? { marginLeft: 0, marginRight: "auto" }
      : align === "right"
      ? { marginLeft: "auto", marginRight: 0 }
      : { marginLeft: "auto", marginRight: "auto" };

  // ── Generic resize handler for any of the 8 handles ──────────────────────
  const makeHandleMouseDown = useCallback(
    (dir: 1 | -1) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const el = imgContainerRef.current;
      if (!el) return;

      const parentWidth = el.parentElement?.clientWidth ?? 800;
      const startX = e.clientX;
      const startPx = el.getBoundingClientRect().width;

      setIsResizing(true);

      const onMove = (mv: MouseEvent) => {
        const delta = (mv.clientX - startX) * dir;
        const newPx = Math.max(60, startPx + delta);
        const newPct = Math.min(100, Math.round((newPx / parentWidth) * 100));
        // Imperatively update DOM for smooth 60fps feel
        el.style.width = `${newPct}%`;
        setLiveWidth(`${newPct}%`);
      };

      const onUp = (up: MouseEvent) => {
        const parentWidth2 = el.parentElement?.clientWidth ?? 800;
        const delta = (up.clientX - startX) * dir;
        const newPx = Math.max(60, startPx + delta);
        const newPct = Math.min(100, Math.round((newPx / parentWidth2) * 100));
        updateAttributes({ width: `${newPct}%` });
        setIsResizing(false);
        setLiveWidth(null);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [updateAttributes]
  );

  // Keep image container in sync when attr changes externally (e.g. preset click)
  useEffect(() => {
    if (imgContainerRef.current && !isResizing) {
      imgContainerRef.current.style.width = width ?? "100%";
    }
  }, [width, isResizing]);

  return (
    /**
     * NodeViewWrapper renders as a FULL-WIDTH block div.
     * The toolbar is positioned relative to THIS — so it's always
     * centered in the editor regardless of how small the image is.
     */
    <NodeViewWrapper
      style={{
        display: "block",
        position: "relative",
        // Enough bottom padding so the toolbar (below image) doesn't overlap text
        paddingBottom: selected ? "52px" : "0",
        marginTop: "24px",
        marginBottom: "24px",
        transition: "padding-bottom 0.15s ease",
      }}
    >
      {/* ── Image + resize handles ─────────────────────────────────────── */}
      <div
        ref={imgContainerRef}
        style={{
          ...alignStyle,
          width: displayWidth,
          maxWidth: "100%",
          position: "relative",
          display: "block",
          borderRadius: "8px",
          overflow: "visible", // let handles poke outside
          boxSizing: "border-box",
          outline: selected
            ? isResizing
              ? "2px solid #60a5fa"
              : "2px solid #3b82f6"
            : "1px solid #e5e7eb",
          outlineOffset: "2px",
          boxShadow: selected ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Image itself */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || "uploaded image"}
          draggable={false}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />

        {/* 8-point resize handles (shown only when selected) */}
        {selected &&
          HANDLES.map(({ id, cursor, style, dir }) => (
            <div
              key={id}
              onMouseDown={makeHandleMouseDown(dir as 1 | -1)}
              title="Drag to resize"
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                background: "white",
                border: "2px solid #3b82f6",
                borderRadius: "2px",
                cursor,
                zIndex: 60,
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                ...style,
              }}
            />
          ))}
      </div>

      {/* ── Floating toolbar ───────────────────────────────────────────────
           Positioned absolute RELATIVE TO NodeViewWrapper (full-width),
           centered horizontally — never clipped by image width.        ── */}
      {selected && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            bottom: "4px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 70,
            // white-space nowrap + fit-content keeps it on one single line always
            whiteSpace: "nowrap",
            width: "max-content",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(8px)",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "6px 8px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {/* Alignment */}
            {(
              [
                { value: "left",   Icon: AlignLeft,   label: "Align Left" },
                { value: "center", Icon: AlignCenter, label: "Align Center" },
                { value: "right",  Icon: AlignRight,  label: "Align Right" },
              ] as const
            ).map(({ value, Icon, label }) => (
              <button
                key={value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateAttributes({ align: value });
                }}
                title={label}
                style={{
                  padding: "5px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: align === value ? "#f3f4f6" : "transparent",
                  color: align === value ? "#111827" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon style={{ width: 14, height: 14 }} strokeWidth={2.5} />
              </button>
            ))}

            {/* Divider */}
            <div style={{ width: 1, height: 18, background: "#d1d5db", margin: "0 4px", flexShrink: 0 }} />

            {/* Preset size buttons */}
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateAttributes({ width: preset });
                }}
                title={`Resize to ${preset}`}
                style={{
                  padding: "3px 7px",
                  borderRadius: "6px",
                  border: activePreset === preset ? "1px solid #bfdbfe" : "none",
                  cursor: "pointer",
                  background: activePreset === preset ? "#eff6ff" : "transparent",
                  color: activePreset === preset ? "#1d4ed8" : "#6b7280",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {preset}
              </button>
            ))}

            {/* Divider */}
            <div style={{ width: 1, height: 18, background: "#d1d5db", margin: "0 4px", flexShrink: 0 }} />

            {/* Replace image */}
            <label
              title="Replace Image"
              style={{
                padding: "5px",
                borderRadius: "6px",
                cursor: "pointer",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f3f4f6")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <ImageUp style={{ width: 14, height: 14 }} strokeWidth={2.5} />
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      updateAttributes({ src: ev.target?.result as string });
                    reader.readAsDataURL(file);
                    e.target.value = "";
                  }
                }}
              />
            </label>

            {/* Divider */}
            <div style={{ width: 1, height: 18, background: "#d1d5db", margin: "0 4px", flexShrink: 0 }} />

            {/* Delete */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                deleteNode();
              }}
              title="Delete Image"
              style={{
                padding: "5px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#fef2f2")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Trash2 style={{ width: 14, height: 14 }} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
};

// ─── Tiptap Node Definition ────────────────────────────────────────────────────
export const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src:   { default: null },
      alt:   { default: null },
      width: { default: "100%" },
      align: { default: "center" },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const alignStyle =
      HTMLAttributes.align === "left"
        ? "margin-left:0;margin-right:auto"
        : HTMLAttributes.align === "right"
        ? "margin-left:auto;margin-right:0"
        : "margin-left:auto;margin-right:auto";

    return [
      "div",
      {
        style: `display:block;width:${HTMLAttributes.width || "100%"};max-width:100%;${alignStyle};margin-top:24px;margin-bottom:24px`,
      },
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          style: "width:100%;height:auto;display:block;border-radius:8px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.1)",
        }),
      ],
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
          return commands.insertContent({ type: this.name, attrs: options });
        },
    };
  },
});
