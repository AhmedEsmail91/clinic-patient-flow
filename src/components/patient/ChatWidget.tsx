"use client";

import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { startPatientChat } from "@/lib/api/chat";
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase";
import type { ChatMessage } from "@/types";

// REST starts/resumes the chat thread; messages themselves flow in real
// time through Firestore (no Socket.IO, no polling) - see
// lib/api/chat.ts and lib/firebase.ts.
export function ChatWidget({ isRTL }: { isRTL: boolean }) {
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [missedMessagesCounter, setMissedMessagesCounter] = useState(0);
  const widgetRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const startChat = useMutation({
    mutationFn: startPatientChat,
    onSuccess: (id) => setChatId(id),
    onError: (err) => console.error("Failed to start chat:", err),
  });

  const sendChatMessage = useMutation({
    mutationFn: ({ activeChatId, uid, content }: { activeChatId: string; uid: string; content: string }) =>
      addDoc(collection(getFirebaseFirestore(), "chats", activeChatId, "messages"), {
        sender_id: uid,
        sender_type: "patient",
        content,
        createdAt: serverTimestamp(),
      }),
    onError: (err) => console.error("Failed to send message:", err),
  });

  // When widget opens, start the chat thread (or resume it).
  useEffect(() => {
    if (open) {
      setHasNewMessage(false);
      setMissedMessagesCounter(0);
      if (!chatId) startChat.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Subscribe to this chat's messages in Firestore once we have a chat id.
  useEffect(() => {
    if (!chatId || !isFirebaseConfigured()) return;

    let isInitialSnapshot = true;
    const messagesQuery = query(
      collection(getFirebaseFirestore(), "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ChatMessage));

        if (!isInitialSnapshot) {
          const newAdminMessages = snapshot
            .docChanges()
            .filter((change) => change.type === "added" && change.doc.data().sender_type === "admin");

          if (newAdminMessages.length > 0 && !openRef.current) {
            playNotificationSound();
            setHasNewMessage(true);
            setMissedMessagesCounter((prev) => prev + newAdminMessages.length);
          }
        }
        isInitialSnapshot = false;
      },
      (err) => console.error("Chat subscription error:", err)
    );

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!isFirebaseConfigured()) {
      console.error("Cannot send chat message: Firebase is not configured (missing NEXT_PUBLIC_FIREBASE_* env vars).");
      return;
    }

    const currentUid = getFirebaseAuth().currentUser?.uid;
    if (!currentUid) {
      console.error("Cannot send chat message: not signed in to Firebase yet.");
      return;
    }

    let activeChatId = chatId;
    if (!activeChatId) {
      try {
        activeChatId = await startChat.mutateAsync();
      } catch {
        return;
      }
    }

    const content = input;
    setInput("");
    sendChatMessage.mutate({ activeChatId, uid: currentUid, content });
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />

      <motion.div
        className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg cursor-pointer z-50"
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(!open)}
        style={{ pointerEvents: "auto" }}
        role="button"
        aria-label="Open chat with the clinic"
      >
        {hasNewMessage && !open && (
          <span className="relative">
            <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 animate-ping"></span>
            <span className="absolute top-1 text-sm text-center right-1 w-5 h-5 rounded-full bg-green-500">
              {missedMessagesCounter}
            </span>
          </span>
        )}
        <MessageCircle size={24} />
      </motion.div>

      {open && (
        <motion.div
          ref={widgetRef}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={`fixed bottom-20 ${isRTL ? "left-5" : "right-5"} w-80 h-96 bg-card border rounded-2xl shadow-lg flex flex-col z-50`}
        >
          <div className="p-3 font-semibold border-b text-primary">Chat with Assistant</div>
          <div
            className="flex-1 overflow-auto p-3 space-y-2 break-words"
            ref={(el) => {
              if (el) el.scrollTop = el.scrollHeight;
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender_type === "patient"
                    ? "bg-primary text-primary-foreground self-end ml-auto"
                    : "bg-muted"
                }`}
              >
                {msg.content}
                {msg.is_pinned && <div className="text-xs text-yellow-500 mt-1">Pinned</div>}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex items-start">
            <input
              className="flex-1 border rounded-lg p-2 text-sm bg-background"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className={`m${isRTL ? "r" : "l"}-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg`}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
