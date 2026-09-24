"use client"
import { addUser, deleteAll, deleteUser } from "@/app/users/actions"
import { User } from "@/generated/prisma/browser"
import { useState } from "react"

export default function AddUserForm() {
    const [isAdding, setIsAdding] = useState(false)
    const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        setIsAdding(true)
        await addUser(undefined, formData)
        setIsAdding(false)
    }
    return (<form
        className="flex flex-col gap-2 max-w-md mx-auto mt-10"
        onSubmit={handleAddUser}>
        <input className="border border-gray-300 rounded-md p-2" required type="text" name="name" placeholder="Name" />
        <input className="border border-gray-300 rounded-md p-2" required type="email" name="email" placeholder="Email" />
        <button disabled={isAdding} className="bg-blue-500 text-white rounded-md p-2" type="submit">{isAdding ? "Adding..." : "Add user"}</button>
    </form>)

}

export function UserList({ users }: { users: User[] }) {
    return <div className="flex flex-col gap-2 max-w-md mx-auto">
        {
            users.map((user: User) => (
                <div key={user.id} className="border border-gray-800 rounded-md p-2">
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <DeleteUserButton id={user.id} />
                </div>
            ))
        }
    </div>
}

export function DeleteUserButton({ id }: { id: number }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const handleDeleteUser = async () => {
        setIsDeleting(true)
        await deleteUser(id)
        setIsDeleting(false)
    }
    return <button disabled={isDeleting} className="bg-red-500 text-white rounded-none p-1" onClick={handleDeleteUser}>{isDeleting ? "Deleting..." : "Delete"}</button>
}

export function DeleteAll() {
    const [isDeleting, setIsDeleting] = useState(false)
    const handleDeleteAll = async () => {
        setIsDeleting(true)
        await deleteAll()
        setIsDeleting(false)
    }
    return <button disabled={isDeleting} className="bg-red-500 text-white rounded-none p-1" onClick={handleDeleteAll}>{isDeleting ? "Deleting..." : "Delete All"}</button>
}