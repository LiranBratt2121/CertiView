import { imageToBase64 } from "../utils/imageToBase64.js";

export async function isValidImage(img) {
  if (!img || !img.src) return false;

  try {
    const base64 = await imageToBase64(img);

    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].match(/:(.*?);/)[1];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append("image", blob, "image.png");

    const response = await fetch("https://certi-view.vercel.app/api/mongo/sameImage", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("API request failed", response.status);
      return false;
    }

    const data = await response.json();
    return data.exists === true;
  } catch (err) {
    console.error("Error checking image:", err);
    return false;
  }
}
