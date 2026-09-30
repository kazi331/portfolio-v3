'use client';

import { Edit3, Eye, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  emptyMessage?: string;
}

export default function AdminDataTable<T extends object>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  onEdit,
  onDelete,
  onView,
  emptyMessage = 'No records found.',
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchKey, searchTerm]);

  return (
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      {searchKey && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-text" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0F131C] pl-9 pr-3 font-mono text-xs text-white placeholder:text-muted-text/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <span className="font-mono text-[11px] text-muted-text">
            {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
          </span>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0F131C] shadow-md">
        <table className="w-full text-left font-sans text-xs">
          <thead className="border-b border-white/10 bg-white/5 font-mono text-[10px] uppercase tracking-wider text-muted-text">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3 font-semibold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-text font-mono text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((item, rowIdx) => {
                const itemAny = item as Record<string, unknown>;
                const rowKey = (itemAny.id || itemAny.slug || itemAny.name || itemAny.title || rowIdx) as string | number;
                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-4 py-3.5 text-white/90 ${col.className || ''}`}>
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                          ? (item[col.accessorKey] as React.ReactNode)
                          : null}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onView && (
                            <button
                              type="button"
                              onClick={() => onView(item)}
                              className="rounded-[4px_1px_4px_1px] p-1 text-muted-text hover:bg-white/10 hover:text-white transition"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(item)}
                              className="rounded-[4px_1px_4px_1px] p-1 text-muted-text hover:bg-white/10 hover:text-accent transition"
                              title="Edit Record"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(item)}
                              className="rounded-[4px_1px_4px_1px] p-1 text-muted-text hover:bg-red-500/10 hover:text-red-400 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
