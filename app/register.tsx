import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { register } from '@/services/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useColorScheme() ?? 'light';
  const c = Colors[theme];

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    const { error: apiError } = await register({ name, email, password });
    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: c.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: c.surface, borderColor: c.border }]}
          onPress={() => router.back()}
          activeOpacity={0.85}>
          <IconSymbol size={24} name="chevron.left" color={c.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <ThemedText style={[styles.title, { color: c.text }]}>Join the Movement</ThemedText>
          <ThemedText style={[styles.subtitle, { color: c.mutedText }]}>
            Create an account and start making an impact today.
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: c.text }]}>Full Name</ThemedText>
            <View style={[styles.inputContainer, { backgroundColor: c.surface, borderColor: c.border }]}>
              <IconSymbol size={20} name="person.fill" color={c.mutedText} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                placeholder="Alex Johnson"
                placeholderTextColor={c.mutedText}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: c.text }]}>Email Address</ThemedText>
            <View style={[styles.inputContainer, { backgroundColor: c.surface, borderColor: c.border }]}>
              <IconSymbol size={20} name="envelope.fill" color={c.mutedText} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                placeholder="eco@warrior.com"
                placeholderTextColor={c.mutedText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: c.text }]}>Password</ThemedText>
            <View style={[styles.inputContainer, { backgroundColor: c.surface, borderColor: c.border }]}>
              <IconSymbol size={20} name="lock.fill" color={c.mutedText} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                placeholder="••••••••"
                placeholderTextColor={c.mutedText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {error && (
            <ThemedText style={[styles.errorText, { color: c.danger }]}>
              {error}
            </ThemedText>
          )}

          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: c.brand, shadowColor: c.brand },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleRegister}
            activeOpacity={0.9}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <ThemedText style={styles.registerButtonText}>Create Account</ThemedText>
                <IconSymbol size={20} name="arrow.right" color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <ThemedText style={[styles.footerText, { color: c.mutedText }]}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.85}>
              <ThemedText style={[styles.footerLink, { color: c.accent }]}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 32,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  registerButton: {
    flexDirection: 'row',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 12,
    marginBottom: 32,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '800',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});

