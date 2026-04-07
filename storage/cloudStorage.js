import { db, storage, auth } from '../firebaseConfig';
import {
  collection, addDoc, getDocs,
  deleteDoc, doc, query, where, orderBy
} from 'firebase/firestore';
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage';

// Upload image to Firebase Storage + save metadata to Firestore
export async function saveImageToCloud(type, localUri, label = '') {
  const user = auth.currentUser;
  if (!user) throw new Error('Not logged in');

  // Convert local URI to blob
  const response = await fetch(localUri);
  const blob = await response.blob();

  // Upload to Firebase Storage
  const filename = `${user.uid}/${type}/${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);

  // Save metadata to Firestore
  await addDoc(collection(db, 'images'), {
    uid: user.uid,
    type,
    label,
    uri: downloadURL,
    storagePath: filename,
    date: new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }),
    createdAt: Date.now(),
  });
}

// Get all images for current user filtered by type
export async function getImagesFromCloud(type) {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, 'images'),
    where('uid', '==', user.uid),
    where('type', '==', type),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Delete image from Storage + Firestore
export async function deleteImageFromCloud(docId, storagePath) {
  await deleteDoc(doc(db, 'images', docId));
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}