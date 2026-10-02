'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Trash2, AlertTriangle, Check, X } from 'lucide-react';

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
  align = 'right',
  disabled = false,
}: DeleteConfirmPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={handleTrigger}
        disabled={disabled || isDeleting}
        className={triggerClassName}
        title="Delete"
        aria-expanded={isOpen}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-full mb-2 z-50 w-56 sm:w-64 rounded-[10px_3px_10px_3px] border border-red-500/30 bg-[#121622] p-3 text-left shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right'
              ? 'right-0 origin-bottom-right'
              : align === 'left'
              ? 'left-0 origin-bottom-left'
              : 'left-1/2 -translate-x-1/2 origin-bottom'
          }`}
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

          {/* Bottom Arrow Indicator */}
          <div
            className={`absolute top-full -mt-[1px] h-2 w-2 rotate-45 border-r border-b border-red-500/30 bg-[#121622] ${
              align === 'right'
                ? 'right-3'
                : align === 'left'
                ? 'left-3'
                : 'left-1/2 -translate-x-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
}
