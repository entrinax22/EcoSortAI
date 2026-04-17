import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate back to home upon successful login logic
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
          <View style={styles.iconContainer}>
            <IconSymbol size={48} name="leaf.fill" color="#10B981" />
          </View>
          <ThemedText style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to continue your eco journey</ThemedText>
        </View>

        <View style={styles.formContainer}>
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
            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
            <IconSymbol size={20} name="arrow.right" color="#FFF" />
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <IconSymbol size={24} name="globe" color="#0F172A" />
            <ThemedText style={styles.socialButtonText}>Continue with Google</ThemedText>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <ThemedText style={styles.footerText}>Don't have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <ThemedText style={styles.footerLink}>Sign Up</ThemedText>
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
  iconContainer: { 
    width: 80, 
    height: 80, 
    borderRadius: 24, 
    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#0F172A', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748B' 
  },
  formContainer: { 
    flex: 1 
  },
  inputGroup: { 
    marginBottom: 24 
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
  forgotPassword: { 
    alignSelf: 'flex-end', 
    marginTop: 12 
  },
  forgotPasswordText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#3B82F6' 
  },
  loginButton: { 
    flexDirection: 'row', 
    backgroundColor: '#3B82F6', 
    borderRadius: 16, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#3B82F6', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5, 
    marginBottom: 32 
  },
  loginButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginRight: 8 
  },
  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 32 
  },
  divider: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#E2E8F0' 
  },
  dividerText: { 
    marginHorizontal: 16, 
    fontSize: 14, 
    color: '#94A3B8', 
    fontWeight: '600' 
  },
  socialButton: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    marginBottom: 40 
  },
  socialButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#0F172A', 
    marginLeft: 12 
  },
  footerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: 20 
  },
  footerText: { 
    fontSize: 15, 
    color: '#64748B' 
  },
  footerLink: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#10B981' 
  }
});
