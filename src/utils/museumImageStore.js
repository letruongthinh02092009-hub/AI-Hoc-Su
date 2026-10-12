import { get, set, del, entries } from 'idb-keyval';

const KEY_PREFIX = 'museum-img-';

export async function getImage(id) {
  try {
    return await get(`${KEY_PREFIX}${id}`);
  } catch (err) {
    console.warn('IndexedDB getImage failed:', err);
    return null;
  }
}

export async function getAllImages() {
  try {
    const allEntries = await entries();
    const result = {};
    for (const [key, val] of allEntries) {
      if (typeof key === 'string' && key.startsWith(KEY_PREFIX)) {
        result[key.replace(KEY_PREFIX, '')] = val;
      }
    }
    return result;
  } catch (err) {
    console.warn('IndexedDB getAllImages failed:', err);
    return {};
  }
}

export async function saveImage(id, base64) {
  try {
    await set(`${KEY_PREFIX}${id}`, base64);
    return { ok: true };
  } catch (err) {
    console.warn('IndexedDB saveImage failed (likely private mode):', err);
    return { ok: false, reason: 'idb-blocked' };
  }
}

export async function deleteImage(id) {
  try {
    await del(`${KEY_PREFIX}${id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: 'idb-blocked' };
  }
}

// Migration tự động từ localStorage cũ sang IndexedDB
export async function migrateFromLocalStorage() {
  const LEGACY_KEY = 'su_custom_museum_images';
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy) return { migrated: 0 };
    
    let parsed = {};
    try {
      parsed = JSON.parse(legacy);
    } catch {
      localStorage.removeItem(LEGACY_KEY);
      return { migrated: 0 };
    }

    let count = 0;
    for (const [id, base64] of Object.entries(parsed)) {
      if (typeof base64 === 'string') {
        const result = await saveImage(id, base64);
        if (result.ok) count++;
      }
    }
    localStorage.removeItem(LEGACY_KEY);
    console.log(`[museumStore] Migrated ${count} images to IndexedDB`);
    return { migrated: count };
  } catch (err) {
    console.error('Lỗi khi migrate LocalStorage:', err);
    localStorage.removeItem(LEGACY_KEY);
    return { migrated: 0, error: err.message };
  }
}
