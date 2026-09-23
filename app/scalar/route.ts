import { openApiDocument } from "@/lib/openapi";
import { checkAuth } from "@/lib/auth-utils";
import { ApiReference } from "@scalar/nextjs-api-reference";
import { NextResponse } from "next/server";

const renderReference = ApiReference(
  {
    content: openApiDocument,
    pageTitle: "Portfolio API",
    theme: "deepSpace",
    cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.71.0",
  },
  {
    headers: {
      "Cache-Control": "private, no-store",
    },
  },
);

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return renderReference();
}
