import { getApiKey, setApiKey } from './storage';

function showFeedback(type: 'success' | 'error', message: string): void {
  const el = document.getElementById('feedback');
  if (!el) return;
  el.textContent = message;
  el.className = `feedback ${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  const input = document.getElementById('api-key-input') as HTMLInputElement | null;
  const saveBtn = document.getElementById('btn-save');

  const existingKey = await getApiKey();
  if (existingKey && input) {
    input.value = existingKey;
  }

  saveBtn?.addEventListener('click', async () => {
    const key = input?.value.trim() ?? '';
    if (!key) {
      showFeedback('error', 'Please enter an API key.');
      return;
    }
    try {
      await setApiKey(key);
      showFeedback('success', 'Saved!');
    } catch {
      showFeedback('error', 'Failed to save. Please try again.');
    }
  });
});
