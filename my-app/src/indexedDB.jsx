// // src/indexedDB.js
// const DB_NAME = "myAppDB";
// const DB_VERSION = 1;
// const NOTES_STORE = "notes";
// const USERS_STORE = "users";
// const PENDING_STORE = "pendingForms"; // new

// export function openDB() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open(DB_NAME, DB_VERSION);

//     request.onupgradeneeded = (event) => {
//       const db = event.target.result;
//       if (!db.objectStoreNames.contains(NOTES_STORE)) db.createObjectStore(NOTES_STORE, { keyPath: "id", autoIncrement: true });
//       if (!db.objectStoreNames.contains(USERS_STORE)) db.createObjectStore(USERS_STORE, { keyPath: "_id" });
//       if (!db.objectStoreNames.contains(PENDING_STORE)) db.createObjectStore(PENDING_STORE, { keyPath: "id", autoIncrement: true });
//     };

//     request.onsuccess = (event) => resolve(event.target.result);
//     request.onerror = (event) => reject(event.target.error);
//   });
// }

// // Save pending form
// export async function savePendingForm(formData) {
//   const db = await openDB();
//   const tx = db.transaction(PENDING_STORE, "readwrite");
//   tx.objectStore(PENDING_STORE).add(formData);
//   return tx.complete;
// }

// // Get all pending forms
// export async function getPendingForms() {
//   const db = await openDB();
//   return new Promise((resolve, reject) => {
//     const tx = db.transaction(PENDING_STORE, "readonly");
//     const store = tx.objectStore(PENDING_STORE);
//     const request = store.getAll();
//     request.onsuccess = () => resolve(request.result);
//     request.onerror = (e) => reject(e.target.error);
//   });
// }

// // Delete synced form
// export async function deletePendingForm(id) {
//   const db = await openDB();
//   const tx = db.transaction(PENDING_STORE, "readwrite");
//   tx.objectStore(PENDING_STORE).delete(id);
//   return tx.complete;
// }if (!navigator.onLine) {
//   await savePendingForm({ ...Data, image: lastBlob, pdf: pdfFile });
//   alert("You are offline! Form saved locally.");
// }














// src/indexedDB.js
const DB_NAME = "myAppDB";
const DB_VERSION = 1;
const NOTES_STORE = "notes";
const USERS_STORE = "users";
const PENDING_STORE = "pendingForms";

// Open or create the database
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        db.createObjectStore(NOTES_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        db.createObjectStore(USERS_STORE, { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains(PENDING_STORE)) {
        db.createObjectStore(PENDING_STORE, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Save pending form (with Blob support for image/pdf)
export async function savePendingForm(formData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, "readwrite");
    const store = tx.objectStore(PENDING_STORE);

    // Ensure image/pdf are Blobs
    const safeData = { ...formData };
    if (formData.image && !(formData.image instanceof Blob)) {
      safeData.image = new Blob([formData.image], { type: "image/png" });
    }
    if (formData.pdf && !(formData.pdf instanceof Blob)) {
      safeData.pdf = new Blob([formData.pdf], { type: "application/pdf" });
    }

    const request = store.add(safeData);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);

    tx.oncomplete = () => console.log("Transaction complete: form saved offline.");
    tx.onerror = (e) => console.error("Transaction failed:", e.target.error);
  });
}

// Get all pending forms
export async function getPendingForms() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, "readonly");
    const store = tx.objectStore(PENDING_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Delete synced form by ID
export async function deletePendingForm(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, "readwrite");
    const request = tx.objectStore(PENDING_STORE).delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
}
