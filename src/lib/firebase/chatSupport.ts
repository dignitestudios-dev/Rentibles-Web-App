import { auth, db } from "@/src/firebase/firebase";
import { axiosInstance } from "@/src/lib/axiosInstance";
import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";

export interface FireChatMessage {
  id: string;
  content: string;
  type: "text" | "file";
  senderUid: string;
  receiverId: string;
  isSeen: boolean;
  timeStamp: Timestamp | null;
  clientMessageId?: string;
}

export interface CurrentChatUser {
  uid: string;
  name: string;
  initials: string;
}

export const generateChatId = (uid1: string, uid2: string): string => {
  const ids = [uid1, uid2].sort();
  return ids.join("");
};

export const getCurrentChatUser = (): CurrentChatUser | null => {
  const authUser = auth.currentUser;
  const rawUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const parsedUser = rawUser ? JSON.parse(rawUser) : null;

  const uid = parsedUser?.uid || parsedUser?.firebaseUid || authUser?.uid;
  if (!uid) {
    return null;
  }

  const name = parsedUser?.name || authUser?.displayName || "You";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("") || "YU";

  return {
    uid,
    name,
    initials,
  };
};

export const resolveSupportChatId = async (
  currentUid: string,
  adminUid: string,
): Promise<string> => {
  const deterministicChatId = generateChatId(currentUid, adminUid);
  const deterministicSnap = await getDoc(doc(db, "chats", deterministicChatId));

  if (deterministicSnap.exists()) {
    return deterministicChatId;
  }

  const chatsQuery = query(
    collection(db, "chats"),
    where("users", "array-contains", currentUid),
    limit(50),
  );

  const chatsSnapshot = await getDocs(chatsQuery);
  const matchingChat = chatsSnapshot.docs.find((chatDoc) => {
    const users = (chatDoc.data().users as string[] | undefined) ?? [];
    return users.includes(adminUid);
  });

  return matchingChat?.id || deterministicChatId;
};

export const ensureChatRoom = async (
  chatId: string,
  users: string[],
): Promise<void> => {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      users,
      blockedBy: [],
      lastMessage: "",
      type: "text",
      timestamp: serverTimestamp(),
    });
  }
};

export const subscribeToMessages = (
  chatId: string,
  callback: (messages: FireChatMessage[]) => void,
): Unsubscribe => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const messagesQuery = query(messagesRef, orderBy("timeStamp", "asc"));

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages: FireChatMessage[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        content: data.content ?? "",
        type: data.type === "file" ? "file" : "text",
        senderUid: data.senderUid ?? "",
        receiverId: data.receiverId ?? "",
        isSeen: Boolean(data.isSeen),
        timeStamp: (data.timeStamp as Timestamp | undefined) ?? null,
        clientMessageId:
          typeof data.clientMessageId === "string"
            ? data.clientMessageId
            : undefined,
      };
    });

    callback(messages);
  });
};

export const subscribeToBlockedBy = (
  chatId: string,
  callback: (blockedBy: string[]) => void,
): Unsubscribe => {
  const chatRef = doc(db, "chats", chatId);
  return onSnapshot(chatRef, (snapshot) => {
    const blockedBy =
      (snapshot.data()?.blockedBy as string[] | undefined) ?? [];
    callback(blockedBy);
  });
};

export const sendChatMessage = async (params: {
  chatId: string;
  senderUid: string;
  receiverId: string;
  content: string;
  type: "text" | "file";
  clientMessageId?: string;
}): Promise<void> => {
  const { chatId, senderUid, receiverId, content, type, clientMessageId } =
    params;

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);
  const blockedBy = (chatSnap.data()?.blockedBy as string[] | undefined) ?? [];

  if (blockedBy.includes(senderUid)) {
    throw new Error("You cannot send messages to this user.");
  }

  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    content,
    type,
    timeStamp: serverTimestamp(),
    senderUid,
    receiverId,
    isSeen: false,
    clientMessageId: clientMessageId ?? null,
  });

  await setDoc(
    chatRef,
    {
      users: [senderUid, receiverId],
      blockedBy,
      lastMessage: type === "file" ? "📷 Photo" : content,
      type,
      timestamp: serverTimestamp(),
    },
    { merge: true },
  );
};

export const markMessagesAsSeen = async (
  chatId: string,
  currentUid: string,
): Promise<void> => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const unseenQuery = query(
    messagesRef,
    where("receiverId", "==", currentUid),
    where("isSeen", "==", false),
    limit(100),
  );

  const unseenSnapshot = await getDocs(unseenQuery);
  if (unseenSnapshot.empty) {
    return;
  }

  const batch = writeBatch(db);
  unseenSnapshot.forEach((messageDoc) => {
    batch.update(messageDoc.ref, { isSeen: true });
  });

  await batch.commit();
};

export const setUserOnlineStatus = async (
  uid: string,
  isOnline: boolean,
): Promise<void> => {
  await setDoc(
    doc(db, "status", uid),
    {
      isOnline,
      lastSeen: serverTimestamp(),
    },
    { merge: true },
  );
};

export const blockUserByChatId = async (
  chatId: string,
  uid: string,
): Promise<void> => {
  await updateDoc(doc(db, "chats", chatId), {
    blockedBy: arrayUnion(uid),
  });
};

export const unblockUserByChatId = async (
  chatId: string,
  uid: string,
): Promise<void> => {
  await updateDoc(doc(db, "chats", chatId), {
    blockedBy: arrayRemove(uid),
  });
};

export const uploadChatImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("media", file);

  const endpoint = "/global/upload";

  const { data } = await axiosInstance.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000,
  });

  const imageUrl =
    (typeof data === "string" && data) ||
    (typeof data?.data === "string" && data.data) ||
    (typeof data?.url === "string" && data.url);

  if (!imageUrl) {
    throw new Error("Image upload API did not return a valid file URL.");
  }

  return imageUrl;
};
