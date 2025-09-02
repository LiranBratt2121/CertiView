import { NextResponse } from "next/server";
import { upload } from "./utils";

export async function POST(request: Request) {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

    try {
        const { insertResult, phash } = await upload(image, uri);
        return NextResponse.json({
            message: "Image uploaded!",
            filename: image.name,
            phash: phash,   // expose phash to client
            id: insertResult.insertedId, // expose MongoDB ID
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}

export async function GET(_: Request) {
    return NextResponse.json({ message: "YESSIR" }, { status: 200 });
}