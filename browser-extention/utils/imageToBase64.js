export function imageToBase64(imgElement) {
  return new Promise((resolve, reject) => {
    try {
      if (!imgElement.complete) {
        imgElement.onload = () => resolve(imageToBase64(imgElement));
        imgElement.onerror = reject;
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;

      ctx.drawImage(imgElement, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    } catch (err) {
      reject(err);
    }
  });
}
