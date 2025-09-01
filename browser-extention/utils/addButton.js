import { isValidImage } from "../api/isValidImage.js";

export function addButton(img, minWidth = 20, minHeight = 20) {
  if (img.__buttonInjected) return;
  if (!img) return;

  img.__buttonInjected = true;

  if (img.clientWidth < minWidth || img.clientHeight < minHeight) {
    return;
  }

  const btn = create("button");

  btn.addEventListener("click", async () => {
    btn.textContent = "Checking...";
    const valid = await isValidImage(img);
    btn.textContent = valid ? "✅ Valid Image" : "❌ Not Valid";
  });

  img.insertAdjacentElement("afterend", btn);
}

function create(id) {
  const btn = document.createElement(id);
  btn.textContent = "Show Image Src";
  btn.style.display = "block";
  btn.style.marginTop = "5px";
  btn.style.padding = "5px 10px";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "9999";
  btn.style.position = "relative";
  btn.style.backgroundColor = "yellow";
  btn.style.color = "black";
  btn.style.border = "1px solid black";
  btn.style.fontSize = "12px";

  return btn;
}
