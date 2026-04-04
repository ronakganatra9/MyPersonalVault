import AsyncStorage from '@react-native-async-storage/async-storage';

const VCARDS_KEY = 'vcards';
const INVOICES_KEY = 'invoices';

export async function saveImage(type, imageUri) {
  const key = type === 'vcard' ? VCARDS_KEY : INVOICES_KEY;
  const existing = await getImages(type);
  const updated = [...existing, { id: Date.now().toString(), uri: imageUri }];
  await AsyncStorage.setItem(key, JSON.stringify(updated));
}

export async function getImages(type) {
  const key = type === 'vcard' ? VCARDS_KEY : INVOICES_KEY;
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export async function deleteImage(type, id) {
  const existing = await getImages(type);
  const updated = existing.filter(item => item.id !== id);
  const key = type === 'vcard' ? VCARDS_KEY : INVOICES_KEY;
  await AsyncStorage.setItem(key, JSON.stringify(updated));
}