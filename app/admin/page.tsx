'use client';

import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import type { User } from 'better-auth';
import {
    Award,
    Boxes,
    Briefcase,
    FileText,
    Fingerprint,
    FolderKanban,
    GraduationCap,
    Hash,
    KeyRound,
    Layers,
    LogOut,
    Menu,
    MessageSquare,
    MonitorSmartphone,
    PanelLeftClose,
    PanelLeftOpen,
    Quote,
    SmilePlus,
    Users,
    Wrench,
    X,
    type LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Entity = {
    id: string;
    label: string;
    description: string;
    columns: string[];
    icon: LucideIcon;
};

type NavGroup = {
    id: string;
    label: string;
    items: Entity[];
};

const navGroups: NavGroup[] = [
    {
        id: 'portfolio',
        label: 'Portfolio',
        items: [
            {
                id: 'projects',
                label: 'Projects',
                description: 'Case studies, links, and the stack each one uses.',
                columns: ['Name', 'Slug', 'Category', 'Featured', 'Live link'],
                icon: FolderKanban,
            },
            {
                id: 'experience',
                label: 'Experience',
                description: 'Roles, companies, and the dates they cover.',
                columns: ['Role', 'Company', 'Start', 'End', 'Location'],
                icon: Briefcase,
            },
            {
                id: 'education',
                label: 'Education',
                description: 'Schools, degrees, and enrollment dates.',
                columns: ['Institution', 'Degree', 'Start', 'End'],
                icon: GraduationCap,
            },
            {
                id: 'certifications',
                label: 'Certifications',
                description: 'Credentials, who issued them, and the proof link.',
                columns: ['Name', 'Issuer', 'Completed', 'URL'],
                icon: Award,
            },
            {
                id: 'references',
                label: 'References',
                description: 'People who can speak to the work.',
                columns: ['Name', 'Role', 'Company', 'Email'],
                icon: Quote,
            },
            {
                id: 'skills',
                label: 'Skills',
                description: 'Named skills, grouped by category.',
                columns: ['Name', 'Categories'],
                icon: Wrench,
            },
            {
                id: 'skill-categories',
                label: 'Skill categories',
                description: 'Groups that skills belong to.',
                columns: ['Name', 'Skills'],
                icon: Layers,
            },
            {
                id: 'stack',
                label: 'Stack',
                description: 'Tools shared across projects.',
                columns: ['Name', 'Icon', 'Projects'],
                icon: Boxes,
            },
        ],
    },
    {
        id: 'writing',
        label: 'Writing',
        items: [
            {
                id: 'posts',
                label: 'Posts',
                description: 'Blog posts, their authors, tags, and comments.',
                columns: ['Title', 'Slug', 'Category', 'Views', 'Author'],
                icon: FileText,
            },
            {
                id: 'tags',
                label: 'Tags',
                description: 'Labels attached to posts.',
                columns: ['Name', 'Posts'],
                icon: Hash,
            },
            {
                id: 'comments',
                label: 'Comments',
                description: 'Replies left on posts.',
                columns: ['Content', 'Post', 'Author', 'Upvotes'],
                icon: MessageSquare,
            },
            {
                id: 'reactions',
                label: 'Reactions',
                description: 'How readers marked a post.',
                columns: ['Reaction', 'Post', 'User'],
                icon: SmilePlus,
            },
        ],
    },
    {
        id: 'access',
        label: 'Access',
        items: [
            {
                id: 'users',
                label: 'Users',
                description: 'Accounts that can sign in and publish.',
                columns: ['Name', 'Email', 'Phone', 'Verified'],
                icon: Users,
            },
            {
                id: 'sessions',
                label: 'Sessions',
                description: 'Active sign-ins and when they expire.',
                columns: ['User', 'Expires', 'IP address'],
                icon: MonitorSmartphone,
            },
            {
                id: 'accounts',
                label: 'Accounts',
                description: 'Login providers linked to a user.',
                columns: ['User', 'Provider'],
                icon: KeyRound,
            },
            {
                id: 'passkeys',
                label: 'Passkeys',
                description: 'Device credentials registered for sign-in.',
                columns: ['Name', 'Device', 'User'],
                icon: Fingerprint,
            },
        ],
    },
];

const entities = navGroups.flatMap((group) => group.items);

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);
    const [activeId, setActiveId] = useState(entities[0].id);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

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
        if (!mobileOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen]);

    const active = entities.find((entity) => entity.id === activeId) ?? entities[0];
    const labelsHidden = collapsed && !mobileOpen;

    const selectEntity = (id: string) => {
        setActiveId(id);
        setMobileOpen(false);
    };

    const signOut = async () => {
        await authClient.signOut();
        router.push('/admin/login');
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
                </header>

                <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
                    <div className="@container overflow-x-auto border border-white/10 bg-surface-raised">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    {active.columns.map((column) => (
                                        <th
                                            key={column}
                                            scope="col"
                                            className="whitespace-nowrap px-4 py-3 font-normal text-muted-text"
                                        >
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={active.columns.length} className="p-0">
                                        <p className="sticky left-0 w-[100cqw] px-4 py-16 text-center text-sm text-muted-text">
                                            No {active.label.toLowerCase()} yet.
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
