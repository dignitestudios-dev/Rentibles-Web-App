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
  Search,
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

type ChatUser = {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
};

const UserChat = () => {
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
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isBlockedByOther = useMemo(
    () => (selectedUser ? blockedBy.includes(selectedUser._id) : false),
    [blockedBy, selectedUser],
  );

  const isBlocked = isBlockedByOther;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

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
    if (!content || !activeSenderUid || !activeChatId || !selectedUser) return;

    if (isBlocked) {
      ErrorToast("You cannot send messages to this user.");
      return;
    }

    try {
      setIsSending(true);
      await sendChatMessage({
        chatId: activeChatId,
        senderUid: activeSenderUid,
        receiverId: selectedUser._id,
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

    if (!file || !activeSenderUid || !activeChatId || !selectedUser) return;
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
      receiverId: selectedUser._id,
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
        receiverId: selectedUser._id,
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

  // Fetch users list (you may need to adjust based on your API)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // TODO: Replace with actual API call
        // For now, using dummy data - adjust endpoint as needed
        const response = await fetch("/api/users"); // adjust endpoint
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data || []);
        } else {
          // Fallback if no API endpoint available
          setUsers([]);
        }
      } catch (error) {
        console.log("Using empty user list");
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentUser(getCurrentChatUser());
  }, []);

  const handleSelectUser = async (user: ChatUser) => {
    setSelectedUser(user);
    setMessages([]);
    setMessageInput("");
    setOptimisticImages([]);
    setIsLoadingMessages(true);

    try {
      const resolvedChatId = await resolveSupportChatId(
        currentUser?.uid || "",
        user._id,
      );

      setActiveChatId(resolvedChatId);
      setActiveSenderUid(currentUser?.uid || "");

      await ensureChatRoom(resolvedChatId, [currentUser?.uid || "", user._id]);

      const unsubscribeMessages = subscribeToMessages(
        resolvedChatId,
        (items) => {
          setMessages(items);
          setIsLoadingMessages(false);
          void markMessagesAsSeen(resolvedChatId, currentUser?.uid || "");
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
    } catch (error) {
      setIsLoadingMessages(false);
      const message =
        error instanceof Error
          ? `Failed to load chat: ${error.message}`
          : "Failed to load chat";
      ErrorToast(message);
    }
  };

  useEffect(() => {
    if (!currentUser?.uid || !selectedUser) return;

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
  }, [currentUser?.uid, selectedUser]);

  const cleanupRefs = useRef<() => void>(() => undefined);

  const blockMessage = "You have been blocked by this user.";

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Left Sidebar - Users List */}
      <div className="w-full md:w-80 border-r border-border bg-background flex flex-col">
        <div className="sticky top-0 z-30 bg-background border-b border-border p-4">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {searchQuery ? "No users found" : "No users available"}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`w-full px-4 py-3 flex items-center gap-3 border-b border-border transition-all hover:bg-muted ${
                  selectedUser?._id === user._id ? "bg-primary/10" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="hidden md:flex md:flex-1 md:flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="sticky top-0 z-30 bg-background border-b border-border">
              <div className="flex items-center justify-between px-4 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                    {selectedUser.profilePicture ? (
                      <img
                        src={selectedUser.profilePicture}
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                        {selectedUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">
                      {selectedUser.name}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-muted rounded-md transition-colors md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 space-y-4">
                {isLoadingMessages && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Loading chat...
                  </p>
                )}

                {!isLoadingMessages && displayMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Start a conversation with {selectedUser.name}.
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

              {/* Message Input */}
              <div className="sticky bottom-0 z-30 bg-background border-t border-border p-3 sm:p-4">
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <p className="text-lg font-semibold text-muted-foreground mb-2">
                No conversation selected
              </p>
              <p className="text-sm text-muted-foreground">
                Choose a user from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Chat View */}
      {selectedUser && (
        <div className="md:hidden absolute inset-0 bg-background z-20 flex flex-col">
          {/* Chat Header */}
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 py-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-lg font-semibold">{selectedUser.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>
              <div className="w-10" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
              {isLoadingMessages && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Loading chat...
                </p>
              )}

              {!isLoadingMessages && displayMessages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Start a conversation with {selectedUser.name}.
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
                        className={`max-w-[75%] rounded-xl px-3 py-2 ${
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
                              className="w-full h-auto rounded-md object-cover"
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

            {/* Message Input */}
            <div className="sticky bottom-0 z-30 bg-background border-t border-border p-3">
              {isBlocked && (
                <p className="text-sm text-center text-muted-foreground mb-3">
                  {blockMessage}
                </p>
              )}

              <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3 py-2 text-sm bg-transparent rounded-lg focus:outline-none focus:ring-none transition-all"
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
                  className="w-9 h-9 cursor-pointer text-primary rounded-lg flex items-center justify-center hover:bg-primary/10 disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
                  aria-label="Send image"
                >
                  <Camera className="w-5 h-5" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isBlocked || isSending}
                  className="w-9 h-9 cursor-pointer bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChat;
