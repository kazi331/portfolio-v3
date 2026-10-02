'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmPopoverProps {
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  triggerClassName?: string;
  align?: 'right' | 'left' | 'center';
  disabled?: boolean;
}

export default function DeleteConfirmPopover({
  onConfirm,
  title = 'Delete record?',
  description = 'This cannot be undone.',
  itemName,
  triggerClassName = 'rounded-[4px_1px_4px_1px] p-1 text-muted-text hover:bg-red-500/15 hover:text-red-400 transition cursor-pointer',
  disabled = false,
}: DeleteConfirmPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left?: number;
    right?: number;
    placeAbove: boolean;
  }>({
    top: 0,
    placeAbove: true,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    // Check if there is enough space above (requires ~130px)
    const placeAbove = rect.top >= 130;
    const POPOVER_WIDTH = 260;

    // Calculate horizontal placement (align right with trigger button, keep 12px margin from window edge)
    const rightMargin = Math.max(12, window.innerWidth - rect.right);
    const leftPos = Math.max(
      12,
      Math.min(window.innerWidth - POPOVER_WIDTH - 12, rect.right - POPOVER_WIDTH)
    );

    if (placeAbove) {
      setCoords({
        top: rect.top - 8,
        left: leftPos,
        right: rightMargin,
        placeAbove: true,
      });
    } else {
      setCoords({
        top: rect.bottom + 8,
        left: leftPos,
        right: rightMargin,
        placeAbove: false,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDeleting(true);
      await onConfirm();
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const handleTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTrigger}
        disabled={disabled || isDeleting}
        className={triggerClassName}
        title="Delete"
        aria-expanded={isOpen}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
              transform: coords.placeAbove ? 'translateY(-100%)' : 'translateY(0)',
            }}
            className="w-64 rounded-[10px_3px_10px_3px] border border-red-500/30 bg-[#121622]/98 p-3 text-left shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 select-none"
          >
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px_1px_4px_1px] bg-red-500/20 text-red-400 mt-0.5">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs font-semibold text-white leading-tight">
                  {title}
                </p>
                {itemName && (
                  <p className="font-mono text-[11px] text-red-300 truncate mt-0.5">
                    &ldquo;{itemName}&rdquo;
                  </p>
                )}
                <p className="font-mono text-[10px] text-muted-text mt-0.5">
                  {description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-muted-text hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] border border-red-500/40 bg-red-500/20 px-2.5 py-1 font-mono text-[10px] font-bold text-red-200 hover:bg-red-500/30 hover:text-white transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-2.5 w-2.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>

            {/* Pointer arrow anchor */}
            {coords.placeAbove ? (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '12px',
                  width: '10px',
                  height: '10px',
                  transform: 'rotate(45deg)',
                  backgroundColor: '#121622',
                  borderRight: '1px solid rgba(239, 68, 68, 0.3)',
                  borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '12px',
                  width: '10px',
                  height: '10px',
                  transform: 'rotate(45deg)',
                  backgroundColor: '#121622',
                  borderLeft: '1px solid rgba(239, 68, 68, 0.3)',
                  borderTop: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
}
