const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const uploadBtn = document.getElementById('uploadBtn');
const statusEl = document.getElementById('status');
const result = document.getElementById('result');
const linkOutput = document.getElementById('linkOutput');
const copyLink = document.getElementById('copyLink');
const copyComment = document.getElementById('copyComment');
let selectedFile = null;
let uploadedLink = '';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

fileInput.addEventListener('change', () => {
  selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
  uploadedLink = '';
  result.classList.add('hidden');
  if (!selectedFile) {
    fileInfo.classList.add('hidden');
    uploadBtn.disabled = true;
    statusEl.textContent = 'Henüz dosya seçilmedi.';
    return;
  }
  fileName.textContent = selectedFile.name;
  fileSize.textContent = formatBytes(selectedFile.size);
  fileInfo.classList.remove('hidden');
  uploadBtn.disabled = false;
  statusEl.textContent = 'Dosya seçildi. Yüklemek için düğmeye bas.';
});

uploadBtn.addEventListener('click', async () => {
  if (!selectedFile) return;
  uploadBtn.disabled = true;
  fileInput.disabled = true;
  result.classList.add('hidden');
  statusEl.textContent = 'Dosya yükleniyor… Bu işlem dosyanı üçüncü taraf hizmete gönderir.';
  try {
    const form = new FormData();
    form.append('file', selectedFile, selectedFile.name);
    const response = await fetch('https://0x0.st', { method: 'POST', body: form });
    const body = (await response.text()).trim();
    if (!response.ok) throw new Error(`Sunucu HTTP ${response.status} yanıtı verdi.`);
    if (!/^https:\/\/0x0\.st\/[A-Za-z0-9._/-]+$/.test(body)) {
      throw new Error(body || 'Sunucu geçerli bir bağlantı döndürmedi.');
    }
    uploadedLink = body;
    linkOutput.value = uploadedLink;
    result.classList.remove('hidden');
    statusEl.textContent = 'Dosya yüklendi. Bağlantıyı kopyalayıp Scratch yorumuna yapıştırabilirsin.';
  } catch (error) {
    statusEl.textContent = `Yükleme başarısız: ${error.message || 'Bağlantı kurulamadı.'} Hizmet geçici olarak kapalı olabilir; daha sonra tekrar dene.`;
  } finally {
    uploadBtn.disabled = !selectedFile;
    fileInput.disabled = false;
  }
});

copyLink.addEventListener('click', async () => {
  if (!uploadedLink) return;
  try {
    await navigator.clipboard.writeText(uploadedLink);
    statusEl.textContent = 'Bağlantı kopyalandı! Scratch yorumuna yapıştırabilirsin.';
  } catch {
    linkOutput.select();
    document.execCommand('copy');
    statusEl.textContent = 'Bağlantı kopyalandı!';
  }
});

copyComment.addEventListener('click', async () => {
  if (!uploadedLink || !selectedFile) return;
  const comment = `📁 ${selectedFile.name}\n${uploadedLink}`;
  try {
    await navigator.clipboard.writeText(comment);
    statusEl.textContent = 'Yorum metni kopyalandı! Scratch yorumuna yapıştırabilirsin.';
  } catch {
    linkOutput.value = comment;
    linkOutput.select();
    document.execCommand('copy');
    linkOutput.value = uploadedLink;
    statusEl.textContent = 'Yorum metni kopyalandı!';
  }
});
