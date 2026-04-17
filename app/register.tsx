import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Navigate back to home upon successful registration logic
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol size={24} name="chevron.left" color="#0F172A" />
        </TouchableOpacity>
        
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>Join the Movement</ThemedText>
          <ThemedText style={styles.subtitle}>Create an account and start making an impact today.</ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol size={20} name="person.fill" color="#94A3B8" />
              <TextInput 
                style={styles.input}
                placeholder="Alex Johnson"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email Address</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol size={20} name="envelope.fill" color="#94A3B8" />
              <TextInput 
                style={styles.input}
                placeholder="eco@warrior.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol size={20} name="lock.fill" color="#94A3B8" />
              <TextInput 
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <ThemedText style={styles.registerButtonText}>Create Account</ThemedText>
            <IconSymbol size={20} name="arrow.right" color="#FFF" />
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <ThemedText style={styles.footerLink}>Sign In</ThemedText>
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
    backgroundColor: '#F8FAFC' 
  },
  scrollContent: { 
    flexGrow: 1, 
    padding: 24, 
    paddingTop: 60 
  },
  backButton: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2, 
    marginBottom: 32 
  },
  headerContainer: { 
    marginBottom: 40 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#0F172A', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748B', 
    lineHeight: 24 
  },
  formContainer: { 
    flex: 1 
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1E293B', 
    marginBottom: 8 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 60, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  input: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16, 
    color: '#0F172A' 
  },
  registerButton: { 
    flexDirection: 'row', 
    backgroundColor: '#10B981', // Vibrant Emerald for registration
    borderRadius: 16, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#10B981', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5, 
    marginTop: 12, 
    marginBottom: 32 
  },
  registerButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginRight: 8 
  },
  footerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: 20, 
    marginTop: 'auto' 
  },
  footerText: { 
    fontSize: 15, 
    color: '#64748B' 
  },
  footerLink: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#3B82F6' 
  }
});
