'use client';

import React, { useState, useEffect } from 'react';
import { z, ZodSchema } from 'zod';
import { generateSlug } from '@/lib/admin/slug';
import {
  X,
  Check,
  AlertCircle,
  Tag as TagIcon,
  Plus,
  Edit3,
  RotateCcw,
} from 'lucide-react';

export interface FormFieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'tags' | 'switch' | 'url' | 'date';
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  autoSlugFrom?: string;
  helperText?: string;
  defaultValue?: any;
}

interface AdminDynamicModalProps<T extends Record<string, any>> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T) => void;
  initialData?: T | null;
  title: string;
  model: string;
  fields: FormFieldDef[];
  schema: ZodSchema<any>;
}

export default function AdminDynamicModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  model,
  fields,
  schema,
}: AdminDynamicModalProps<T>) {
  const isEditing = Boolean(initialData);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({ ...initialData });
    } else {
      const defaults: Record<string, any> = {};
      fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaults[field.name] = field.defaultValue;
        } else if (field.type === 'switch') {
          defaults[field.name] = false;
        } else if (field.type === 'tags') {
          defaults[field.name] = [];
        } else if (field.type === 'number') {
          defaults[field.name] = 0;
        } else if (field.type === 'select' && field.options && field.options.length > 0) {
          defaults[field.name] = field.options[0].value;
        } else {
          defaults[field.name] = '';
        }
      });
      setFormData(defaults);
    }
    setErrors({});
    setTagInputs({});
  }, [isOpen, initialData, fields]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Handle auto-slug if configured
      fields.forEach((field) => {
        if (field.autoSlugFrom === name && !isEditing) {
          next[field.name] = generateSlug(String(value));
        }
      });

      return next;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleAddTag = (fieldName: string) => {
    const raw = tagInputs[fieldName] || '';
    const trimmed = raw.trim();
    if (!trimmed) return;

    const currentTags: string[] = formData[fieldName] || [];
    if (!currentTags.includes(trimmed)) {
      handleChange(fieldName, [...currentTags, trimmed]);
    }
    setTagInputs((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleRemoveTag = (fieldName: string, tagToRemove: string) => {
    const currentTags: string[] = formData[fieldName] || [];
    handleChange(
      fieldName,
      currentTags.filter((t) => t !== tagToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSave(result.data as T);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-[16px_4px_16px_4px] border border-white/10 bg-[#0A0D14] text-[#F1F3F5] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#0E121B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[6px_2px_6px_2px] bg-accent/20 border border-accent/30 text-accent">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  Prisma Model • @{model}
                </span>
                <span className="rounded-[4px_1px_4px_1px] border border-white/10 bg-white/5 px-1.5 py-0.2 font-mono text-[9px] text-muted-text">
                  {isEditing ? 'UPDATE MODE' : 'CREATE MODE'}
                </span>
              </div>
              <h2 className="text-base font-bold font-display text-white">
                {isEditing ? `Update ${title}` : `Create New ${title}`}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px_2px_6px_2px] p-1.5 text-muted-text hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {fields.map((field) => {
              const value = formData[field.name];
              const fieldError = errors[field.name];

              return (
                <div key={field.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-semibold text-white">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {field.autoSlugFrom && (
                      <button
                        type="button"
                        onClick={() =>
                          handleChange(
                            field.name,
                            generateSlug(String(formData[field.autoSlugFrom!] || ''))
                          )
                        }
                        className="font-mono text-[10px] text-accent hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="h-2.5 w-2.5" /> Sync from {field.autoSlugFrom}
                      </button>
                    )}
                  </div>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={value ?? ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full rounded-[8px_2px_8px_2px] border bg-[#0E121B] p-2.5 font-sans text-xs text-white placeholder:text-muted-text/50 focus:outline-none transition ${
                        fieldError ? 'border-red-500' : 'border-white/10 focus:border-accent'
                      }`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={value ?? ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="h-10 w-full rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] px-3 font-mono text-xs text-white focus:border-accent focus:outline-none"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0E121B] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'switch' ? (
                    <label className="flex items-center gap-3 rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] p-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => handleChange(field.name, e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-accent focus:ring-0"
                      />
                      <span className="font-mono text-xs text-white select-none">
                        Enable / Set Active
                      </span>
                    </label>
                  ) : field.type === 'tags' ? (
                    <div className="rounded-[8px_2px_8px_2px] border border-white/10 bg-[#0E121B] p-2.5 space-y-2">
                      <div className="flex flex-wrap gap-1.5 min-h-[30px] p-1 rounded bg-black/20">
                        {Array.isArray(value) && value.length > 0 ? (
                          value.map((t: string) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] border border-accent/30 bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent"
                            >
                              {t}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(field.name, t)}
                                className="hover:text-white cursor-pointer"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="font-mono text-[10px] text-muted-text/60 italic self-center">
                            No tags added.
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tagInputs[field.name] || ''}
                          onChange={(e) =>
                            setTagInputs({ ...tagInputs, [field.name]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(field.name);
                            }
                          }}
                          placeholder="Type tag & press enter..."
                          className="h-8 flex-1 rounded-[6px_2px_6px_2px] border border-white/10 bg-black/30 px-2.5 font-mono text-xs text-white placeholder:text-muted-text/50 focus:border-accent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag(field.name)}
                          className="h-8 rounded-[6px_2px_6px_2px] border border-white/10 bg-white/5 px-3 font-mono text-xs text-white hover:bg-white/10 transition cursor-pointer"
                        >
                          <Plus className="h-3 w-3 inline mr-1" /> Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={value ?? ''}
                      onChange={(e) =>
                        handleChange(
                          field.name,
                          field.type === 'number' ? Number(e.target.value) : e.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      className={`h-10 w-full rounded-[8px_2px_8px_2px] border bg-[#0E121B] px-3 font-mono text-xs text-white placeholder:text-muted-text/50 focus:outline-none transition ${
                        fieldError ? 'border-red-500' : 'border-white/10 focus:border-accent'
                      }`}
                    />
                  )}

                  {field.helperText && (
                    <p className="font-mono text-[10px] text-muted-text">{field.helperText}</p>
                  )}
                  {fieldError && (
                    <p className="font-mono text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {fieldError}
                    </p>
                  )}
                </div>
              );
            })}

            {Object.keys(errors).length > 0 && (
              <div className="rounded-[8px_2px_8px_2px] border border-red-500/30 bg-red-500/10 p-3 text-red-300 font-mono text-xs">
                <p className="font-semibold mb-1">Validation Errors:</p>
                <ul className="list-disc list-inside text-[11px] space-y-0.5">
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>
                      <span className="uppercase">{key}</span>: {msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 bg-[#0E121B] shrink-0">
            <span className="font-mono text-[11px] text-muted-text">
              Dynamic Form • Model @{model}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[8px_2px_8px_2px] border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-muted-text hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[8px_2px_8px_2px] bg-accent px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-accent-secondary transition shadow-sm cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isEditing ? 'Save Changes' : `Create ${title}`}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
