// IndexedDB-based media storage — no size limits for images and videos

const DB_NAME = "tpp_media_db";
const DB_VERSION = 1;
const GALLERY_STORE = "gallery";
const VIDEO_STORE = "videos";

export interface GalleryRecord {
  id: string;
  title: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
}

export interface VideoRecord {
  id: string;
  title: string;
  description: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(GALLERY_STORE)) {
        db.createObjectStore(GALLERY_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
): IDBObjectStore {
  return db.transaction(storeName, mode).objectStore(storeName);
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export const galleryDb = {
  async add(title: string, file: File): Promise<GalleryRecord> {
    const db = await openDb();
    const record: GalleryRecord = {
      id: crypto.randomUUID(),
      title,
      blob: file,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    };
    await request(tx(db, GALLERY_STORE, "readwrite").add(record));
    db.close();
    return record;
  },

  async getAll(): Promise<GalleryRecord[]> {
    const db = await openDb();
    const records = await request<GalleryRecord[]>(
      tx(db, GALLERY_STORE, "readonly").getAll(),
    );
    db.close();
    return records.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async delete(id: string): Promise<void> {
    const db = await openDb();
    await request(tx(db, GALLERY_STORE, "readwrite").delete(id));
    db.close();
  },
};

// ── Videos ───────────────────────────────────────────────────────────────────

export const videoDb = {
  async add(
    id: string,
    title: string,
    description: string,
    file: File,
  ): Promise<VideoRecord> {
    const db = await openDb();
    const record: VideoRecord = {
      id,
      title,
      description,
      blob: file,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    };
    await request(tx(db, VIDEO_STORE, "readwrite").add(record));
    db.close();
    return record;
  },

  async getById(id: string): Promise<VideoRecord | undefined> {
    const db = await openDb();
    const record = await request<VideoRecord>(
      tx(db, VIDEO_STORE, "readonly").get(id),
    );
    db.close();
    return record;
  },

  async getAll(): Promise<VideoRecord[]> {
    const db = await openDb();
    const records = await request<VideoRecord[]>(
      tx(db, VIDEO_STORE, "readonly").getAll(),
    );
    db.close();
    return records.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async delete(id: string): Promise<void> {
    const db = await openDb();
    await request(tx(db, VIDEO_STORE, "readwrite").delete(id));
    db.close();
  },
};
