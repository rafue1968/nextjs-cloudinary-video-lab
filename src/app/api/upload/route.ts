// import cloudinary from "../../../../lib/cloudinary";
// import { NextResponse } from "next/server";

// export async function POST(req: Request){
//     const { video } = await req.json();

//     const uploadResponse = await cloudinary.uploader.upload(video, {
//         folder: "video-showcase",
//         resource_type: "video",
//     });

//     return NextResponse.json(uploadResponse);
// }