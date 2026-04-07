import { useState, useCallback } from 'react';
import {
  View, FlatList, Image, Text, StyleSheet, Dimensions,
  TouchableOpacity, Alert, Modal, TextInput, Share,
  StatusBar, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getImagesFromCloud, deleteImageFromCloud } from '../storage/cloudStorage';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function invoiceList() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getImagesFromCloud('invoice')
        .then(setImages)
        .finally(() => setLoading(false));
    }, [])
  );

  const filtered = images.filter(item =>
    item.label?.toLowerCase().includes(search.toLowerCase()) ||
    item.date?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id, storagePath) => {
    Alert.alert('Delete', 'Remove this visiting card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteImageFromCloud(id, storagePath);
          getImagesFromCloud('invoice').then(setImages);
        }
      },
    ]);
  };

  const handleShare = async (uri) => {
    await Share.share({ url: uri, message: 'Visiting Card from CardVault' });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive', onPress: async () => {
          await signOut(auth);
          router.replace('/login');
        }
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No invoices yet</Text>
        <Text style={styles.hint}>Tap "Add Photo" tab to add one</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by label or date..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 8 }}>
          <Ionicons name="log-out-outline" size={22} color="#e53935" />
        </TouchableOpacity>
      </View>

      <Text style={styles.count}>{filtered.length} card{filtered.length !== 1 ? 's' : ''}</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setFullscreenImage(item.uri)}>
              <Image source={{ uri: item.uri }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.cardFooter}>
              <View>
                {item.label ? <Text style={styles.label}>{item.label}</Text> : null}
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleShare(item.uri)} style={styles.iconBtn}>
                  <Ionicons name="share-outline" size={22} color="#1a73e8" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.storagePath)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={22} color="#e53935" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <Modal visible={!!fullscreenImage} transparent animationType="fade">
        <View style={styles.fsOverlay}>
          <StatusBar hidden />
          <TouchableOpacity style={styles.fsClose} onPress={() => setFullscreenImage(null)}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {fullscreenImage && (
            <Image source={{ uri: fullscreenImage }} style={styles.fsImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#555', marginTop: 16 },
  hint: { fontSize: 14, color: '#aaa', marginTop: 8 },
  logoutBtn: { marginTop: 32, padding: 12 },
  logoutText: { color: '#e53935', fontSize: 14 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    margin: 16, marginBottom: 4, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  count: { fontSize: 12, color: '#aaa', marginLeft: 20, marginBottom: 4 },
  list: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 12,
  },
  label: { fontSize: 15, fontWeight: '600', color: '#222' },
  date: { fontSize: 12, color: '#aaa', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 6 },
  fsOverlay: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  fsClose: { position: 'absolute', top: 48, right: 20, zIndex: 10 },
  fsImage: { width, height },
});