'use client';

import { EntityForm } from '@/components/admin/EntityForm';
import { authClient } from '@/lib/auth-client';
import {
    displayValue,
    draftLabel,
    entities,
    fieldOptions,
    navGroups,
    type FormValues,
    type ValidatedRecord,
} from '@/lib/admin/entities';
import { cn } from '@/lib/utils';
import type { User } from 'better-auth';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Draft = {
    id: string;
    values: FormValues;
    payload: Record<string, unknown>;
};

type EditorState = { mode: 'create' } | { mode: 'edit'; id: string };

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);
    const [activeId, setActiveId] = useState(entities[0].id);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [drafts, setDrafts] = useState<Record<string, Draft[]>>({});
    const [editor, setEditor] = useState<EditorState | null>(null);

    const checkAuth = useCallback(async () => {
        const response = await authClient.getSession();
        if (!response.data?.user) {
            router.push('/admin/login');
            return;
        }
        setUser(response.data.user as User);
        setReady(true);
    }, [router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            const tag = (event.target as HTMLElement | null)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (editor) {
                setEditor(null);
                return;
            }
            setMobileOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [editor]);

    const active = entities.find((entity) => entity.id === activeId) ?? entities[0];
    const labelsHidden = collapsed && !mobileOpen;
    const records = drafts[active.id] ?? [];
    const editing = editor?.mode === 'edit' ? records.find((record) => record.id === editor.id) : undefined;

    const optionsBySource = useMemo(() => {
        const lists: Record<string, { value: string; label: string }[]> = {};
        for (const entity of entities) {
            lists[entity.id] = (drafts[entity.id] ?? []).map((record) => ({
                value: record.id,
                label: draftLabel(record.values),
            }));
        }
        if (user && !lists.users.some((option) => option.value === user.id)) {
            lists.users = [{ value: user.id, label: user.name || user.email }, ...lists.users];
        }
        return lists;
    }, [drafts, user]);

    const selectEntity = (id: string) => {
        setActiveId(id);
        setEditor(null);
        setMobileOpen(false);
    };

    const signOut = async () => {
        await authClient.signOut();
        router.push('/admin/login');
    };

    const saveRecord = (record: ValidatedRecord) => {
        // `record.payload` is the validated body. The API call replaces this local update.
        setDrafts((current) => {
            const list = current[active.id] ?? [];
            if (editor?.mode === 'edit' && editor.id) {
                return {
                    ...current,
                    [active.id]: list.map((item) =>
                        item.id === editor.id ? { id: item.id, values: record.values, payload: record.payload } : item,
                    ),
                };
            }
            return {
                ...current,
                [active.id]: [...list, { id: crypto.randomUUID(), values: record.values, payload: record.payload }],
            };
        });
        setEditor(null);
    };

    if (!ready) {
        return (
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <p className="font-mono text-xs text-muted-text">Checking session</p>
            </div>
        );
    }

    return (
        <div className="relative z-10 flex h-dvh overflow-hidden">
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-20 bg-black/60 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                id="admin-sidebar"
                className={cn(
                    'fixed inset-y-0 left-0 z-30 flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-surface transition-[width,transform] duration-200 motion-reduce:transition-none md:static md:z-auto md:translate-x-0',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                    collapsed && 'md:w-[72px]',
                )}
            >
                <div className={cn('flex items-center gap-2 px-3 py-4', labelsHidden ? 'md:justify-center' : 'justify-between')}>
                    {!labelsHidden && (
                        <div className="min-w-0 px-2">
                            <p className="truncate font-display text-sm font-semibold text-primary-text">Desk</p>
                            <p className="truncate text-xs text-muted-text">{user?.name}</p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setCollapsed((value) => !value)}
                        aria-expanded={!collapsed}
                        aria-controls="admin-sidebar"
                        className="hidden rounded-[8px_2px_8px_2px] p-2 text-muted-text transition hover:bg-white/5 hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close sidebar"
                        className="rounded-[8px_2px_8px_2px] p-2 text-muted-text transition hover:bg-white/5 hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <nav aria-label="Records" className="min-h-0 flex-1 space-y-5 overflow-y-auto px-2 pb-4">
                    {navGroups.map((group) => (
                        <div key={group.id}>
                            <p className={cn('px-3 pb-1.5 text-xs text-muted-text', labelsHidden && 'md:sr-only')}>
                                {group.label}
                            </p>
                            <ul className="space-y-0.5">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const selected = item.id === active.id;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                type="button"
                                                onClick={() => selectEntity(item.id)}
                                                aria-current={selected ? 'page' : undefined}
                                                title={labelsHidden ? item.label : undefined}
                                                className={cn(
                                                    'flex w-full items-center gap-2.5 rounded-[8px_2px_8px_2px] px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                                                    labelsHidden && 'md:justify-center md:px-0',
                                                    selected
                                                        ? 'bg-accent/15 text-primary-text'
                                                        : 'text-muted-text hover:bg-white/5 hover:text-primary-text',
                                                )}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                                                <span className={cn('truncate', labelsHidden && 'md:sr-only')}>{item.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="border-t border-white/10 p-2">
                    <button
                        type="button"
                        onClick={signOut}
                        title={labelsHidden ? 'Sign out' : undefined}
                        className={cn(
                            'flex w-full items-center gap-2.5 rounded-[8px_2px_8px_2px] px-3 py-2 text-sm text-muted-text transition hover:bg-white/5 hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                            labelsHidden && 'md:justify-center md:px-0',
                        )}
                    >
                        <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                        <span className={cn(labelsHidden && 'md:sr-only')}>Sign out</span>
                    </button>
                </div>
            </aside>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <header className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 md:px-8">
                    <div className="flex min-w-0 items-start gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            aria-expanded={mobileOpen}
                            aria-controls="admin-sidebar"
                            aria-label="Open sidebar"
                            className="mt-0.5 rounded-[8px_2px_8px_2px] p-2 text-muted-text transition hover:bg-white/5 hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
                        >
                            <Menu className="h-4 w-4" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="font-display text-2xl font-semibold tracking-tight text-primary-text">
                                {active.label}
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-text">{active.description}</p>
                        </div>
                    </div>
                    {!editor && (
                        <button
                            type="button"
                            onClick={() => setEditor({ mode: 'create' })}
                            className="inline-flex shrink-0 items-center gap-2 rounded-[12px_3px_12px_3px] bg-[#F1F3F5] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A0C0F] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <Plus className="h-3.5 w-3.5" aria-hidden />
                            Add {active.singular}
                        </button>
                    )}
                </header>

                <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
                    {editor ? (
                        <EntityForm
                            key={editor.mode === 'edit' ? editor.id : `${active.id}-create`}
                            entity={active}
                            mode={editor.mode}
                            initialValues={editing?.values}
                            optionsBySource={optionsBySource}
                            onSubmit={saveRecord}
                            onCancel={() => setEditor(null)}
                        />
                    ) : (
                        <div className="@container overflow-x-auto border border-white/10 bg-surface-raised">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        {active.columns.map((column) => (
                                            <th
                                                key={column.key}
                                                scope="col"
                                                className="whitespace-nowrap px-4 py-3 font-normal text-muted-text"
                                            >
                                                {column.label}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-4 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan={active.columns.length + 1} className="p-0">
                                                <p className="sticky left-0 w-[100cqw] px-4 py-16 text-center text-sm text-muted-text">
                                                    No {active.label.toLowerCase()} yet.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        records.map((record) => (
                                            <tr key={record.id} className="border-b border-white/10 last:border-b-0">
                                                {active.columns.map((column) => {
                                                    const field = active.fields.find((item) => item.name === column.key);
                                                    const text = displayValue(
                                                        field,
                                                        record.values[column.key],
                                                        field ? fieldOptions(field, optionsBySource) : [],
                                                    );
                                                    return (
                                                        <td key={column.key} className="max-w-[220px] truncate px-4 py-3 text-primary-text" title={text}>
                                                            {text || <span className="text-muted-text">—</span>}
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditor({ mode: 'edit', id: record.id })}
                                                        className="text-sm text-accent-secondary transition hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
