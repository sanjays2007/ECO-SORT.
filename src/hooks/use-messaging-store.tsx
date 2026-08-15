"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: "text" | "image" | "product-link";
  productId?: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  productId?: string;
  productTitle?: string;
  productImage?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  createdAt: Date;
}

interface MessagingState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  currentUserId: string;
  currentUserName: string;
}

interface MessagingContextType extends MessagingState {
  // Conversations
  getConversation: (id: string) => Conversation | undefined;
  getOrCreateConversation: (sellerId: string, sellerName: string, productId?: string, productTitle?: string, productImage?: string) => string;
  deleteConversation: (id: string) => void;
  
  // Messages
  getMessages: (conversationId: string) => Message[];
  sendMessage: (conversationId: string, content: string, type?: Message["type"], productId?: string) => void;
  markAsRead: (conversationId: string) => void;
  
  // Stats
  getTotalUnreadCount: () => number;
  
  // User
  setCurrentUser: (id: string, name: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

const STORAGE_KEY = "ecosort-messaging";

// Sample conversations for demo
const sampleConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [
      { id: "user-1", name: "You" },
      { id: "seller-1", name: "Green Crafts Chennai" },
    ],
    productId: "prod-1",
    productTitle: "Recycled Plastic Planter Set",
    productImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=100&h=100&fit=crop",
    lastMessage: "Yes, the planters are still available! Would you like to place an order?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "conv-2",
    participants: [
      { id: "user-1", name: "You" },
      { id: "seller-2", name: "Eco Electronics Hub" },
    ],
    productId: "prod-2",
    productTitle: "Refurbished Laptop Stand",
    lastMessage: "I can offer free shipping if you order today.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

const sampleMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "You",
      content: "Hi! I'm interested in the Recycled Plastic Planter Set. Is it still available?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      type: "text",
    },
    {
      id: "msg-1-2",
      conversationId: "conv-1",
      senderId: "seller-1",
      senderName: "Green Crafts Chennai",
      content: "Yes, the planters are still available! Would you like to place an order?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      type: "text",
    },
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      conversationId: "conv-2",
      senderId: "user-1",
      senderName: "You",
      content: "Hello, can you tell me more about the laptop stand?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
      type: "text",
    },
    {
      id: "msg-2-2",
      conversationId: "conv-2",
      senderId: "seller-2",
      senderName: "Eco Electronics Hub",
      content: "It's made from recycled aluminum and bamboo. Very sturdy and adjustable to 6 different heights.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      read: true,
      type: "text",
    },
    {
      id: "msg-2-3",
      conversationId: "conv-2",
      senderId: "user-1",
      senderName: "You",
      content: "That sounds great! What about shipping?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2),
      read: true,
      type: "text",
    },
    {
      id: "msg-2-4",
      conversationId: "conv-2",
      senderId: "seller-2",
      senderName: "Eco Electronics Hub",
      content: "I can offer free shipping if you order today.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      type: "text",
    },
  ],
};

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MessagingState>({
    conversations: [],
    messages: {},
    currentUserId: "user-1",
    currentUserName: "You",
  });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const conversations = parsed.conversations.map((c: any) => ({
          ...c,
          lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime) : undefined,
          createdAt: new Date(c.createdAt),
        }));
        const messages: Record<string, Message[]> = {};
        Object.entries(parsed.messages).forEach(([convId, msgs]: [string, any]) => {
          messages[convId] = msgs.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        });
        setState({
          ...parsed,
          conversations,
          messages,
        });
      } catch (e) {
        // Use sample data
        setState((prev) => ({
          ...prev,
          conversations: sampleConversations,
          messages: sampleMessages,
        }));
      }
    } else {
      // Use sample data for first time
      setState((prev) => ({
        ...prev,
        conversations: sampleConversations,
        messages: sampleMessages,
      }));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (state.conversations.length > 0 || Object.keys(state.messages).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const getConversation = useCallback((id: string) => {
    return state.conversations.find((c) => c.id === id);
  }, [state]);

  const getOrCreateConversation = useCallback(
    (
      sellerId: string,
      sellerName: string,
      productId?: string,
      productTitle?: string,
      productImage?: string
    ) => {
      // Check if conversation already exists
      const existing = state.conversations.find(
        (c) =>
          c.participants.some((p) => p.id === sellerId) &&
          (productId ? c.productId === productId : true)
      );

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participants: [
          { id: state.currentUserId, name: state.currentUserName },
          { id: sellerId, name: sellerName },
        ],
        productId,
        productTitle,
        productImage,
        unreadCount: 0,
        createdAt: new Date(),
      };

      setState((prev) => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
        messages: {
          ...prev.messages,
          [newConversation.id]: [],
        },
      }));

      return newConversation.id;
    },
    [state]
  );

  const deleteConversation = useCallback((id: string) => {
    setState((prev) => {
      const { [id]: removed, ...restMessages } = prev.messages;
      return {
        ...prev,
        conversations: prev.conversations.filter((c) => c.id !== id),
        messages: restMessages,
      };
    });
  }, []);

  const getMessages = useCallback((conversationId: string) => {
    return state.messages[conversationId] || [];
  }, [state]);

  const sendMessage = useCallback(
    (
      conversationId: string,
      content: string,
      type: Message["type"] = "text",
      productId?: string
    ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: state.currentUserId,
      senderName: state.currentUserName,
      content,
      timestamp: new Date(),
      read: true,
      type,
      productId,
    };

    setState((prev) => {
      const conversationMessages = prev.messages[conversationId] || [];
      const updatedConversations = prev.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : c
      );

      // Sort conversations by last message time
      updatedConversations.sort((a, b) => {
        const timeA = a.lastMessageTime?.getTime() || a.createdAt.getTime();
        const timeB = b.lastMessageTime?.getTime() || b.createdAt.getTime();
        return timeB - timeA;
      });

      return {
        ...prev,
        conversations: updatedConversations,
        messages: {
          ...prev.messages,
          [conversationId]: [...conversationMessages, newMessage],
        },
      };
    });

    // Simulate seller reply after a delay (demo purposes)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replies = [
          "Thanks for your message! I'll get back to you shortly.",
          "Great question! Let me check and respond soon.",
          "Noted! I'll confirm the details for you.",
          "Sure, I can help with that!",
        ];
        const replyContent = replies[Math.floor(Math.random() * replies.length)];
        const conversation = state.conversations.find((c) => c.id === conversationId);
        const seller = conversation?.participants.find((p) => p.id !== state.currentUserId);

        if (seller) {
          const replyMessage: Message = {
            id: `msg-${Date.now()}-reply`,
            conversationId,
            senderId: seller.id,
            senderName: seller.name,
            content: replyContent,
            timestamp: new Date(),
            read: false,
            type: "text",
          };

          setState((prev) => {
            const conversationMessages = prev.messages[conversationId] || [];
            const updatedConversations = prev.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: replyContent,
                    lastMessageTime: new Date(),
                    unreadCount: c.unreadCount + 1,
                  }
                : c
            );

            return {
              ...prev,
              conversations: updatedConversations,
              messages: {
                ...prev.messages,
                [conversationId]: [...conversationMessages, replyMessage],
              },
            };
          });
        }
      }, 2000 + Math.random() * 3000);
    }
  }, [state]);

  const markAsRead = useCallback((conversationId: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
      messages: {
        ...prev.messages,
        [conversationId]: (prev.messages[conversationId] || []).map((m) => ({
          ...m,
          read: true,
        })),
      },
    }));
  }, []);

  const getTotalUnreadCount = useCallback(() => {
    return state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }, [state]);

  const setCurrentUser = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      currentUserId: id,
      currentUserName: name,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      getConversation,
      getOrCreateConversation,
      deleteConversation,
      getMessages,
      sendMessage,
      markAsRead,
      getTotalUnreadCount,
      setCurrentUser,
    }),
    [
      state,
      getConversation,
      getOrCreateConversation,
      deleteConversation,
      getMessages,
      sendMessage,
      markAsRead,
      getTotalUnreadCount,
      setCurrentUser,
    ]
  );

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessagingStore() {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessagingStore must be used within a MessagingProvider");
  }
  return context;
}
