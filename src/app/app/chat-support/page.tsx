"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Send,
  CheckCheck,
  Loader2,
  CircleAlert,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ensureChatRoom,
  getCurrentChatUser,
  markMessagesAsSeen,
  resolveSupportChatId,
  sendChatMessage,
  setUserOnlineStatus,
  subscribeToBlockedBy,
  subscribeToMessages,
  uploadChatImage,
  type CurrentChatUser,
  type FireChatMessage,
} from "@/src/lib/firebase/chatSupport";
import { ErrorToast } from "@/src/components/common/Toaster";

type OptimisticImageMessage = {
  id: string;
  content: string;
  type: "file";
  senderUid: string;
  receiverId: string;
  isSeen: boolean;
  localCreatedAt: Date;
  deliveryStatus: "sending" | "failed";
};

type ChatDisplayMessage = {
  id: string;
  content: string;
  type: "text" | "file";
  senderUid: string;
  isSeen: boolean;
  time: Date;
  isOptimistic: boolean;
  deliveryStatus?: "sending" | "failed";
  clientMessageId?: string;
};

const adminUser = {
  id: process.env.NEXT_PUBLIC_CHAT_ADMIN_UID || "PlT1bQctJkVAHEvNFZKyR5Uum4v1",
  name: "Admin",
  initials: "AD",
  profileImage:
    "https://static.vecteezy.com/system/resources/previews/043/900/708/non_2x/user-profile-icon-illustration-vector.jpg",
};

const ChatSupport = () => {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<FireChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentChatUser | null>(null);
  const [activeSenderUid, setActiveSenderUid] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [blockedBy, setBlockedBy] = useState<string[]>([]);
  const [optimisticImages, setOptimisticImages] = useState<
    OptimisticImageMessage[]
  >([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isBlockedByOther = useMemo(
    () => blockedBy.includes(adminUser.id),
    [blockedBy],
  );

  const isBlocked = isBlockedByOther;

  const displayMessages = useMemo<ChatDisplayMessage[]>(() => {
    const persisted = messages.map((message) => ({
      id: message.id,
      content: message.content,
      type: message.type,
      senderUid: message.senderUid,
      isSeen: message.isSeen,
      time: message.timeStamp ? message.timeStamp.toDate() : new Date(),
      isOptimistic: false,
      clientMessageId: message.clientMessageId,
    }));

    const deliveredClientMessageIds = new Set(
      persisted
        .map((message) => message.clientMessageId)
        .filter((value): value is string => Boolean(value)),
    );

    const pending = optimisticImages
      .map((message) => ({
        id: message.id,
        content: message.content,
        type: message.type,
        senderUid: message.senderUid,
        isSeen: false,
        time: message.localCreatedAt,
        isOptimistic: true,
        deliveryStatus: message.deliveryStatus,
        clientMessageId: message.id,
      }))
      .filter((message) => !deliveredClientMessageIds.has(message.id));

    return [...persisted, ...pending].sort(
      (left, right) => left.time.getTime() - right.time.getTime(),
    );
  }, [messages, optimisticImages]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDayLabel = (message: ChatDisplayMessage): string => {
    const date = message.time;
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const hasDateHeader = (index: number): boolean => {
    if (index === 0) return true;
    const currentDate = displayMessages[index].time.toDateString();
    const previousDate = displayMessages[index - 1].time.toDateString();
    return currentDate !== previousDate;
  };

  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content || !activeSenderUid || !activeChatId) return;

    if (isBlocked) {
      ErrorToast("You cannot send messages to this user.");
      return;
    }

    try {
      setIsSending(true);
      await sendChatMessage({
        chatId: activeChatId,
        senderUid: activeSenderUid,
        receiverId: adminUser.id,
        content,
        type: "text",
      });
      setMessageInput("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send message";
      ErrorToast(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file || !activeSenderUid || !activeChatId) return;
    if (isBlocked) {
      ErrorToast("You can't send images. You're blocked.");
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const previewUrl = URL.createObjectURL(file);

    const optimisticMessage: OptimisticImageMessage = {
      id: tempId,
      content: previewUrl,
      type: "file",
      senderUid: activeSenderUid,
      receiverId: adminUser.id,
      isSeen: false,
      localCreatedAt: new Date(),
      deliveryStatus: "sending",
    };

    setOptimisticImages((prev) => [...prev, optimisticMessage]);

    try {
      const imageUrl = await uploadChatImage(file);
      await sendChatMessage({
        chatId: activeChatId,
        senderUid: activeSenderUid,
        receiverId: adminUser.id,
        content: imageUrl,
        type: "file",
        clientMessageId: tempId,
      });

      URL.revokeObjectURL(previewUrl);
      setOptimisticImages((prev) => prev.filter((item) => item.id !== tempId));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send image";
      ErrorToast(message);

      setOptimisticImages((prev) =>
        prev.map((item) =>
          item.id === tempId ? { ...item, deliveryStatus: "failed" } : item,
        ),
      );
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  useEffect(() => {
    return () => {
      optimisticImages.forEach((message) => {
        if (message.content.startsWith("blob:")) {
          URL.revokeObjectURL(message.content);
        }
      });
    };
  }, [optimisticImages]);

  useEffect(() => {
    setCurrentUser(getCurrentChatUser());
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) return;
    if (!adminUser.id) return;

    let isMounted = true;

    const setupChat = async () => {
      const resolvedChatId = await resolveSupportChatId(
        currentUser.uid,
        adminUser.id,
      );

      if (!isMounted) return;

      setActiveChatId(resolvedChatId);
      setActiveSenderUid(currentUser.uid);

      await ensureChatRoom(resolvedChatId, [currentUser.uid, adminUser.id]);
      if (!isMounted) return;

      const unsubscribeMessages = subscribeToMessages(
        resolvedChatId,
        (items) => {
          setMessages(items);
          setIsLoadingMessages(false);
          void markMessagesAsSeen(resolvedChatId, currentUser.uid);
        },
      );

      const unsubscribeBlockedBy = subscribeToBlockedBy(
        resolvedChatId,
        (list) => {
          setBlockedBy(list);
        },
      );

      cleanupRefs.current = () => {
        unsubscribeMessages();
        unsubscribeBlockedBy();
      };
    };

    setIsLoadingMessages(true);
    void setupChat().catch((error) => {
      setIsLoadingMessages(false);
      const message =
        error instanceof Error
          ? `Failed to initialize chat: ${error.message}`
          : "Failed to initialize chat";
      ErrorToast(message);
    });

    return () => {
      isMounted = false;
      cleanupRefs.current();
      cleanupRefs.current = () => undefined;
    };
  }, [currentUser?.uid]);

  const cleanupRefs = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const uid = currentUser.uid;
    void setUserOnlineStatus(uid, true);

    const handleVisibility = () => {
      void setUserOnlineStatus(uid, !document.hidden);
    };

    const handleBeforeUnload = () => {
      void setUserOnlineStatus(uid, false);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      void setUserOnlineStatus(uid, false);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUser?.uid]);

  const blockMessage = "You have been blocked by this user.";

  return (
    <div className="bg-background flex flex-col">
      <div className="sticky top-22.75 z-40 shrink-0 bg-background border-b border-border">
        <div className="flex items-center justify-start px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Image
              src={adminUser.profileImage}
              alt="Admin profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
            <h1 className="text-lg font-semibold">{adminUser.name}</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 space-y-4">
          {isLoadingMessages && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Loading chat...
            </p>
          )}

          {!isLoadingMessages && displayMessages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Start a conversation with admin.
            </p>
          )}

          {displayMessages.map((message, index) => {
            const isCurrentUser = message.senderUid === activeSenderUid;

            return (
              <div key={message.id}>
                {hasDateHeader(index) && (
                  <div className="flex justify-center mb-4">
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">
                      {getDayLabel(message)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex gap-2 ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-md rounded-xl px-3 py-2 sm:px-4 sm:py-2 ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card text-card-foreground rounded-tl-none border border-border"
                    }`}
                  >
                    {message.type === "file" ? (
                      <div className="relative">
                        <img
                          src={message.content}
                          alt="chat media"
                          width={320}
                          height={240}
                          // unoptimized={message.content.startsWith("blob:")}
                          className="w-full max-w-70 h-auto rounded-md object-cover"
                        />

                        {message.isOptimistic &&
                          message.deliveryStatus === "sending" && (
                            <div className="absolute inset-0 rounded-md bg-black/35 flex items-center justify-center gap-2 text-white text-xs font-medium">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Sending...
                            </div>
                          )}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed wrap-break-word">
                        {message.content}
                      </p>
                    )}

                    <span
                      className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                        isCurrentUser
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.time)}
                      {isCurrentUser && (
                        <>
                          {message.isOptimistic &&
                          message.deliveryStatus === "failed" ? (
                            <CircleAlert className="w-3 h-3 text-red-400" />
                          ) : (
                            <CheckCheck
                              className={`w-3 h-3 ${
                                message.isSeen
                                  ? "text-green-500"
                                  : "text-primary-foreground/80"
                              }`}
                            />
                          )}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-0 z-40 shrink-0 bg-background border-t border-border p-3 sm:p-4">
          {isBlocked && (
            <p className="text-sm text-center text-muted-foreground mb-3">
              {blockMessage}
            </p>
          )}

          <div className="flex items-center gap-2 sm:gap-3 bg-muted p-1 rounded-xl">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm bg-transparent rounded-lg focus:outline-none focus:ring-none transition-all"
              aria-label="Message input"
              disabled={isBlocked}
            />

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelectImage}
            />

            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={isBlocked}
              className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer text-primary rounded-lg flex items-center justify-center hover:bg-primary/10 disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
              aria-label="Send image"
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isBlocked || isSending}
              className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
