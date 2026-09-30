import fs from "fs";
import path from "path";
import { getFirestoreDb, hasFirebaseAdminConfig } from "./firebase-admin";
import { Item, roundToOneDecimal } from "./types";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "items.json");

function ensureLocalDataFile(): void {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DATA_FILE)) {
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function readLocalItems(): Item[] {
  ensureLocalDataFile();
  try {
    const raw = fs.readFileSync(LOCAL_DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalItems(items: Item[]): void {
  ensureLocalDataFile();
  fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function getAllItems(): Promise<Item[]> {
  if (hasFirebaseAdminConfig()) {
    const db = getFirestoreDb();
    const snapshot = await db.collection("items").orderBy("addedAt", "desc").get();
    const items: Item[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      items.push(doc.data() as Item);
    });
    return items;
  }

  // Fallback to local storage when Firebase Service Account is not yet added
  const items = readLocalItems();
  return items.sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
}

export async function getItemById(id: string): Promise<Item | null> {
  if (hasFirebaseAdminConfig()) {
    const db = getFirestoreDb();
    const docSnap = await db.collection("items").doc(id).get();
    if (!docSnap.exists) return null;
    return docSnap.data() as Item;
  }

  const items = readLocalItems();
  return items.find((i) => i.id === id) || null;
}

export async function createItem(newItem: Item): Promise<Item> {
  if (hasFirebaseAdminConfig()) {
    const db = getFirestoreDb();
    await db.collection("items").doc(newItem.id).set(newItem);
    return newItem;
  }

  const items = readLocalItems();
  const filtered = items.filter((i) => i.id !== newItem.id);
  filtered.unshift(newItem);
  writeLocalItems(filtered);
  return newItem;
}

export async function updateItem(
  id: string,
  updates: Partial<Pick<Item, "status" | "rating" | "updatedAt">>
): Promise<Item | null> {
  if (hasFirebaseAdminConfig()) {
    const db = getFirestoreDb();
    const docRef = db.collection("items").doc(id);
    await docRef.update(updates);
    const updatedSnap = await docRef.get();
    return updatedSnap.data() as Item;
  }

  const items = readLocalItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const current = items[index];
  const updatedItem: Item = {
    ...current,
    ...updates,
    rating:
      updates.rating !== undefined
        ? updates.rating !== null
          ? roundToOneDecimal(updates.rating)
          : null
        : current.rating,
  };

  items[index] = updatedItem;
  writeLocalItems(items);
  return updatedItem;
}

export async function deleteItem(id: string): Promise<boolean> {
  if (hasFirebaseAdminConfig()) {
    const db = getFirestoreDb();
    await db.collection("items").doc(id).delete();
    return true;
  }

  const items = readLocalItems();
  const filtered = items.filter((i) => i.id !== id);
  writeLocalItems(filtered);
  return true;
}
