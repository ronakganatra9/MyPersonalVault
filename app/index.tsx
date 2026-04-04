import { useState, useCallback } from 'react';
import { View, FlatList, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getImages } from '../storage/storage';

const { width } = Dimensions.get('window');

export default function VCardList() {
  const [images, setImages] = useState([]);

  // Reload every time this tab is opened
  useFocusEffect(
    useCallback(() => {
      getImages('vcard').then(setImages);
    }, [])
  );

  if (images.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No visiting cards yet.</Text>
        <Text style={styles.hint}>Tap "Add Photo" tab to add one.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.image} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333' },
  hint: { fontSize: 14, color: '#888', marginTop: 8 },
  list: { padding: 16, gap: 16 },
  image: { width: width - 32, height: 200, borderRadius: 12, resizeMode: 'cover' },
});