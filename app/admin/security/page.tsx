'use client';

import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { Fingerprint, Key, Lock, ShieldCheck, Smartphone, Terminal } from 'lucide-react';
import React, { useState } from 'react';

interface SecuritySession {
  id: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  status: 'Active' | 'Expired';
  lastActive: string;
}

const initialSessions: SecuritySession[] = [
  {
    id: '1',
    ipAddress: '103.145.132.8',
    userAgent: 'Chrome 128 (macOS Sonoma)',
    deviceType: 'MacBook Pro (Apple Silicon)',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: '2',
    ipAddress: '103.145.132.8',
    userAgent: 'Mobile Safari 18 (iOS)',
    deviceType: 'iPhone 15 Pro',
    status: 'Active',
    lastActive: '2 hours ago',
  },
];

export default function AdminSecurityPage() {
  const [sessions, setSessions] = useState<SecuritySession[]>(initialSessions);

  const columns: Column<SecuritySession>[] = [
    {
      header: 'Device & Client',
      accessorKey: 'deviceType',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white">{item.deviceType}</span>
          <span className="font-mono text-[10px] text-muted-text">{item.userAgent}</span>
        </div>
      ),
    },
    {
      header: 'IP Address',
      accessorKey: 'ipAddress',
      cell: (item) => (
        <span className="font-mono text-xs text-accent-secondary">{item.ipAddress}</span>
      ),
    },
    {
      header: 'Session Status',
      accessorKey: 'status',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 rounded-[4px_1px_4px_1px] px-2 py-0.5 font-mono text-[10px] ${
            item.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-white/5 text-muted-text border border-white/10'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {item.status}
        </span>
      ),
    },
    {
      header: 'Last Active',
      accessorKey: 'lastActive',
      cell: (item) => (
        <span className="font-mono text-[11px] text-muted-text">{item.lastActive}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Security, Passkeys & Session Registry"
        description="Inspect authenticated sessions, Better-Auth WebAuthn passkeys, hardware tokens, and verification records mapped to @Session, @Passkey, @Account, and @Verification."
        model="Session, Passkey, Account, Verification"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Active Sessions"
          value={sessions.filter((s) => s.status === 'Active').length}
          icon={Terminal}
          color="text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
        />
        <AdminStatCard
          label="Registered Passkeys"
          value="1 Active"
          icon={Fingerprint}
          color="text-accent border-accent/20 bg-accent/10"
        />
        <AdminStatCard
          label="Auth Engine"
          value="Better-Auth v1.7"
          icon={ShieldCheck}
          color="text-blue-400 border-blue-500/20 bg-blue-500/10"
        />
      </div>

      <div className="rounded-[12px_3px_12px_3px] border border-white/10 bg-[#0F131C] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-accent" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Hardware WebAuthn Passkeys
            </h3>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">FIDO2 / Touch ID Enabled</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-[8px_2px_8px_2px] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <Key className="h-4 w-4 text-accent" />
            <div>
              <div className="font-semibold text-xs text-white">Touch ID / iCloud Keychain</div>
              <div className="font-mono text-[10px] text-muted-text">Credential ID: cred_8f910a3... • Synced across Apple devices</div>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-[4px_1px_4px_1px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Primary Key
          </span>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={sessions}
        searchKey="deviceType"
        searchPlaceholder="Search active sessions..."
        onDelete={(item) => {
          setSessions((prev) => prev.filter((s) => s.id !== item.id));
        }}
      />
    </div>
  );
}
