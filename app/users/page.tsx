import AddUserForm, { DeleteAll, UserList } from "@/app/users/AddUser";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    let users: User[] = [];
    try {
        users = await prisma.user.findMany({});
    } catch {
        users = [];
    }

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Prisma users</h2>
            <UserList users={users} />
            {users.length > 0 && <DeleteAll />}
            <AddUserForm />
        </div>
    );
}
