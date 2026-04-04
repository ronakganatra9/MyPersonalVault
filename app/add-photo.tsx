import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, Alert, Modal, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveImage } from '../storage/storage';

export default function AddPhoto() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Open camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowTypeModal(true);
    }
  };

  // Open gallery
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowTypeModal(true);
    }
  };

  // Save with chosen type
  const handleSave = async (type) => {
    setSaving(true);
    setShowTypeModal(false);
    await saveImage(type, selectedImage);
    setSaving(false);
    setSelectedImage(null);
    Alert.alert(
      'Saved!',
      `Image saved to ${type === 'vcard' ? 'Visiting Cards' : 'Invoices'} list.`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Photo</Text>
      <Text style={styles.subtitle}>Capture or upload a visiting card / invoice</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.btnCamera} onPress={openCamera}>
        <Text style={styles.btnText}>📷  Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnGallery} onPress={openGallery}>
        <Text style={styles.btnText}>🖼️  Upload from Gallery</Text>
      </TouchableOpacity>

      {/* Preview */}
      {selectedImage && (
        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>Preview</Text>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        </View>
      )}

      {saving && <Text style={styles.saving}>Saving...</Text>}

      {/* Type picker modal */}
      <Modal visible={showTypeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Save as which type?</Text>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            )}
            <TouchableOpacity
              style={styles.modalBtnVcard}
              onPress={() => handleSave('vcard')}
            >
              <Text style={styles.modalBtnText}>👤  Visiting Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnInvoice}
              onPress={() => handleSave('invoice')}
            >
              <Text style={styles.modalBtnText}>🧾  Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnCancel}
              onPress={() => { setShowTypeModal(false); setSelectedImage(null); }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 48 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 40, textAlign: 'center' },
  btnCamera: {
    backgroundColor: '#1a73e8', width: '100%', padding: 18,
    borderRadius: 14, alignItems: 'center', marginBottom: 16,
  },
  btnGallery: {
    backgroundColor: '#34a853', width: '100%', padding: 18,
    borderRadius: 14, alignItems: 'center', marginBottom: 32,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  previewBox: { width: '100%', alignItems: 'center', marginTop: 8 },
  previewLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  previewImage: { width: '100%', height: 220, borderRadius: 12, resizeMode: 'cover' },
  saving: { marginTop: 16, color: '#888' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  modalImage: { width: '100%', height: 160, borderRadius: 12, marginBottom: 20, resizeMode: 'cover' },
  modalBtnVcard: {
    backgroundColor: '#1a73e8', width: '100%', padding: 16,
    borderRadius: 12, alignItems: 'center', marginBottom: 12,
  },
  modalBtnInvoice: {
    backgroundColor: '#34a853', width: '100%', padding: 16,
    borderRadius: 12, alignItems: 'center', marginBottom: 12,
  },
  modalBtnCancel: { padding: 12 },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelText: { color: '#888', fontSize: 15 },
});