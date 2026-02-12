const currentUser = {
  id: "user-1",
  name: "You",
  avatar: "",
  initials: "YU",
};

const adminUser = {
  id: "admin-1",
  name: "Admin",
  avatar: "",
  initials: "AD",
};

export const mockMessages = [
  {
    id: "1",
    senderId: adminUser.id,
    senderName: adminUser.name,
    senderAvatar: adminUser.initials,
    content: "Hello! How can I help you today?",
    timestamp: "12:20 AM",
    isCurrentUser: false,
  },
  {
    id: "2",
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.initials,
    content: "Hi! I have a question about my account.",
    timestamp: "12:28 AM",
    isCurrentUser: true,
  },
  {
    id: "3",
    senderId: adminUser.id,
    senderName: adminUser.name,
    senderAvatar: adminUser.initials,
    content: "Sure, I'd be happy to help! What would you like to know?",
    timestamp: "12:36 AM",
    isCurrentUser: false,
  },
  {
    id: "4",
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.initials,
    content: "Abc test 123",
    timestamp: "12:40 AM",
    isCurrentUser: true,
  },
];
