import AddUserForm, { DeleteAll, UserList } from "@/app/users/AddUser"
import { User } from "@/generated/prisma/browser"
import { prisma } from "@/lib/prisma"

export default async function name() {
    const users = await prisma.user.findMany({})

    return <div>
        <h2>Prisma users</h2>
        <UserList users={users as User[]} />
        {users.length > 0 && <DeleteAll />}
        <AddUserForm />
    </div>
}