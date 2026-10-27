import { BiodataDocument } from "@/components/biodata/BiodataDocument";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biodata",
  description: "Personal, educational, professional, and family profile of Kazi Shariful Islam.",
};

export default function BiodataPage() {
  return <BiodataDocument />;
}
