const form = document.querySelector('#settingsForm');
const status = document.querySelector('#formStatus');
const draftKey = 'company-site-admin-draft';
const config = window.siteConfig ?? {};
const fields = [...form.elements].filter((field) => field.name);

const readForm = () => Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
const loadValues = (values) => {
  fields.forEach((field) => {
    if (Object.hasOwn(values, field.name)) field.value = values[field.name] ?? '';
  });
};

loadValues(config);
try {
  const savedDraft = JSON.parse(localStorage.getItem(draftKey) || 'null');
  if (savedDraft) loadValues(savedDraft);
} catch {
  status.textContent = 'Черновик недоступен. Вы можете заполнить поля и скачать настройки.';
}

form.addEventListener('input', () => {
  try {
    localStorage.setItem(draftKey, JSON.stringify(readForm()));
    status.textContent = 'Черновик сохранён в этом браузере. Скачайте файл, чтобы подготовить публикацию.';
  } catch {
    status.textContent = 'Черновик не сохранён, но скачать настройки всё ещё можно.';
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const output = `// Публичные данные компании для сайта.\nwindow.siteConfig = ${JSON.stringify(readForm(), null, 2)};\n`;
  const file = new Blob([output], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'site-config.js';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Файл скачан. Загрузите его в папку js сайта, заменив старый site-config.js.';
});

form.addEventListener('reset', () => {
  try {
    localStorage.removeItem(draftKey);
  } catch {
    // Браузер может запрещать локальное хранилище.
  }
  window.setTimeout(() => {
    loadValues(config);
    status.textContent = 'Показаны исходные настройки сайта.';
  }, 0);
});
