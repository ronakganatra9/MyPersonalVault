// Change this import at the top
import { saveImageToCloud } from '../storage/cloudStorage';

// Replace handleSave function with this
const handleSave = async (type) => {
  setSaving(true);
  setShowTypeModal(false);
  try {
    await saveImageToCloud(type, selectedImage, label);
    Alert.alert('Saved!', `Saved to ${type === 'vcard' ? 'Visiting Cards' : 'Invoices'}.`);
  } catch (e) {
    Alert.alert('Error', e.message);
  }
  setSaving(false);
  setSelectedImage(null);
  setLabel('');
};