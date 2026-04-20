import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  ChatMessage,
  deleteMessage,
  getMessages,
  pingPresence,
  sendMessage,
} from "@/services/chat";

const POLL_INTERVAL_MS = 5000;

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const threadId = Number(id);
  const theme = useColorScheme() ?? "light";
  const c = Colors[theme];
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    const { data } = await getMessages(threadId);
    if (data) setMessages(data);
    setLoading(false);
  }, [threadId]);

  useEffect(() => {
    fetchMessages();
    pingPresence();

    pollRef.current = setInterval(() => {
      fetchMessages();
      pingPresence();
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchMessages]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content) return;
    setText("");
    setSending(true);
    const { data, error } = await sendMessage({ thread_id: threadId, content });
    setSending(false);
    if (error) {
      Alert.alert("Error", error);
      setText(content);
      return;
    }
    if (data) {
      setMessages((prev) => [...prev, data]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleDeleteMessage = (msg: ChatMessage) => {
    Alert.alert("Delete Message", "Delete this message?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMessage(msg.id);
          setMessages((prev) => prev.filter((m) => m.id !== msg.id));
        },
      },
    ]);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = item.sender.id === user?.id;
    return (
      <TouchableOpacity
        onLongPress={() => handleDeleteMessage(item)}
        activeOpacity={0.85}
        style={[styles.msgRow, isMine && styles.msgRowMine]}
      >
        {!isMine && (
          <View style={[styles.msgAvatar, { backgroundColor: c.brandSoft }]}>
            <ThemedText style={[styles.msgAvatarText, { color: c.brand }]}>
              {item.sender.name?.[0]?.toUpperCase() ?? "?"}
            </ThemedText>
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isMine
              ? { backgroundColor: c.brand }
              : { backgroundColor: c.surface, borderColor: c.border, borderWidth: 1 },
          ]}
        >
          {!isMine && (
            <ThemedText style={[styles.senderName, { color: c.brand }]}>
              {item.sender.name ?? item.sender.email}
            </ThemedText>
          )}
          <ThemedText style={[styles.msgText, { color: isMine ? "#fff" : c.text }]}>
            {item.content}
          </ThemedText>
          <ThemedText style={[styles.msgTime, { color: isMine ? "rgba(255,255,255,0.7)" : c.mutedText }]}>
            {formatTime(item.created_at)}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Thread #${threadId}`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <IconSymbol size={22} name="chevron.left" color={c.brand} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: c.surface },
          headerTitleStyle: { color: c.text, fontWeight: "700" },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: c.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={c.brand} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.centered}>
                <ThemedText style={[styles.emptyText, { color: c.mutedText }]}>
                  No messages yet. Say hello!
                </ThemedText>
              </View>
            }
          />
        )}

        <View style={[styles.inputBar, { backgroundColor: c.surface, borderTopColor: c.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: c.background, color: c.text, borderColor: c.border }]}
            placeholder="Type a message..."
            placeholderTextColor={c.mutedText}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: c.brand }, (!text.trim() || sending) && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <IconSymbol size={20} name="paperplane.fill" color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageList: { padding: 16, gap: 10, paddingBottom: 8 },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, maxWidth: "85%" },
  msgRowMine: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  msgAvatarText: { fontSize: 13, fontWeight: "800" },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "100%",
  },
  senderName: { fontSize: 11, fontWeight: "800", marginBottom: 4 },
  msgText: { fontSize: 15, lineHeight: 21 },
  msgTime: { fontSize: 11, marginTop: 4, alignSelf: "flex-end" },
  emptyText: { fontSize: 15, fontWeight: "600" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: { paddingHorizontal: 8 },
});
