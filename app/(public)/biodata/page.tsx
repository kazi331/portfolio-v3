import { BiodataDocument } from "@/components/biodata/BiodataDocument";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Biodata",
    description: "Personal, educational, professional, and family profile of Kazi Shariful Islam.",
};

export default async function BiodataPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
    const { edit } = await searchParams;
    return <BiodataDocument editable={edit === "true"} />;
}
