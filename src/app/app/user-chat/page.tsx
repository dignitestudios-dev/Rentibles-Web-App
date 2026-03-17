"use client";

import {
  ArrowLeft,
  Camera,
  CheckCheck,
  CircleAlert,
  Loader2,
  Search,
  Send,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  blockUserByChatId,
  ensureChatRoom,
  getCurrentChatUser,
  markMessagesAsSeen,
  resolveSupportChatId,
  sendChatMessage,
  setUserOnlineStatus,
  subscribeToBlockedBy,
  subscribeToMessages,
  subscribeToUserChatsWithDetails,
  subscribeToUserStatus,
  unblockUserByChatId,
  uploadChatImage,
  type CurrentChatUser,
  type FireChatMessage,
  type UserChatModel,
} from "@/src/lib/firebase/chatSupport";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

const UserChat = () => {
  // ── State ──────────────────────────────────────────────────────────────────
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
  const [isBlockingAction, setIsBlockingAction] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);

  // ── Chat list from Firebase (replaces /api/users) ─────────────────────────
  // Mirrors Flutter's getUserChatsWithDetails() — populated from Firestore,
  // never from an HTTP endpoint.
  const [chatList, setChatList] = useState<UserChatModel[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  const [selectedChat, setSelectedChat] = useState<UserChatModel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Active chat subscriptions — cancelled when switching conversations
  const cleanupRef = useRef<(() => void) | null>(null);

  // ── Derived block state ────────────────────────────────────────────────────
  const isBlockedByMe = useMemo(
    () => (currentUser ? blockedBy.includes(currentUser.uid) : false),
    [blockedBy, currentUser],
  );

  const isBlockedByOther = useMemo(
    () => (selectedChat ? blockedBy.includes(selectedChat.otherUserId) : false),
    [blockedBy, selectedChat],
  );

  const isBlocked = isBlockedByMe || isBlockedByOther;

  // ── Filtered chat list for sidebar search ─────────────────────────────────
  const filteredChats = useMemo(
    () =>
      chatList.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [chatList, searchQuery],
  );

  // ── Merged display messages (persisted + optimistic) ──────────────────────
  const displayMessages = useMemo<ChatDisplayMessage[]>(() => {
    const persisted = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      type: msg.type,
      senderUid: msg.senderUid,
      isSeen: msg.isSeen,
      time: msg.timeStamp ? msg.timeStamp.toDate() : new Date(),
      isOptimistic: false,
      clientMessageId: msg.clientMessageId,
    }));

    const deliveredIds = new Set(
      persisted
        .map((m) => m.clientMessageId)
        .filter((v): v is string => Boolean(v)),
    );

    const pending = optimisticImages
      .map((msg) => ({
        id: msg.id,
        content: msg.content,
        type: msg.type,
        senderUid: msg.senderUid,
        isSeen: false,
        time: msg.localCreatedAt,
        isOptimistic: true,
        deliveryStatus: msg.deliveryStatus,
        clientMessageId: msg.id,
      }))
      .filter((msg) => !deliveredIds.has(msg.id));

    return [...persisted, ...pending].sort(
      (a, b) => a.time.getTime() - b.time.getTime(),
    );
  }, [messages, optimisticImages]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatTime = (date: Date): string =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const getDayLabel = (msg: ChatDisplayMessage): string => {
    const today = new Date();
    if (msg.time.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (msg.time.toDateString() === yesterday.toDateString())
      return "Yesterday";
    return msg.time.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const hasDateHeader = (index: number): boolean => {
    if (index === 0) return true;
    return (
      displayMessages[index].time.toDateString() !==
      displayMessages[index - 1].time.toDateString()
    );
  };

  const formatLastMessagePreview = (chat: UserChatModel): string => {
    if (!chat.lastMessage) return "No messages yet";
    if (chat.lastMessageType === "file") return "📷 Photo";
    return chat.lastMessage.length > 40
      ? chat.lastMessage.slice(0, 40) + "…"
      : chat.lastMessage;
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ── Bootstrap current user ────────────────────────────────────────────────
  useEffect(() => {
    setCurrentUser(getCurrentChatUser());
  }, []);

  // ── Subscribe to chat list from Firebase ─────────────────────────────────
  // This is the direct replacement for `fetch("/api/users")`.
  // It calls subscribeToUserChatsWithDetails() which mirrors Flutter's
  // getUserChatsWithDetails() stream — no HTTP endpoint needed.
  useEffect(() => {
    if (!currentUser?.uid) return;

    setIsLoadingChats(true);

    const unsub = subscribeToUserChatsWithDetails(currentUser.uid, (chats) => {
      setChatList(chats);
      setIsLoadingChats(false);
    });

    return unsub;
  }, [currentUser?.uid]);

  // ── Auto-scroll on new messages ───────────────────────────────────────────
  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, scrollToBottom]);

  // ── Revoke blob URLs on cleanup ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      optimisticImages.forEach((msg) => {
        if (msg.content.startsWith("blob:")) URL.revokeObjectURL(msg.content);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Self online status while chat is open ─────────────────────────────────
  useEffect(() => {
    if (!currentUser?.uid || !selectedChat) return;

    const uid = currentUser.uid;
    void setUserOnlineStatus(uid, true);

    const handleVisibility = () =>
      void setUserOnlineStatus(uid, !document.hidden);
    const handleBeforeUnload = () => void setUserOnlineStatus(uid, false);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      void setUserOnlineStatus(uid, false);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUser?.uid, selectedChat]);

  // ── Subscribe to other user's online status ───────────────────────────────
  useEffect(() => {
    if (!selectedChat) return;
    const unsub = subscribeToUserStatus(
      selectedChat.otherUserId,
      (isOnline) => {
        setOtherUserOnline(isOnline);
      },
    );
    return unsub;
  }, [selectedChat]);

  // ── Subscription cleanup on chat switch / unmount ─────────────────────────
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [selectedChat]);

  // ── Open a conversation from the sidebar ─────────────────────────────────
  const handleSelectChat = async (chat: UserChatModel) => {
    // Tear down the previous listeners immediately
    cleanupRef.current?.();
    cleanupRef.current = null;

    setSelectedChat(chat);
    setMessages([]);
    setMessageInput("");
    setOptimisticImages([]);
    setBlockedBy([]);
    setIsLoadingMessages(true);

    try {
      // The chatId already exists in the UserChatModel — no need to resolve
      const chatId = chat.chatId;

      setActiveChatId(chatId);
      setActiveSenderUid(currentUser?.uid ?? "");

      // Ensure the Firestore doc exists (idempotent)
      await ensureChatRoom(chatId, [currentUser?.uid ?? "", chat.otherUserId]);

      const unsubMessages = subscribeToMessages(chatId, (items) => {
        setMessages(items);
        setIsLoadingMessages(false);
        void markMessagesAsSeen(chatId, currentUser?.uid ?? "");
      });

      const unsubBlockedBy = subscribeToBlockedBy(chatId, (list) => {
        setBlockedBy(list);
      });

      cleanupRef.current = () => {
        unsubMessages();
        unsubBlockedBy();
      };
    } catch (error) {
      setIsLoadingMessages(false);
      ErrorToast(
        error instanceof Error
          ? `Failed to load chat: ${error.message}`
          : "Failed to load chat",
      );
    }
  };

  // ── Send text message ─────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content || !activeSenderUid || !activeChatId || !selectedChat) return;

    if (isBlocked) {
      ErrorToast(
        isBlockedByMe
          ? "Unblock this user to send messages."
          : "You cannot send messages to this user.",
      );
      return;
    }

    try {
      setIsSending(true);
      await sendChatMessage({
        chatId: activeChatId,
        senderUid: activeSenderUid,
        receiverId: selectedChat.otherUserId,
        content,
        type: "text",
        receiverData: {
          name: selectedChat.name,
          email: selectedChat.email,
          profilePicture: selectedChat.profilePicture,
        },
      });
      setMessageInput("");
    } catch (error) {
      ErrorToast(
        error instanceof Error ? error.message : "Failed to send message",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  // ── Send image (optimistic) ───────────────────────────────────────────────
  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file || !activeSenderUid || !activeChatId || !selectedChat) return;

    if (isBlocked) {
      ErrorToast(
        isBlockedByMe
          ? "Unblock this user to send images."
          : "You can't send images. You're blocked.",
      );
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const previewUrl = URL.createObjectURL(file);

    setOptimisticImages((prev) => [
      ...prev,
      {
        id: tempId,
        content: previewUrl,
        type: "file",
        senderUid: activeSenderUid,
        receiverId: selectedChat.otherUserId,
        isSeen: false,
        localCreatedAt: new Date(),
        deliveryStatus: "sending",
      },
    ]);

    try {
      const imageUrl = await uploadChatImage(file);
      await sendChatMessage({
        chatId: activeChatId,
        senderUid: activeSenderUid,
        receiverId: selectedChat.otherUserId,
        content: imageUrl,
        type: "file",
        clientMessageId: tempId,
        receiverData: {
          name: selectedChat.name,
          email: selectedChat.email,
          profilePicture: selectedChat.profilePicture,
        },
      });
      URL.revokeObjectURL(previewUrl);
      setOptimisticImages((prev) => prev.filter((m) => m.id !== tempId));
    } catch (error) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to send image",
      );
      setOptimisticImages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, deliveryStatus: "failed" } : m,
        ),
      );
    }
  };

  // ── Block / Unblock ───────────────────────────────────────────────────────
  const handleToggleBlock = async () => {
    if (!activeChatId || !currentUser?.uid) return;
    setIsBlockingAction(true);
    try {
      if (isBlockedByMe) {
        await unblockUserByChatId(activeChatId, currentUser.uid);
        SuccessToast("User unblocked.");
      } else {
        await blockUserByChatId(activeChatId, currentUser.uid);
        SuccessToast("User blocked.");
      }
    } catch {
      ErrorToast("Failed to update block status.");
    } finally {
      setIsBlockingAction(false);
    }
  };

  // ── Sub-components ────────────────────────────────────────────────────────

  const ChatAvatar = ({
    name,
    profilePicture,
    size = "md",
  }: {
    name: string;
    profilePicture?: string;
    size?: "sm" | "md";
  }) => {
    const dim = size === "sm" ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-xs";
    return (
      <div
        className={`${dim} rounded-full bg-muted flex-shrink-0 overflow-hidden`}
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/20 flex items-center justify-center font-semibold">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        )}
      </div>
    );
  };

  const BlockBanner = () => {
    if (!isBlocked) return null;
    return (
      <p className="text-sm text-center text-muted-foreground mb-3">
        {isBlockedByMe
          ? "You have blocked this user. Unblock to send messages."
          : "You have been blocked by this user."}
      </p>
    );
  };

  const MessageInput = () => (
    <div className="sticky bottom-0 z-30 bg-background border-t border-border p-3 sm:p-4">
      <BlockBanner />
      <div className="flex items-center gap-2 sm:gap-3 bg-muted p-1 rounded-xl">
        <input
          ref={inputRef}
          type="text"
          placeholder={
            isBlocked ? "Messaging unavailable" : "Type a message..."
          }
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isBlocked}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm bg-transparent rounded-lg focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Message input"
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
          className="w-9 h-9 sm:w-10 sm:h-10 text-primary rounded-lg flex items-center justify-center hover:bg-primary/10 disabled:text-muted-foreground disabled:cursor-not-allowed transition-all"
          aria-label="Send image"
        >
          <Camera className="w-5 h-5" />
        </button>
        <button
          onClick={handleSendMessage}
          disabled={!messageInput.trim() || isBlocked || isSending}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all active:scale-95"
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  const MessageBubble = ({
    message,
    index,
  }: {
    message: ChatDisplayMessage;
    index: number;
  }) => {
    const isMe = message.senderUid === activeSenderUid;
    return (
      <div>
        {hasDateHeader(index) && (
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">
              {getDayLabel(message)}
            </span>
          </div>
        )}
        <div className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[75%] sm:max-w-md rounded-xl px-3 py-2 sm:px-4 ${
              isMe
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-card text-card-foreground rounded-tl-none border border-border"
            }`}
          >
            {message.type === "file" ? (
              <div className="relative">
                <img
                  src={message.content}
                  alt="chat media"
                  className="w-full max-w-[280px] h-auto rounded-md object-cover"
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
              <p className="text-sm leading-relaxed break-words">
                {message.content}
              </p>
            )}
            <span
              className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                isMe ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}
            >
              {formatTime(message.time)}
              {isMe && (
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
  };

  const ChatHeader = ({ onBack }: { onBack?: () => void }) => {
    if (!selectedChat) return null;
    return (
      <div className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="relative">
              <ChatAvatar
                name={selectedChat.name}
                profilePicture={selectedChat.profilePicture}
              />
              {otherUserOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">
                {selectedChat.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {otherUserOnline ? "Online" : selectedChat.email}
              </p>
            </div>
          </div>

          {activeChatId && (
            <button
              onClick={handleToggleBlock}
              disabled={isBlockingAction || isBlockedByOther}
              title={
                isBlockedByOther
                  ? "You have been blocked"
                  : isBlockedByMe
                    ? "Unblock user"
                    : "Block user"
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isBlockingAction ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isBlockedByMe ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span>Unblock</span>
                </>
              ) : (
                <>
                  <ShieldBan className="w-3.5 h-3.5 text-destructive" />
                  <span>Block</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const MessagesArea = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 space-y-4">
      {isLoadingMessages && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {!isLoadingMessages && displayMessages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Start a conversation with {selectedChat?.name}.
        </p>
      )}
      {displayMessages.map((msg, idx) => (
        <MessageBubble key={msg.id} message={msg} index={idx} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* ── Left Sidebar: existing chats from Firebase ── */}
      <div className="w-full md:w-80 border-r border-border bg-background flex flex-col flex-shrink-0">
        <div className="sticky top-0 z-30 bg-background border-b border-border p-4">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingChats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredChats.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground px-4">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
          ) : (
            filteredChats.map((chat) => {
              const isMeBlocked = currentUser
                ? chat.blockedBy.includes(currentUser.uid)
                : false;
              const isOtherBlocked = chat.blockedBy.includes(chat.otherUserId);
              const chatIsBlocked = isMeBlocked || isOtherBlocked;

              return (
                <button
                  key={chat.chatId}
                  onClick={() => void handleSelectChat(chat)}
                  className={`w-full px-4 py-3 flex items-center gap-3 border-b border-border transition-all hover:bg-muted text-left ${
                    selectedChat?.chatId === chat.chatId ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <ChatAvatar
                      name={chat.name}
                      profilePicture={chat.profilePicture}
                    />
                    {/* Unread badge */}
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-medium text-sm truncate">
                        {chat.name}
                      </p>
                      {chat.timestamp && (
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {chat.timestamp.toDate().toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {chatIsBlocked && (
                        <ShieldBan className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      )}
                      <p
                        className={`text-xs truncate ${
                          chat.unreadCount > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatLastMessagePreview(chat)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Desktop: Right Chat Panel ── */}
      <div className="hidden md:flex md:flex-1 md:flex-col min-w-0">
        {selectedChat ? (
          <>
            <ChatHeader />
            <div className="flex-1 flex flex-col min-h-0">
              <MessagesArea />
              <MessageInput />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <p className="text-lg font-semibold text-muted-foreground mb-2">
                No conversation selected
              </p>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile: Full-screen Chat Overlay ── */}
      {selectedChat && (
        <div className="md:hidden absolute inset-0 bg-background z-20 flex flex-col">
          <ChatHeader onBack={() => setSelectedChat(null)} />
          <div className="flex-1 flex flex-col min-h-0">
            <MessagesArea />
            <MessageInput />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChat;
