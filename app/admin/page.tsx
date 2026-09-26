'use client';
import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);


    const checkAuth = useCallback(async () => {
        const response = await authClient.getSession();
        if (!response.data?.user) {
            router.push('/admin/login');
        }
        setUser(response.data?.user as User);
    }, [router]);


    useEffect(() => {
        checkAuth();
    }, [checkAuth]);


    return (
        <div className="relative mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-16">
            <div className="radius-card w-full border border-white/10 bg-surface-raised p-8 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.85)]">
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user?.name}!</p>
                <p>Email: {user?.email}</p>
                <button onClick={async () => {
                    await authClient.signOut();
                    router.push('/admin/login');
                }}>Sign Out</button>
            </div>
        </div>
    )
}