import { addButton } from "./utils/addButton.js";

if (!window.__buttonsInjected) {
  window.__buttonsInjected = true;

  document.querySelectorAll("img").forEach(addButton);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.querySelectorAll("img").forEach(addButton);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
