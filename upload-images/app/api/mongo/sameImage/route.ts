import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { findSimilarImage } from "../utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

    const res = await findSimilarImage(file, uri, 5)

    if (!res.exists) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
