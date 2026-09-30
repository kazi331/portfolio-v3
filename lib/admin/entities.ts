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
    MessageSquare,
    MonitorSmartphone,
    Quote,
    SmilePlus,
    Users,
    Wrench,
    type LucideIcon,
} from 'lucide-react';
import { z } from 'zod';

export type Option = {
    value: string;
    label: string;
};

type FieldBase = {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
};

export type Field =
    | (FieldBase & { kind: 'text' | 'email' | 'url' | 'tel' | 'password' | 'slug' | 'date' | 'datetime' })
    | (FieldBase & { kind: 'textarea'; rows?: number })
    | (FieldBase & { kind: 'json'; rows?: number; defaultValue?: string })
    | (FieldBase & { kind: 'number'; defaultValue?: string })
    | (FieldBase & { kind: 'boolean'; defaultValue?: boolean })
    | (FieldBase & { kind: 'tags'; item?: 'text' | 'url' })
    | (FieldBase & { kind: 'select'; source?: string; options?: Option[]; defaultValue?: string })
    | (FieldBase & { kind: 'multiselect'; source: string });

export type Column = {
    key: string;
    label: string;
};

export type AdminEntity = {
    id: string;
    label: string;
    singular: string;
    description: string;
    icon: LucideIcon;
    columns: Column[];
    fields: Field[];
};

export type FormValues = Record<string, string | boolean | string[]>;

export type ValidatedRecord = {
    values: FormValues;
    payload: Record<string, unknown>;
};

const reactionOptions: Option[] = [
    { value: 'insightful', label: 'Insightful' },
    { value: 'practical', label: 'Practical' },
    { value: 'funny', label: 'Funny' },
    { value: 'must-save', label: 'Must save' },
];

const project: AdminEntity = {
    id: 'projects',
    label: 'Projects',
    singular: 'project',
    description: 'Case studies, links, and the stack each one uses.',
    icon: FolderKanban,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'category', label: 'Category' },
        { key: 'featured', label: 'Featured' },
        { key: 'liveLink', label: 'Live link' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'slug', name: 'slug', label: 'Slug', required: true, placeholder: 'project-name' },
        { kind: 'text', name: 'excerpt', label: 'Excerpt' },
        { kind: 'boolean', name: 'featured', label: 'Featured', defaultValue: false },
        { kind: 'textarea', name: 'description', label: 'Description', rows: 5 },
        { kind: 'textarea', name: 'challenge', label: 'Challenge', rows: 4 },
        { kind: 'textarea', name: 'solution', label: 'Solution', rows: 4 },
        { kind: 'textarea', name: 'impact', label: 'Impact', rows: 4 },
        { kind: 'tags', name: 'images', label: 'Images', item: 'url', placeholder: 'https://' },
        { kind: 'url', name: 'liveLink', label: 'Live link', required: true, placeholder: 'https://' },
        { kind: 'url', name: 'sourceLink', label: 'Source link', required: true, placeholder: 'https://' },
        { kind: 'text', name: 'category', label: 'Category' },
        { kind: 'text', name: 'tags', label: 'Tags' },
        { kind: 'json', name: 'metrics', label: 'Metrics', defaultValue: '[]', rows: 4 },
        { kind: 'multiselect', name: 'stack', label: 'Stack', source: 'stack' },
    ],
};

const experience: AdminEntity = {
    id: 'experience',
    label: 'Experience',
    singular: 'experience',
    description: 'Roles, companies, and the dates they cover.',
    icon: Briefcase,
    columns: [
        { key: 'role', label: 'Role' },
        { key: 'company', label: 'Company' },
        { key: 'startDate', label: 'Start' },
        { key: 'endDate', label: 'End' },
        { key: 'location', label: 'Location' },
    ],
    fields: [
        { kind: 'text', name: 'role', label: 'Role', required: true },
        { kind: 'text', name: 'company', label: 'Company', required: true },
        { kind: 'date', name: 'startDate', label: 'Start date', required: true },
        { kind: 'date', name: 'endDate', label: 'End date' },
        { kind: 'text', name: 'duration', label: 'Duration', required: true, placeholder: '2 yrs' },
        { kind: 'text', name: 'location', label: 'Location' },
        { kind: 'textarea', name: 'description', label: 'Description', required: true, rows: 4 },
        { kind: 'tags', name: 'responsibilities', label: 'Responsibilities' },
        { kind: 'json', name: 'achievements', label: 'Achievements', defaultValue: '[]', rows: 4 },
        { kind: 'json', name: 'technologies', label: 'Technologies', defaultValue: '[]', rows: 4 },
    ],
};

const education: AdminEntity = {
    id: 'education',
    label: 'Education',
    singular: 'education',
    description: 'Schools, degrees, and enrollment dates.',
    icon: GraduationCap,
    columns: [
        { key: 'institution', label: 'Institution' },
        { key: 'degree', label: 'Degree' },
        { key: 'startDate', label: 'Start' },
        { key: 'endDate', label: 'End' },
    ],
    fields: [
        { kind: 'text', name: 'institution', label: 'Institution', required: true },
        { kind: 'text', name: 'degree', label: 'Degree', required: true },
        { kind: 'date', name: 'startDate', label: 'Start date', required: true },
        { kind: 'date', name: 'endDate', label: 'End date' },
    ],
};

const certification: AdminEntity = {
    id: 'certifications',
    label: 'Certifications',
    singular: 'certification',
    description: 'Credentials, who issued them, and the proof link.',
    icon: Award,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'issuer', label: 'Issuer' },
        { key: 'completedDate', label: 'Completed' },
        { key: 'url', label: 'URL' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'text', name: 'issuer', label: 'Issuer', required: true },
        { kind: 'date', name: 'completedDate', label: 'Completed', required: true },
        { kind: 'url', name: 'url', label: 'URL', required: true, placeholder: 'https://' },
    ],
};

const reference: AdminEntity = {
    id: 'references',
    label: 'References',
    singular: 'reference',
    description: 'People who can speak to the work.',
    icon: Quote,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'company', label: 'Company' },
        { key: 'email', label: 'Email' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'text', name: 'role', label: 'Role', required: true },
        { kind: 'text', name: 'company', label: 'Company', required: true },
        { kind: 'email', name: 'email', label: 'Email', required: true },
    ],
};

const skill: AdminEntity = {
    id: 'skills',
    label: 'Skills',
    singular: 'skill',
    description: 'Named skills, grouped by category.',
    icon: Wrench,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Categories' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'multiselect', name: 'category', label: 'Categories', source: 'skill-categories' },
    ],
};

const skillCategory: AdminEntity = {
    id: 'skill-categories',
    label: 'Skill categories',
    singular: 'skill category',
    description: 'Groups that skills belong to.',
    icon: Layers,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'skills', label: 'Skills' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'multiselect', name: 'skills', label: 'Skills', source: 'skills' },
    ],
};

const stack: AdminEntity = {
    id: 'stack',
    label: 'Stack',
    singular: 'stack',
    description: 'Tools shared across projects.',
    icon: Boxes,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'icon', label: 'Icon' },
        { key: 'project', label: 'Projects' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'textarea', name: 'icon', label: 'Icon', rows: 3, placeholder: 'Icon name, URL, or SVG' },
        { kind: 'multiselect', name: 'project', label: 'Projects', source: 'projects' },
    ],
};

const post: AdminEntity = {
    id: 'posts',
    label: 'Posts',
    singular: 'post',
    description: 'Blog posts, their authors, tags, and comments.',
    icon: FileText,
    columns: [
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'category', label: 'Category' },
        { key: 'views', label: 'Views' },
        { key: 'user_id', label: 'Author' },
    ],
    fields: [
        { kind: 'text', name: 'title', label: 'Title', required: true },
        { kind: 'slug', name: 'slug', label: 'Slug', required: true, placeholder: 'post-title' },
        { kind: 'text', name: 'category', label: 'Category' },
        { kind: 'textarea', name: 'excerpt', label: 'Excerpt', rows: 3 },
        { kind: 'textarea', name: 'content', label: 'Content', required: true, rows: 8 },
        { kind: 'url', name: 'thumbnail', label: 'Thumbnail', required: true, placeholder: 'https://' },
        { kind: 'number', name: 'views', label: 'Views', defaultValue: '0' },
        { kind: 'select', name: 'user_id', label: 'Author', required: true, source: 'users' },
        { kind: 'multiselect', name: 'tags', label: 'Tags', source: 'tags' },
    ],
};

const tag: AdminEntity = {
    id: 'tags',
    label: 'Tags',
    singular: 'tag',
    description: 'Labels attached to posts.',
    icon: Hash,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'posts', label: 'Posts' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'multiselect', name: 'posts', label: 'Posts', source: 'posts' },
    ],
};

const comment: AdminEntity = {
    id: 'comments',
    label: 'Comments',
    singular: 'comment',
    description: 'Replies left on posts.',
    icon: MessageSquare,
    columns: [
        { key: 'content', label: 'Content' },
        { key: 'postId', label: 'Post' },
        { key: 'userId', label: 'Author' },
        { key: 'upvotes', label: 'Upvotes' },
    ],
    fields: [
        { kind: 'textarea', name: 'content', label: 'Content', required: true, rows: 4 },
        { kind: 'select', name: 'postId', label: 'Post', required: true, source: 'posts' },
        { kind: 'select', name: 'userId', label: 'Author', required: true, source: 'users' },
        { kind: 'number', name: 'upvotes', label: 'Upvotes', defaultValue: '0' },
        { kind: 'number', name: 'downvotes', label: 'Downvotes', defaultValue: '0' },
    ],
};

const reaction: AdminEntity = {
    id: 'reactions',
    label: 'Reactions',
    singular: 'reaction',
    description: 'How readers marked a post.',
    icon: SmilePlus,
    columns: [
        { key: 'reaction', label: 'Reaction' },
        { key: 'postId', label: 'Post' },
        { key: 'userId', label: 'User' },
    ],
    fields: [
        { kind: 'select', name: 'reaction', label: 'Reaction', required: true, options: reactionOptions, defaultValue: 'insightful' },
        { kind: 'select', name: 'postId', label: 'Post', required: true, source: 'posts' },
        { kind: 'select', name: 'userId', label: 'User', required: true, source: 'users' },
    ],
};

const user: AdminEntity = {
    id: 'users',
    label: 'Users',
    singular: 'user',
    description: 'Accounts that can sign in and publish.',
    icon: Users,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'emailVerified', label: 'Verified' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true },
        { kind: 'email', name: 'email', label: 'Email', required: true },
        { kind: 'tel', name: 'phone', label: 'Phone', placeholder: '+880…' },
        { kind: 'url', name: 'avatar', label: 'Avatar', placeholder: 'https://' },
        { kind: 'textarea', name: 'bio', label: 'Bio', rows: 4 },
        { kind: 'boolean', name: 'emailVerified', label: 'Email verified', defaultValue: false },
        { kind: 'url', name: 'image', label: 'Image', placeholder: 'https://' },
    ],
};

const session: AdminEntity = {
    id: 'sessions',
    label: 'Sessions',
    singular: 'session',
    description: 'Active sign-ins and when they expire.',
    icon: MonitorSmartphone,
    columns: [
        { key: 'userId', label: 'User' },
        { key: 'expiresAt', label: 'Expires' },
        { key: 'ipAddress', label: 'IP address' },
    ],
    fields: [
        { kind: 'select', name: 'userId', label: 'User', required: true, source: 'users' },
        { kind: 'datetime', name: 'expiresAt', label: 'Expires', required: true },
        { kind: 'password', name: 'token', label: 'Token', required: true },
        { kind: 'text', name: 'ipAddress', label: 'IP address' },
        { kind: 'textarea', name: 'userAgent', label: 'User agent', rows: 3 },
    ],
};

const account: AdminEntity = {
    id: 'accounts',
    label: 'Accounts',
    singular: 'account',
    description: 'Login providers linked to a user.',
    icon: KeyRound,
    columns: [
        { key: 'userId', label: 'User' },
        { key: 'providerId', label: 'Provider' },
    ],
    fields: [
        { kind: 'select', name: 'userId', label: 'User', required: true, source: 'users' },
        { kind: 'text', name: 'accountId', label: 'Account id', required: true },
        { kind: 'text', name: 'providerId', label: 'Provider', required: true, placeholder: 'credential' },
        { kind: 'password', name: 'password', label: 'Password' },
        { kind: 'text', name: 'scope', label: 'Scope' },
        { kind: 'password', name: 'accessToken', label: 'Access token' },
        { kind: 'password', name: 'refreshToken', label: 'Refresh token' },
        { kind: 'password', name: 'idToken', label: 'ID token' },
        { kind: 'datetime', name: 'accessTokenExpiresAt', label: 'Access token expires' },
        { kind: 'datetime', name: 'refreshTokenExpiresAt', label: 'Refresh token expires' },
    ],
};

const passkey: AdminEntity = {
    id: 'passkeys',
    label: 'Passkeys',
    singular: 'passkey',
    description: 'Device credentials registered for sign-in.',
    icon: Fingerprint,
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'deviceType', label: 'Device' },
        { key: 'userId', label: 'User' },
    ],
    fields: [
        { kind: 'text', name: 'name', label: 'Name' },
        { kind: 'select', name: 'userId', label: 'User', required: true, source: 'users' },
        { kind: 'textarea', name: 'publicKey', label: 'Public key', required: true, rows: 4 },
        { kind: 'text', name: 'credentialID', label: 'Credential ID', required: true },
        { kind: 'number', name: 'counter', label: 'Counter', required: true, defaultValue: '0' },
        { kind: 'text', name: 'deviceType', label: 'Device type', required: true },
        { kind: 'boolean', name: 'backedUp', label: 'Backed up', defaultValue: false },
        { kind: 'text', name: 'transports', label: 'Transports' },
        { kind: 'text', name: 'aaguid', label: 'AAGUID' },
    ],
};

export const navGroups: { id: string; label: string; items: AdminEntity[] }[] = [
    {
        id: 'portfolio',
        label: 'Portfolio',
        items: [project, experience, education, certification, reference, skill, skillCategory, stack],
    },
    {
        id: 'writing',
        label: 'Writing',
        items: [post, tag, comment, reaction],
    },
    {
        id: 'access',
        label: 'Access',
        items: [user, session, account, passkey],
    },
];

export const entities = navGroups.flatMap((group) => group.items);

export function emptyValues(entity: AdminEntity): FormValues {
    const values: FormValues = {};
    for (const field of entity.fields) {
        if (field.kind === 'boolean') values[field.name] = field.defaultValue ?? false;
        else if (field.kind === 'tags' || field.kind === 'multiselect') values[field.name] = [];
        else if (field.kind === 'number') values[field.name] = field.defaultValue ?? '';
        else if (field.kind === 'json') values[field.name] = field.defaultValue ?? '';
        else if (field.kind === 'select') values[field.name] = field.defaultValue ?? '';
        else values[field.name] = '';
    }
    return values;
}

function requiredText(label: string) {
    return z.string().min(1, `${label} is required`);
}

function optionalUrl(label: string) {
    return z.string().refine((value) => value === '' || z.string().url().safeParse(value).success, {
        message: `${label} needs a full URL starting with https://`,
    });
}

function fieldSchema(field: Field): z.ZodType {
    switch (field.kind) {
        case 'text':
        case 'textarea':
        case 'password':
            return field.required ? requiredText(field.label) : z.string();
        case 'slug':
            return requiredText('Slug').refine((value) => !/\s/.test(value), 'Slug cannot contain spaces');
        case 'email':
            return field.required
                ? requiredText(field.label).email('Enter a valid email')
                : z.string().refine((value) => value === '' || z.string().email().safeParse(value).success, 'Enter a valid email');
        case 'url':
            return field.required
                ? requiredText(field.label).url(`${field.label} needs a full URL starting with https://`)
                : optionalUrl(field.label);
        case 'tel':
            return z
                .string()
                .max(17, 'Use 17 characters or fewer')
                .refine((value) => !field.required || value.length > 0, `${field.label} is required`);
        case 'number':
            return z.string().refine((value) => {
                if (value.trim() === '') return !field.required;
                return Number.isFinite(Number(value));
            }, 'Enter a number');
        case 'boolean':
            return z.boolean();
        case 'date':
        case 'datetime':
            return field.required ? requiredText(field.label) : z.string();
        case 'tags':
            return field.item === 'url'
                ? z.array(z.string().url('Each image needs a full URL starting with https://'))
                : z.array(z.string().min(1));
        case 'json':
            return z.string().superRefine((value, ctx) => {
                if (!value.trim()) {
                    if (field.required) {
                        ctx.addIssue({ code: 'custom', message: `${field.label} is required` });
                    }
                    return;
                }
                try {
                    JSON.parse(value);
                } catch {
                    ctx.addIssue({ code: 'custom', message: 'Enter valid JSON' });
                }
            });
        case 'select':
            return field.required ? requiredText(field.label) : z.string();
        case 'multiselect':
            return field.required ? z.array(z.string()).min(1, `${field.label} is required`) : z.array(z.string());
    }
}

function normalize(entity: AdminEntity, values: FormValues): FormValues {
    const next: FormValues = { ...emptyValues(entity), ...values };
    for (const field of entity.fields) {
        const value = next[field.name];
        if (typeof value === 'string' && field.kind !== 'password') {
            next[field.name] = value.trim();
        }
    }
    return next;
}

function toPayload(entity: AdminEntity, values: FormValues): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    for (const field of entity.fields) {
        const value = values[field.name];
        if (field.kind === 'number') {
            payload[field.name] = typeof value === 'string' && value !== '' ? Number(value) : null;
            continue;
        }
        if (field.kind === 'json') {
            payload[field.name] = typeof value === 'string' && value !== '' ? JSON.parse(value) : null;
            continue;
        }
        if (typeof value === 'string') {
            payload[field.name] = value === '' ? null : value;
            continue;
        }
        payload[field.name] = value;
    }
    return payload;
}

export function validateEntity(entity: AdminEntity, values: FormValues):
    | { ok: true; values: FormValues; payload: Record<string, unknown> }
    | { ok: false; errors: Record<string, string> } {
    const normalized = normalize(entity, values);
    const shape: Record<string, z.ZodType> = {};
    for (const field of entity.fields) shape[field.name] = fieldSchema(field);
    const result = z.object(shape).safeParse(normalized);
    if (!result.success) {
        const errors: Record<string, string> = {};
        for (const issue of result.error.issues) {
            const key = String(issue.path[0] ?? '');
            if (key && !errors[key]) errors[key] = issue.message;
        }
        return { ok: false, errors };
    }
    return { ok: true, values: normalized, payload: toPayload(entity, normalized) };
}

export function draftLabel(values: FormValues): string {
    for (const key of ['name', 'title', 'email', 'role', 'institution', 'providerId']) {
        const value = values[key];
        if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return 'Untitled';
}

export function fieldOptions(field: Field, optionsBySource: Record<string, Option[]>): Option[] {
    if (field.kind === 'select') return field.options ?? (field.source ? optionsBySource[field.source] ?? [] : []);
    if (field.kind === 'multiselect') return optionsBySource[field.source] ?? [];
    return [];
}

export function displayValue(field: Field | undefined, value: FormValues[string] | undefined, options: Option[]): string {
    if (field?.kind === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) {
        return value.map((item) => options.find((option) => option.value === item)?.label ?? item).join(', ');
    }
    if (typeof value !== 'string' || value === '') return '';
    if (field?.kind === 'select') return options.find((option) => option.value === value)?.label ?? value;
    if (field?.kind === 'password') return '••••••';
    return value;
}
