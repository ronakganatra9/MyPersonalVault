import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Logo / Branding */}
      <View style={styles.brandBox}>
        <View style={styles.logoCircle}>
          <Ionicons name="card" size={40} color="#fff" />
        </View>
        <Text style={styles.appName}>CardVault</Text>
        <Text style={styles.tagline}>Your cards & invoices, always with you</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>{isRegister ? 'Create Account' : 'Welcome Back'}</Text>

        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={18} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18} color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>
                {isRegister ? 'Create Account' : 'Sign In'}
              </Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.switchText}>
            {isRegister
              ? 'Already have an account? Sign In'
              : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f5f6fa',
    justifyContent: 'center', padding: 24,
  },
  brandBox: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#1a73e8', justifyContent: 'center',
    alignItems: 'center', marginBottom: 16,
    elevation: 6, shadowColor: '#1a73e8', shadowOpacity: 0.4, shadowRadius: 12,
  },
  appName: { fontSize: 32, fontWeight: '800', color: '#1a1a2e', letterSpacing: 1 },
  tagline: { fontSize: 14, color: '#888', marginTop: 6, textAlign: 'center' },
  form: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12,
  },
  formTitle: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 24 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#eee', borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, marginBottom: 16, backgroundColor: '#fafafa',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  btn: {
    backgroundColor: '#1a73e8', padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switchBtn: { alignItems: 'center', marginTop: 20 },
  switchText: { color: '#1a73e8', fontSize: 14 },
});