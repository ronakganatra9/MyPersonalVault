import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet,
  Alert, Modal, ScrollView, TextInput, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { saveImageToCloud } from '../storage/cloudStorage';

export default function AddPhoto() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowTypeModal(true);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowTypeModal(true);
    }
  };

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>Capture or upload a visiting card / invoice</Text>

      <TouchableOpacity style={styles.btnCamera} onPress={openCamera}>
        <Ionicons name="camera" size={22} color="#fff" />
        <Text style={styles.btnText}>  Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnGallery} onPress={openGallery}>
        <Ionicons name="images" size={22} color="#fff" />
        <Text style={styles.btnText}>  Upload from Gallery</Text>
      </TouchableOpacity>

      {saving && (
        <View style={styles.savingBox}>
          <ActivityIndicator color="#1a73e8" />
          <Text style={styles.saving}>  Uploading to cloud...</Text>
        </View>
      )}

      <Modal visible={showTypeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Save Image As</Text>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            )}
            <TextInput
              style={styles.input}
              placeholder="Add a label (e.g. John Doe, Invoice #12)"
              placeholderTextColor="#aaa"
              value={label}
              onChangeText={setLabel}
            />
            <TouchableOpacity
              style={styles.modalBtnVcard}
              onPress={() => handleSave('vcard')}
            >
              <Ionicons name="card" size={20} color="#fff" />
              <Text style={styles.modalBtnText}>  Visiting Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnInvoice}
              onPress={() => handleSave('invoice')}
            >
              <Ionicons name="document-text" size={20} color="#fff" />
              <Text style={styles.modalBtnText}>  Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnCancel}
              onPress={() => {
                setShowTypeModal(false);
                setSelectedImage(null);
                setLabel('');
              }}
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
  container: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 32 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 32, textAlign: 'center' },
  btnCamera: {
    backgroundColor: '#1a73e8', width: '100%', padding: 18, borderRadius: 14,
    alignItems: 'center', marginBottom: 16, flexDirection: 'row', justifyContent: 'center',
  },
  btnGallery: {
    backgroundColor: '#34a853', width: '100%', padding: 18, borderRadius: 14,
    alignItems: 'center', marginBottom: 32, flexDirection: 'row', justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  savingBox: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  saving: { color: '#888', fontSize: 14 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  modalImage: {
    width: '100%', height: 150, borderRadius: 12,
    marginBottom: 16, resizeMode: 'cover',
  },
  input: {
    width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    padding: 12, fontSize: 14, marginBottom: 16, color: '#333',
  },
  modalBtnVcard: {
    backgroundColor: '#1a73e8', width: '100%', padding: 15, borderRadius: 12,
    alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center',
  },
  modalBtnInvoice: {
    backgroundColor: '#34a853', width: '100%', padding: 15, borderRadius: 12,
    alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center',
  },
  modalBtnCancel: { padding: 12 },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelText: { color: '#888', fontSize: 15 },
});