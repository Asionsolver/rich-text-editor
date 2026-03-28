"use client";

import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
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

// ─── Preset widths ─────────────────────────────────────────────────────────────
const PRESETS = ["25%", "50%", "75%", "100%"] as const;
type Preset = (typeof PRESETS)[number];

// ─── Corner-only resize handles ────────────────────────────────────────────────
const CORNER_HANDLES = [
  { id: "nw", cursor: "nw-resize", style: { top: "-5px", left: "-5px" },   dir: -1 },
  { id: "ne", cursor: "ne-resize", style: { top: "-5px", right: "-5px" },  dir:  1 },
  { id: "sw", cursor: "sw-resize", style: { bottom: "-5px", left: "-5px" }, dir: -1 },
  { id: "se", cursor: "se-resize", style: { bottom: "-5px", right: "-5px" }, dir: 1 },
] as const;

// ─── ImageNodeView ─────────────────────────────────────────────────────────────
const ImageNodeView = (props: any) => {
  const { node, updateAttributes, deleteNode, selected } = props;
  const { src, alt, width = "100%", align = "center" } = node.attrs;

  // ref to the width-controlled image container
  const imgContainerRef = useRef<HTMLDivElement>(null);
  // ref to the floating toolbar to measure its width for clamping
  const toolbarRef      = useRef<HTMLDivElement>(null);

  const [isResizing,  setIsResizing]  = useState(false);
  // Computed left offset (px) for the toolbar, relative to NodeViewWrapper
  const [toolbarLeft, setToolbarLeft] = useState<number | null>(null);

  // Active preset — exact string match only
  const activePreset: Preset | null = (PRESETS as readonly string[]).includes(width)
    ? (width as Preset)
    : null;

  // Margin-based alignment for the image container
  const alignStyle: React.CSSProperties =
    align === "left"  ? { marginLeft: 0,     marginRight: "auto" } :
    align === "right" ? { marginLeft: "auto", marginRight: 0     } :
                        { marginLeft: "auto", marginRight: "auto" };

  // ─── Compute clamped toolbar position ────────────────────────────────────────
  // The toolbar lives inside NodeViewWrapper (full editor width).
  // We center it below the image but clamp to [inset, wrapperWidth - toolbarWidth - inset].
  const recalcToolbarLeft = useCallback(() => {
    const img     = imgContainerRef.current;
    const toolbar = toolbarRef.current;
    if (!img || !toolbar) return;

    const wrapper     = img.parentElement;   // NodeViewWrapper div (full editor width)
    if (!wrapper) return;

    const wrapperWidth  = wrapper.offsetWidth;
    const imgOffset     = img.offsetLeft;     // distance from left of wrapper
    const imgWidth      = img.offsetWidth;
    const tbWidth       = toolbar.offsetWidth;
    const INSET         = 6;                  // min gap from editor edge

    const idealCenter = imgOffset + imgWidth / 2;
    const idealLeft   = idealCenter - tbWidth / 2;
    const clamped     = Math.max(INSET, Math.min(wrapperWidth - tbWidth - INSET, idealLeft));
    setToolbarLeft(clamped);
  }, []);

  // Recalculate whenever selection state, width, or align changes
  useLayoutEffect(() => {
    if (!selected) { setToolbarLeft(null); return; }
    // RAF so the DOM has settled after the render that showed the toolbar
    const id = requestAnimationFrame(recalcToolbarLeft);
    return () => cancelAnimationFrame(id);
  }, [selected, width, align, recalcToolbarLeft]);

  // ─── Corner resize handler ────────────────────────────────────────────────────
  const makeHandleMouseDown = useCallback(
    (dir: 1 | -1) =>
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const el = imgContainerRef.current;
        if (!el) return;

        const parentWidth = el.parentElement?.offsetWidth ?? 800;
        const startX      = e.clientX;
        const startPx     = el.getBoundingClientRect().width;

        setIsResizing(true);

        const onMove = (mv: MouseEvent) => {
          const delta  = (mv.clientX - startX) * dir;
          const newPx  = Math.max(60, startPx + delta);
          const newPct = Math.min(100, Math.round((newPx / parentWidth) * 100));
          el.style.width = `${newPct}%`;
          recalcToolbarLeft(); // keep toolbar tracking during drag
        };

        const onUp = (up: MouseEvent) => {
          const pw     = el.parentElement?.offsetWidth ?? 800;
          const delta  = (up.clientX - startX) * dir;
          const newPx  = Math.max(60, startPx + delta);
          const newPct = Math.min(100, Math.round((newPx / pw) * 100));
          updateAttributes({ width: `${newPct}%` });
          setIsResizing(false);
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup",   onUp);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup",   onUp);
      },
    [updateAttributes, recalcToolbarLeft]
  );

  // Sync DOM width when Tiptap attr changes (preset click, undo, etc.)
  useEffect(() => {
    if (imgContainerRef.current && !isResizing) {
      imgContainerRef.current.style.width = width ?? "100%";
    }
  }, [width, isResizing]);

  return (
    /**
     * NodeViewWrapper renders as a FULL-WIDTH block div.
     *  - paddingBottom reserves space for the floating toolbar below the image.
     *  - position: relative is the anchor for the absolutely-positioned toolbar.
     */
    <NodeViewWrapper
      style={{
        display:      "block",
        position:     "relative",
        marginTop:    "24px",
        marginBottom: "0",
        paddingBottom: selected ? "52px" : "0",
        transition:   "padding-bottom 0.15s ease",
        overflow:     "visible",
      }}
    >
      {/* ── Width-controlled image container ─────────────────────────── */}
      <div
        ref={imgContainerRef}
        style={{
          ...alignStyle,
          width:         width ?? "100%",
          maxWidth:      "100%",
          display:       "block",
          position:      "relative",
          borderRadius:  "8px",
          overflow:      "visible",     // let corner handles poke outside
          outline:       selected
            ? `2px solid ${isResizing ? "#60a5fa" : "#3b82f6"}`
            : "1px solid #e5e7eb",
          outlineOffset: "2px",
          boxShadow:     selected ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
          boxSizing:     "border-box",
        }}
      >
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || "uploaded image"}
          draggable={false}
          style={{
            width:        "100%",
            height:       "auto",
            display:      "block",
            borderRadius: "8px",
            objectFit:    "cover",
            userSelect:   "none",
          }}
        />

        {/* Corner resize handles */}
        {selected &&
          CORNER_HANDLES.map(({ id, cursor, style, dir }) => (
            <div
              key={id}
              onMouseDown={makeHandleMouseDown(dir as 1 | -1)}
              title="Drag to resize"
              style={{
                position:     "absolute",
                width:        "10px",
                height:       "10px",
                background:   "#ffffff",
                border:       "2px solid #3b82f6",
                borderRadius: "2px",
                cursor,
                zIndex:       60,
                boxShadow:    "0 1px 4px rgba(0,0,0,0.25)",
                ...style,
              }}
            />
          ))}
      </div>

      {/* ── Floating toolbar ────────────────────────────────────────────
       *
       * Lives as a direct child of NodeViewWrapper (full-width div).
       * Horizontal offset is computed in JS so the toolbar is:
       *   • centered below the image when there's room
       *   • clamped to the editor bounds when the image is near an edge
       *
       * This prevents clipping for left/right-aligned small images.
       * ──────────────────────────────────────────────────────────────── */}
      {selected && (
        <div
          ref={toolbarRef}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position:   "absolute",
            bottom:     "4px",
            // Use computed clamped position; fall back to center of wrapper
            // while toolbarLeft is still being measured
            left:       toolbarLeft !== null ? `${toolbarLeft}px` : "50%",
            transform:  toolbarLeft !== null ? "none" : "translateX(-50%)",
            zIndex:     70,
            whiteSpace: "nowrap",
            width:      "max-content",
          }}
        >
          <div
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "2px",
              background:     "rgba(255,255,255,0.97)",
              backdropFilter: "blur(8px)",
              border:         "1px solid #e5e7eb",
              borderRadius:   "10px",
              padding:        "6px 8px",
              boxShadow:      "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {/* ── Alignment buttons ── */}
            {(
              [
                { value: "left",   Icon: AlignLeft,   label: "Align Left"   },
                { value: "center", Icon: AlignCenter, label: "Align Center" },
                { value: "right",  Icon: AlignRight,  label: "Align Right"  },
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
                  padding:        "5px",
                  borderRadius:   "6px",
                  border:         "none",
                  cursor:         "pointer",
                  background:     align === value ? "#f3f4f6" : "transparent",
                  color:          align === value ? "#111827" : "#6b7280",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  flexShrink:     0,
                }}
              >
                <Icon style={{ width: 14, height: 14 }} strokeWidth={2.5} />
              </button>
            ))}

            {/* Divider */}
            <div style={{ width: 1, height: 18, background: "#d1d5db", margin: "0 4px", flexShrink: 0 }} />

            {/* ── Preset size buttons ── */}
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
                  padding:       "3px 7px",
                  borderRadius:  "6px",
                  border:        activePreset === preset ? "1px solid #bfdbfe" : "none",
                  cursor:        "pointer",
                  background:    activePreset === preset ? "#eff6ff" : "transparent",
                  color:         activePreset === preset ? "#1d4ed8" : "#6b7280",
                  fontSize:      "11px",
                  fontWeight:    600,
                  letterSpacing: "0.01em",
                  lineHeight:    1,
                  flexShrink:    0,
                }}
              >
                {preset}
              </button>
            ))}

            {/* Divider */}
            <div style={{ width: 1, height: 18, background: "#d1d5db", margin: "0 4px", flexShrink: 0 }} />

            {/* ── Replace image ── */}
            <label
              title="Replace Image"
              style={{
                padding:        "5px",
                borderRadius:   "6px",
                cursor:         "pointer",
                color:          "#6b7280",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                flexShrink:     0,
                background:     "transparent",
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

            {/* ── Delete ── */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                deleteNode();
              }}
              title="Delete Image"
              style={{
                padding:        "5px",
                borderRadius:   "6px",
                border:         "none",
                cursor:         "pointer",
                background:     "transparent",
                color:          "#ef4444",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                flexShrink:     0,
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
    const marginStyle =
      HTMLAttributes.align === "left"  ? "margin-left:0;margin-right:auto" :
      HTMLAttributes.align === "right" ? "margin-left:auto;margin-right:0"  :
                                         "margin-left:auto;margin-right:auto";

    return [
      "div",
      {
        style: `display:block;width:${HTMLAttributes.width||"100%"};max-width:100%;${marginStyle};margin-top:24px;margin-bottom:24px`,
      },
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          style:
            "width:100%;height:auto;display:block;border-radius:8px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.1)",
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
