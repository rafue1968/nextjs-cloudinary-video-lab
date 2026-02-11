import cloudinary from "../../../../lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
  const results = await cloudinary.search
    .expression("folder:video-showcase")
    .sort_by("created_at", "desc")
    .max_results(30)
    .execute();

  return NextResponse.json(results.resources);
}
