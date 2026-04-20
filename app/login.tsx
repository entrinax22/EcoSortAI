import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];

  const warningSoft = useMemo(
    () => (theme === "dark" ? "rgba(251, 191, 36, 0.16)" : "#FEF3C7"),
    [theme],
  );
  const warningText = useMemo(
    () => (theme === "dark" ? c.warning : "#D97706"),
    [c.warning, theme],
  );

  const handleLogin = () => {
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: c.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <IconSymbol size={24} name="chevron.left" color={c.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <View style={styles.brandContainer}>
            <View
              style={[styles.iconContainer, { backgroundColor: c.brandSoft }]}
            >
              <IconSymbol size={48} name="leaf.fill" color={c.brand} />
            </View>
            <View style={styles.brandTextContainer}>
              <ThemedText style={[styles.brandTitle, { color: c.brand }]}>
                TaponRewards
              </ThemedText>
              <View
                style={[
                  styles.badgeContainer,
                  { backgroundColor: warningSoft },
                ]}
              >
                <IconSymbol size={14} name="star.fill" color={c.warning} />
                <ThemedText style={[styles.badgeText, { color: warningText }]}>
                  Rewards Program
                </ThemedText>
              </View>
            </View>
          </View>

          <ThemedText style={[styles.title, { color: c.text }]}>
            Welcome Back!
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: c.mutedText }]}>
            Sign in to track your recycling and earn Eco Points
          </ThemedText>
        </View>

        <View
          style={[
            styles.rewardsBanner,
            {
              backgroundColor: c.brandSoft,
              borderColor:
                theme === "dark" ? "rgba(52, 211, 153, 0.22)" : "#D1FAE5",
            },
          ]}
        >
          <View style={[styles.rewardsIconBg, { backgroundColor: c.surface }]}>
            <IconSymbol size={28} name="gift.fill" color={c.brand} />
          </View>
          <View style={styles.rewardsTextContainer}>
            <ThemedText
              style={[
                styles.rewardsTitle,
                { color: theme === "dark" ? c.text : "#065F46" },
              ]}
            >
              Unlock Rewards
            </ThemedText>
            <ThemedText
              style={[
                styles.rewardsDesc,
                { color: theme === "dark" ? c.mutedText : "#059669" },
              ]}
            >
              Get 50 bonus points on your first login today!
            </ThemedText>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: c.text }]}>
              Email Address
            </ThemedText>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
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
            <ThemedText style={[styles.label, { color: c.text }]}>
              Password
            </ThemedText>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
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
            <TouchableOpacity
              style={styles.forgotPassword}
              activeOpacity={0.85}
            >
              <ThemedText
                style={[styles.forgotPasswordText, { color: c.brand }]}
              >
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: c.brand, shadowColor: c.brand },
            ]}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
            <IconSymbol size={20} name="arrow.right" color="#FFF" />
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
            <ThemedText style={[styles.dividerText, { color: c.mutedText }]}>
              OR
            </ThemedText>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
          </View>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: c.surface, borderColor: c.border },
            ]}
            activeOpacity={0.9}
          >
            <IconSymbol size={24} name="globe" color={c.text} />
            <ThemedText style={[styles.socialButtonText, { color: c.text }]}>
              Continue with Google
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <ThemedText style={[styles.footerText, { color: c.mutedText }]}>
              Don&apos;t have an account?{" "}
            </ThemedText>
            <TouchableOpacity
              onPress={() => router.push("/register")}
              activeOpacity={0.85}
            >
              <ThemedText style={[styles.footerLink, { color: c.brand }]}>
                Sign Up
              </ThemedText>
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 32,
  },
  headerContainer: {
    marginBottom: 24,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  brandTextContainer: {
    marginLeft: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  rewardsBanner: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    alignItems: "center",
  },
  rewardsIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardsTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  rewardsDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "700",
  },
  loginButton: {
    flexDirection: "row",
    borderRadius: 16,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 32,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "700",
  },
  socialButton: {
    flexDirection: "row",
    borderRadius: 16,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 40,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 12,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "800",
  },
});
