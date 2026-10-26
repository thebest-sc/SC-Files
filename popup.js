const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const copyName = document.getElementById("copyName");
let selectedFile = null;
fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
  if (!selectedFile) { fileInfo.classList.add("hidden"); copyName.disabled = true; return; }
  fileName.textContent = selectedFile.name;
  fileSize.textContent = formatBytes(selectedFile.size);
  fileInfo.classList.remove("hidden");
  copyName.disabled = false;
});
copyName.addEventListener("click", async () => {
  if (!selectedFile) return;
  try {
    await navigator.clipboard.writeText(selectedFile.name);
    copyName.textContent = "Kopyalandı ✓";
    setTimeout(() => { copyName.textContent = "Dosya adını kopyala"; }, 1300);
  } catch { copyName.textContent = "Kopyalanamadı"; }
});
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} bayt`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}