'use client';

import {
    emptyValues,
    fieldOptions,
    validateEntity,
    type AdminEntity,
    type FormValues,
    type Option,
    type ValidatedRecord,
} from '@/lib/admin/entities';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

const controlClassName =
    'w-full rounded-[10px_2px_10px_2px] border border-white/12 bg-surface px-3.5 py-3 text-sm text-primary-text caret-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-muted-text/70 focus:border-accent focus:ring-2 focus:ring-accent/30';

type EntityFormProps = {
    entity: AdminEntity;
    mode: 'create' | 'edit';
    initialValues?: FormValues;
    optionsBySource: Record<string, Option[]>;
    onSubmit: (record: ValidatedRecord) => void;
    onCancel: () => void;
};

export function EntityForm({ entity, mode, initialValues, optionsBySource, onSubmit, onCancel }: EntityFormProps) {
    const formId = useId();
    const [values, setValues] = useState<FormValues>(() => ({ ...emptyValues(entity), ...initialValues }));
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [focusField, setFocusField] = useState<string | null>(null);

    useEffect(() => {
        if (!focusField) return;
        document.getElementById(`${formId}-${focusField}`)?.focus();
        setFocusField(null);
    }, [focusField, formId]);

    const setValue = (name: string, value: FormValues[string]) => {
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => {
            if (!current[name]) return current;
            const next = { ...current };
            delete next[name];
            return next;
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const result = validateEntity(entity, values);
        if (!result.ok) {
            setErrors(result.errors);
            setFocusField(Object.keys(result.errors)[0] ?? null);
            return;
        }
        onSubmit({ values: result.values, payload: result.payload });
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl">
            <button
                type="button"
                onClick={onCancel}
                className="text-sm text-muted-text transition hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                Back to {entity.label.toLowerCase()}
            </button>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-primary-text">
                {mode === 'create' ? `Add ${entity.singular}` : `Edit ${entity.singular}`}
            </h2>

            <div className="mt-8 space-y-5">
                {entity.fields.map((field) => {
                    const id = `${formId}-${field.name}`;
                    const error = errors[field.name];
                    const errorId = error ? `${id}-error` : undefined;
                    const describedBy = errorId;

                    if (field.kind === 'boolean') {
                        const checked = values[field.name] === true;
                        return (
                            <div key={field.name}>
                                <label htmlFor={id} className="flex items-center gap-3 text-sm text-primary-text">
                                    <input
                                        id={id}
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(event) => setValue(field.name, event.target.checked)}
                                        className="h-4 w-4 accent-accent"
                                    />
                                    {field.label}
                                </label>
                            </div>
                        );
                    }

                    if (field.kind === 'multiselect') {
                        const selected = listValue(values[field.name]);
                        const options = fieldOptions(field, optionsBySource);
                        return (
                            <fieldset key={field.name} aria-describedby={describedBy}>
                                <legend className="text-sm text-primary-text">
                                    {field.label}
                                    {field.required && <RequiredMark />}
                                </legend>
                                {options.length === 0 ? (
                                    <p className="mt-2 text-sm text-muted-text">Nothing to choose yet.</p>
                                ) : (
                                    <ul className="mt-2 space-y-2">
                                        {options.map((option) => {
                                            const active = selected.includes(option.value);
                                            return (
                                                <li key={option.value}>
                                                    <label className="flex items-center gap-3 text-sm text-primary-text">
                                                        <input
                                                            type="checkbox"
                                                            checked={active}
                                                            onChange={() => {
                                                                const next = active
                                                                    ? selected.filter((item) => item !== option.value)
                                                                    : [...selected, option.value];
                                                                setValue(field.name, next);
                                                            }}
                                                            className="h-4 w-4 accent-accent"
                                                        />
                                                        {option.label}
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                                {error && <FieldError id={errorId!} message={error} />}
                            </fieldset>
                        );
                    }

                    return (
                        <div key={field.name}>
                            <label htmlFor={id} className="text-sm text-primary-text">
                                {field.label}
                                {field.required && <RequiredMark />}
                            </label>
                            <div className="mt-2">
                                {field.kind === 'textarea' || field.kind === 'json' ? (
                                    <textarea
                                        id={id}
                                        value={stringValue(values[field.name])}
                                        onChange={(event) => setValue(field.name, event.target.value)}
                                        required={field.required}
                                        aria-invalid={Boolean(error)}
                                        aria-describedby={describedBy}
                                        rows={field.rows ?? 4}
                                        placeholder={field.kind === 'json' ? (field.placeholder ?? '[]') : field.placeholder}
                                        spellCheck={field.kind === 'json' ? false : undefined}
                                        className={cn(controlClassName, 'resize-y', error && 'border-red-400/60')}
                                    />
                                ) : field.kind === 'tags' ? (
                                    <TagInput
                                        id={id}
                                        values={listValue(values[field.name])}
                                        placeholder={field.placeholder ?? (field.item === 'url' ? 'https://' : 'Add one, then press Enter')}
                                        describedBy={describedBy}
                                        invalid={Boolean(error)}
                                        onChange={(next) => setValue(field.name, next)}
                                    />
                                ) : field.kind === 'select' ? (
                                    <select
                                        id={id}
                                        value={stringValue(values[field.name])}
                                        onChange={(event) => setValue(field.name, event.target.value)}
                                        required={field.required}
                                        aria-invalid={Boolean(error)}
                                        aria-describedby={describedBy}
                                        className={cn(controlClassName, error && 'border-red-400/60')}
                                    >
                                        <option value="">Choose</option>
                                        {fieldOptions(field, optionsBySource).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={id}
                                        type={inputType(field.kind)}
                                        value={stringValue(values[field.name])}
                                        onChange={(event) => setValue(field.name, event.target.value)}
                                        required={field.required}
                                        aria-invalid={Boolean(error)}
                                        aria-describedby={describedBy}
                                        placeholder={field.placeholder}
                                        spellCheck={field.kind === 'slug' || field.kind === 'url' || field.kind === 'email' ? false : undefined}
                                        inputMode={field.kind === 'number' ? 'decimal' : undefined}
                                        maxLength={field.kind === 'tel' ? 17 : undefined}
                                        className={cn(controlClassName, error && 'border-red-400/60')}
                                    />
                                )}
                            </div>
                            {error && <FieldError id={errorId!} message={error} />}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex items-center gap-3">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-[12px_3px_12px_3px] bg-[#F1F3F5] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A0C0F] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    {mode === 'create' ? `Add ${entity.singular}` : 'Save changes'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-[12px_3px_12px_3px] px-4 py-3 text-sm text-muted-text transition hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

function TagInput({
    id,
    values,
    placeholder,
    describedBy,
    invalid,
    onChange,
}: {
    id: string;
    values: string[];
    placeholder: string;
    describedBy?: string;
    invalid: boolean;
    onChange: (values: string[]) => void;
}) {
    const [draft, setDraft] = useState('');

    const add = () => {
        const next = draft.trim();
        if (!next || values.includes(next)) {
            setDraft('');
            return;
        }
        onChange([...values, next]);
        setDraft('');
    };

    return (
        <div>
            {values.length > 0 && (
                <ul className="mb-2 flex flex-wrap gap-2">
                    {values.map((value) => (
                        <li key={value}>
                            <span className="inline-flex items-center gap-1 rounded-[8px_2px_8px_2px] border border-white/12 bg-surface px-2 py-1 text-xs text-primary-text">
                                {value}
                                <button
                                    type="button"
                                    onClick={() => onChange(values.filter((item) => item !== value))}
                                    aria-label={`Remove ${value}`}
                                    className="text-muted-text transition hover:text-primary-text"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex gap-2">
                <input
                    id={id}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            add();
                        }
                    }}
                    placeholder={placeholder}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={cn(controlClassName, invalid && 'border-red-400/60')}
                />
                <button
                    type="button"
                    onClick={add}
                    className="shrink-0 rounded-[10px_2px_10px_2px] border border-white/12 px-3 text-sm text-primary-text transition hover:bg-white/5"
                >
                    Add
                </button>
            </div>
        </div>
    );
}

function RequiredMark() {
    return (
        <abbr title="required" className="ml-1 text-accent-secondary no-underline">
            *
        </abbr>
    );
}

function FieldError({ id, message }: { id: string; message: string }) {
    return (
        <p id={id} role="alert" className="mt-2 text-sm text-red-300">
            {message}
        </p>
    );
}

function stringValue(value: FormValues[string] | undefined) {
    return typeof value === 'string' ? value : '';
}

function listValue(value: FormValues[string] | undefined): string[] {
    return Array.isArray(value) ? value : [];
}

function inputType(kind: 'text' | 'email' | 'url' | 'tel' | 'password' | 'slug' | 'date' | 'datetime' | 'number') {
    if (kind === 'slug') return 'text';
    if (kind === 'datetime') return 'datetime-local';
    return kind;
}
