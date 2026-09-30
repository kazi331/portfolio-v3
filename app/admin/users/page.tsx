'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { CheckCircle2, Key, Mail, Shield, UserCheck, Users, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor' | 'Member';
  emailVerified: boolean;
  hasPasskey: boolean;
  createdAt: string;
}

const initialUsers: UserRecord[] = [
  {
    id: '1',
    name: 'Kazi Shariful Islam',
    email: 'kazisharif.dev@gmail.com',
    role: 'Super Admin',
    emailVerified: true,
    hasPasskey: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Collaborator Admin',
    email: 'admin@kazisharif.dev',
    role: 'Admin',
    emailVerified: true,
    hasPasskey: false,
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    name: 'Technical Editor',
    email: 'editor@devsnest.net',
    role: 'Editor',
    emailVerified: true,
    hasPasskey: false,
    createdAt: '2024-04-15',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);

  const columns: Column<UserRecord>[] = [
    {
      header: 'User Profile',
      accessorKey: 'name',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-accent-secondary font-mono text-xs font-bold text-black">
            {item.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white">{item.name}</span>
            <span className="font-mono text-[10px] text-muted-text">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role / Access',
      accessorKey: 'role',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] px-2 py-0.5 font-mono text-[10px] ${
            item.role === 'Super Admin'
              ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
              : item.role === 'Admin'
              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              : 'bg-white/5 text-muted-text border border-white/10'
          }`}
        >
          <Shield className="h-2.5 w-2.5" /> {item.role}
        </span>
      ),
    },
    {
      header: 'Email Verified',
      accessorKey: 'emailVerified',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 font-mono text-[10px] ${
            item.emailVerified ? 'text-emerald-400' : 'text-amber-400'
          }`}
        >
          {item.emailVerified ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {item.emailVerified ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Passkey Auth',
      accessorKey: 'hasPasskey',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 font-mono text-[10px] ${
            item.hasPasskey ? 'text-emerald-400' : 'text-muted-text'
          }`}
        >
          <Key className="h-3 w-3" />
          {item.hasPasskey ? 'Configured' : 'None'}
        </span>
      ),
    },
    {
      header: 'Registered',
      accessorKey: 'createdAt',
      cell: (item) => (
        <span className="font-mono text-[10px] text-muted-text">{item.createdAt}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users & Identity Management"
        description="Manage user accounts, roles, verified credentials, and linked auth profiles mapped to the @User model."
        model="User"
        actionLabel="Invite User"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Users"
          value={users.length}
          icon={Users}
          color="text-green-400 border-green-500/20 bg-green-500/10"
        />
        <AdminStatCard
          label="Super Admins"
          value={users.filter((u) => u.role === 'Super Admin').length}
          icon={Shield}
          color="text-accent border-accent/20 bg-accent/10"
        />
        <AdminStatCard
          label="Passkeys Enabled"
          value={users.filter((u) => u.hasPasskey).length}
          icon={Key}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
      </div>

      <AdminDataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users by name or email..."
        onDelete={(item) => {
          setUsers((prev) => prev.filter((u) => u.id !== item.id));
        }}
      />
    </div>
  );
}
