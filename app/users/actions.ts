"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addUser(_: any, formData: FormData) {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const avatar = formData.get("avatar") as string

    const user = await prisma.user.create({
        data: {
            email,
            name,
            phone,
            avatar
        }
    })
    revalidatePath("/users")
    return user
}

export async function deleteUser(id: string) {
    await prisma.user.delete({
        where: { id }
    })
    revalidatePath("/users")
}

export async function deleteAll() {
    await prisma.user.deleteMany()
    revalidatePath("/users")
}