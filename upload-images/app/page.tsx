"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFile = event.target.files?.[0];
    if (!chosenFile) return;

    setFile(chosenFile);

    // Preview locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(chosenFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("⚠️ Please select an image first");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/mongo/uploadImage", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Uploaded: ${data.filename}`);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-600">
          Image Upload
        </h1>

        <div className="flex flex-col items-center gap-4">
          {/* File input */}
          <label className="w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
              <p className="text-sm text-gray-600">Click to select image</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {/* Preview */}
          {selectedImage && (
            <div className="relative w-full h-64">
              <Image
                src={selectedImage}
                alt="Uploaded preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}

          {/* Upload button */}
          {file && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload to Server"}
            </button>
          )}

          {/* Status */}
          {status && <p className="text-sm mt-2 text-gray-700">{status}</p>}
        </div>
      </div>
    </div>
  );
}
