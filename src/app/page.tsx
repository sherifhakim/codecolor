"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Lock, Unlock, Layers, Plus, Minus, RefreshCw, Copy, GripVertical, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLORS, type ColorItem } from "@/lib/ohuhu-colors";
import {
  ZONES,
  type StyleMode,
  getShadowHighlight,
  generatePalette as engineGeneratePalette
} from "@/lib/palette-engine";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function getLuminance(hex: string) {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

type PaletteItem = {
  id: string;
  color: ColorItem;
  locked: boolean;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

function SortableColorCard({
  item,
  onToggleLock,
  isActivePopover,
  setActivePopoverId
}: {
  item: PaletteItem;
  onToggleLock: () => void;
  isActivePopover: boolean;
  setActivePopoverId: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition ? `${transition}, scale 200ms ease, opacity 200ms ease, background-color 300ms ease` : 'scale 200ms ease, opacity 200ms ease, background-color 300ms ease',
    backgroundColor: item.color.hex,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.85 : 1,
    scale: isDragging ? "1.02" : "1",
  };

  const lum = getLuminance(item.color.hex);
  const textColor = lum > 0.5 ? "text-stone-900" : "text-white";
  const gripColor = lum > 0.5 ? "text-black/40" : "text-white/40";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-1 flex flex-col relative group overflow-hidden touch-none select-none ${isDragging ? 'shadow-2xl z-50' : 'z-0'}`}
    >
      <div className={`absolute inset-0 pointer-events-none flex flex-col z-10 ${textColor}`}>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 md:top-2 md:translate-y-0 flex flex-row md:flex-col items-center gap-1.5 pointer-events-auto">
          <div
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className={`p-1.5 cursor-grab active:cursor-grabbing transition-opacity sm:opacity-0 sm:group-hover:opacity-100 ${gripColor}`}
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={setActivePopoverId}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition flex items-center justify-center z-10 cursor-pointer sm:opacity-0 sm:group-hover:opacity-100" title="Shadow & Highlight">
            <Layers className="w-4 h-4" />
          </button>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onToggleLock}
            className={`p-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition flex items-center justify-center z-10 cursor-pointer ${item.locked ? 'opacity-100' : 'sm:opacity-0 sm:group-hover:opacity-100'}`} title="Lock Color">
            {item.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => { navigator.clipboard.writeText(item.color.hex); }}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition flex items-center justify-center cursor-pointer sm:opacity-0 sm:group-hover:opacity-100" title="Copy Hex">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`my-auto md:mt-auto md:mb-0 p-2 pl-3 sm:p-3 flex flex-col w-full z-0 ${textColor}`}>
        <div className="flex flex-col text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-0 text-shadow-sm truncate">
            {item.color.newCode}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base font-medium opacity-90 truncate leading-tight">{item.color.newName}</p>
        </div>
      </div>

      {isActivePopover && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-3 z-50 flex gap-2 w-max animate-in fade-in zoom-in-95 pointer-events-auto cursor-auto"
        >
          <button className="absolute -top-2 -right-2 bg-stone-200 text-stone-600 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm hover:bg-stone-300" onClick={setActivePopoverId}>×</button>
          {(() => {
            const { highlight, shadow } = getShadowHighlight(item.color, COLORS);
            return (
              <>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">HL</span>
                  <div className="w-12 h-12 rounded-md shadow-inner mb-1 flex items-center justify-center text-center" style={{ backgroundColor: highlight ? highlight.hex : '#f5f5f5' }}>
                    {!highlight && <span className="text-[10px] leading-tight text-stone-400">No highlight</span>}
                  </div>
                  <span className="text-[10px] font-semibold text-stone-700">{highlight ? highlight.newCode : 'No highlight'}</span>
                </div>

                <div className="flex flex-col items-center border-l pl-2 border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">SH</span>
                  <div className="w-12 h-12 rounded-md shadow-inner mb-1 flex items-center justify-center text-center" style={{ backgroundColor: shadow ? shadow.hex : '#222' }}>
                    {!shadow && <span className="text-[10px] leading-tight text-stone-500">No shadow</span>}
                  </div>
                  <span className="text-[10px] font-semibold text-stone-700">{shadow ? shadow.newCode : 'No shadow'}</span>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function Generator() {
  const [styleMode, setStyleMode] = useState<StyleMode>("All");
  const [count, setCount] = useState(5);
  const [palette, setPalette] = useState<PaletteItem[]>([]);
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);

  const generatePalette = useCallback((currentStyle: StyleMode, currentCount: number, currentPalette: PaletteItem[]) => {
    const currentLocks = currentPalette.reduce((acc, item, i) => {
      if (item.locked) acc[i] = true;
      return acc;
    }, {} as Record<number, boolean>);

    const currentColors = currentPalette.map(item => item.color);

    const newColors = engineGeneratePalette(COLORS, currentStyle, currentCount, currentLocks, currentColors);

    setPalette(newColors.map((color, i) => {
      const isLocked = currentLocks[i] || false;
      const existingId = (isLocked && currentPalette[i]) ? currentPalette[i].id : generateId();
      return {
        id: existingId,
        color,
        locked: isLocked
      };
    }));
  }, []);

  // Initial load
  useEffect(() => {
    if (palette.length === 0) {
      generatePalette("All", 5, []);
    }
  }, []);

  const handleGenerate = () => {
    generatePalette(styleMode, count, palette);
  };

  const toggleLock = (id: string) => {
    setPalette(prev => prev.map(item => item.id === id ? { ...item, locked: !item.locked } : item));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActivePopoverId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPalette((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const paletteIds = palette.map(item => item.id);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-stone-50 text-stone-900 font-sans">
      <header className="shrink-0 h-[48px] w-full bg-cream px-4 sm:px-6 border-b border-stone-200 z-10 flex items-center shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-800 tracking-tight">CodeColor</h1>
          <div className="text-xs sm:text-sm font-medium text-stone-500">Find your perfect palette</div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={paletteIds} strategy={rectSortingStrategy}>
            {palette.map((item) => (
              <SortableColorCard
                key={item.id}
                item={item}
                onToggleLock={() => toggleLock(item.id)}
                isActivePopover={activePopoverId === item.id}
                setActivePopoverId={() => setActivePopoverId(activePopoverId === item.id ? null : item.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </main>

      <footer className="shrink-0 h-[56px] flex items-center w-full bg-white border-t border-stone-200 px-1.5 sm:px-4 z-10">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 flex-nowrap">

          <Select value={styleMode} onValueChange={(v: StyleMode) => { setStyleMode(v); generatePalette(v, count, palette); }}>
            <SelectTrigger className="flex-1 min-w-[65px] max-w-[120px] text-[10px] sm:text-xs h-9 bg-stone-50 border-stone-300 !px-1.5 sm:!px-2">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ZONES).map(z => (
                <SelectItem key={z} value={z} className="text-xs">{z}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-0.5 shrink-0 bg-stone-50 border border-stone-300 rounded-md p-0.5 h-9">
            <button
              onClick={() => {
                const newCount = Math.max(2, count - 1);
                setCount(newCount);
                generatePalette(styleMode, newCount, palette);
              }}
              className="w-[24px] sm:w-[28px] h-full flex items-center justify-center hover:bg-stone-200 transition rounded-[4px] disabled:opacity-50"
              disabled={count <= 2}
            >
              <Minus className="w-3 h-3" />
            </button>
            <div className="w-3 sm:w-4 text-center text-[11px] sm:text-xs font-semibold">{count}</div>
            <button
              onClick={() => {
                const newCount = Math.min(7, count + 1);
                setCount(newCount);
                generatePalette(styleMode, newCount, palette);
              }}
              className="w-[24px] sm:w-[28px] h-full flex items-center justify-center hover:bg-stone-200 transition rounded-[4px] disabled:opacity-50"
              disabled={count >= 7}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleGenerate}
            className="shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-2.5 sm:px-4 h-9 rounded-full font-medium transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs shrink-0 font-medium whitespace-nowrap">Generate</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
