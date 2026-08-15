"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ProductCategory = 
  | "recycled-plastic" 
  | "upcycled-crafts" 
  | "refurbished-electronics"
  | "organic-compost"
  | "eco-fashion"
  | "pre-owned"
  | "other";

export type ProductCondition = "new" | "like-new" | "good" | "fair";
export type ProductStatus = "available" | "sold" | "reserved";
export type DeliveryOption = "pickup" | "shipping" | "both";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  images: string[];
  sellerName: string;
  sellerContact: string;
  sellerLocation: string;
  createdAt: string;
  views: number;
  tags: string[];
  isFeatured?: boolean;
  quantity: number;
  deliveryOption: DeliveryOption;
  shippingCost?: number;
  ecoImpactScore: number;
  reviews: Review[];
  averageRating: number;
  negotiable?: boolean;
}

export interface MarketplaceFilters {
  category: ProductCategory | "all";
  condition: ProductCondition | "all";
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  sortBy: "newest" | "oldest" | "price-low" | "price-high" | "popular" | "rating" | "eco-score";
  deliveryOption?: DeliveryOption;
  minRating?: number;
  negotiableOnly?: boolean;
}

export const categoryLabels: Record<ProductCategory, string> = {
  "recycled-plastic": "Recycled Plastic",
  "upcycled-crafts": "Upcycled Crafts",
  "refurbished-electronics": "Refurbished Electronics",
  "organic-compost": "Organic Compost",
  "eco-fashion": "Eco Fashion",
  "pre-owned": "Pre-owned Items",
  "other": "Other",
};

export const conditionLabels: Record<ProductCondition, string> = {
  "new": "New",
  "like-new": "Like New",
  "good": "Good",
  "fair": "Fair",
};

export const deliveryLabels: Record<DeliveryOption, string> = {
  "pickup": "Pickup Only",
  "shipping": "Shipping Only",
  "both": "Pickup & Shipping",
};

interface MarketplaceState {
  products: Product[];
  filters: MarketplaceFilters;
  wishlist: string[];
  cart: CartItem[];
  recentlyViewed: string[];
}

interface MarketplaceContextType extends MarketplaceState {
  // Products
  addProduct: (product: Omit<Product, "id" | "createdAt" | "views" | "reviews" | "averageRating">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  incrementViews: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<MarketplaceFilters>) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  
  // Wishlist
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistProducts: Product[];
  
  // Cart
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  cartProducts: { product: Product; quantity: number }[];
  
  // Reviews
  addReview: (productId: string, review: Omit<Review, "id" | "productId" | "createdAt" | "helpful">) => void;
  markReviewHelpful: (productId: string, reviewId: string) => void;
  
  // Recently Viewed
  recentlyViewedProducts: Product[];
}

const defaultFilters: MarketplaceFilters = {
  category: "all",
  condition: "all",
  minPrice: 0,
  maxPrice: 10000,
  searchQuery: "",
  sortBy: "newest",
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_KEY = "ecosort-marketplace";

// Sample products
const sampleProducts: Product[] = [
  {
    id: "prod-1",
    title: "Recycled Plastic Planter Set",
    description: "Beautiful set of 3 planters made from 100% recycled ocean plastic. Each planter is unique and helps reduce ocean pollution. Perfect for indoor plants and succulents.",
    price: 899,
    originalPrice: 1299,
    category: "recycled-plastic",
    condition: "new",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=500&fit=crop",
    ],
    sellerName: "Green Crafts Chennai",
    sellerContact: "greencrafts@email.com",
    sellerLocation: "Chennai, TN",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    views: 156,
    tags: ["eco-friendly", "handmade", "ocean-plastic", "planters"],
    isFeatured: true,
    quantity: 15,
    deliveryOption: "both",
    shippingCost: 99,
    ecoImpactScore: 92,
    reviews: [
      {
        id: "rev-1",
        productId: "prod-1",
        userId: "user-2",
        userName: "Priya M",
        rating: 5,
        comment: "Absolutely love these planters! Great quality and knowing they're made from ocean plastic makes it even better.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        helpful: 12,
      },
    ],
    averageRating: 5,
    negotiable: false,
  },
  {
    id: "prod-2",
    title: "Refurbished Laptop Stand - Bamboo",
    description: "Ergonomic laptop stand made from sustainable bamboo and recycled aluminum. Adjustable to 6 heights. Helps reduce neck strain while working.",
    price: 1499,
    originalPrice: 2499,
    category: "refurbished-electronics",
    condition: "like-new",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    ],
    sellerName: "Eco Electronics Hub",
    sellerContact: "+91 98765 43210",
    sellerLocation: "Bangalore, KA",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    views: 89,
    tags: ["laptop-stand", "bamboo", "ergonomic", "sustainable"],
    isFeatured: true,
    quantity: 8,
    deliveryOption: "shipping",
    shippingCost: 0,
    ecoImpactScore: 78,
    reviews: [
      {
        id: "rev-2",
        productId: "prod-2",
        userId: "user-3",
        userName: "Rahul K",
        rating: 4,
        comment: "Good quality stand. Shipping was fast and it was well packaged.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        helpful: 5,
      },
    ],
    averageRating: 4,
    negotiable: true,
  },
  {
    id: "prod-3",
    title: "Upcycled Denim Tote Bag",
    description: "Handcrafted tote bag made from upcycled denim jeans. Spacious main compartment with inner pockets. Each bag is one-of-a-kind!",
    price: 599,
    category: "eco-fashion",
    condition: "new",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&h=500&fit=crop",
    ],
    sellerName: "Stitch & Save",
    sellerContact: "stitchsave@email.com",
    sellerLocation: "Mumbai, MH",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    views: 234,
    tags: ["tote-bag", "upcycled", "denim", "handmade"],
    isFeatured: false,
    quantity: 25,
    deliveryOption: "both",
    shippingCost: 49,
    ecoImpactScore: 88,
    reviews: [],
    averageRating: 0,
    negotiable: true,
  },
  {
    id: "prod-4",
    title: "Organic Vermicompost - 5kg",
    description: "Premium quality vermicompost made from organic kitchen waste. Rich in nutrients, perfect for home gardens and potted plants.",
    price: 299,
    category: "organic-compost",
    condition: "new",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop",
    ],
    sellerName: "Urban Composters",
    sellerContact: "urbancompost@email.com",
    sellerLocation: "Delhi, DL",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    views: 67,
    tags: ["compost", "organic", "gardening", "vermicompost"],
    isFeatured: false,
    quantity: 50,
    deliveryOption: "pickup",
    ecoImpactScore: 95,
    reviews: [
      {
        id: "rev-3",
        productId: "prod-4",
        userId: "user-4",
        userName: "Anita S",
        rating: 5,
        comment: "My plants are thriving with this compost! Will definitely buy again.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        helpful: 8,
      },
    ],
    averageRating: 5,
    negotiable: false,
  },
  {
    id: "prod-5",
    title: "Pre-owned Kindle Paperwhite",
    description: "Well-maintained Kindle Paperwhite (2021 model). Includes original charger and a leather case. Battery life is excellent.",
    price: 6999,
    originalPrice: 13999,
    category: "pre-owned",
    condition: "good",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
    ],
    sellerName: "Tech Resale",
    sellerContact: "+91 87654 32109",
    sellerLocation: "Hyderabad, TS",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    views: 312,
    tags: ["kindle", "e-reader", "pre-owned", "electronics"],
    isFeatured: true,
    quantity: 1,
    deliveryOption: "shipping",
    shippingCost: 0,
    ecoImpactScore: 72,
    reviews: [],
    averageRating: 0,
    negotiable: true,
  },
];

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MarketplaceState>({
    products: [],
    filters: defaultFilters,
    wishlist: [],
    cart: [],
    recentlyViewed: [],
  });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState({
          ...parsed,
          filters: { ...defaultFilters, ...parsed.filters },
        });
      } catch (e) {
        setState((prev) => ({ ...prev, products: sampleProducts }));
      }
    } else {
      setState((prev) => ({ ...prev, products: sampleProducts }));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (state.products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Product operations
  const addProduct = (product: Omit<Product, "id" | "createdAt" | "views" | "reviews" | "averageRating">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      reviews: [],
      averageRating: 0,
    };
    setState((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
    }));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  };

  const deleteProduct = (id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const getProduct = (id: string) => {
    return state.products.find((p) => p.id === id);
  };

  const incrementViews = (id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, views: p.views + 1 } : p
      ),
      recentlyViewed: [id, ...prev.recentlyViewed.filter((vid) => vid !== id)].slice(0, 10),
    }));
  };

  // Filter operations
  const setFilters = (newFilters: Partial<MarketplaceFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  };

  const resetFilters = () => {
    setState((prev) => ({
      ...prev,
      filters: defaultFilters,
    }));
  };

  // Compute filtered products
  const filteredProducts = React.useMemo(() => {
    let result = [...state.products];

    // Category filter
    if (state.filters.category !== "all") {
      result = result.filter((p) => p.category === state.filters.category);
    }

    // Condition filter
    if (state.filters.condition !== "all") {
      result = result.filter((p) => p.condition === state.filters.condition);
    }

    // Delivery option filter
    if (state.filters.deliveryOption) {
      result = result.filter((p) => 
        p.deliveryOption === state.filters.deliveryOption || p.deliveryOption === "both"
      );
    }

    // Rating filter
    if (state.filters.minRating && state.filters.minRating > 0) {
      result = result.filter((p) => p.averageRating >= (state.filters.minRating || 0));
    }

    // Negotiable filter
    if (state.filters.negotiableOnly) {
      result = result.filter((p) => p.negotiable);
    }

    // Price range filter
    result = result.filter(
      (p) => p.price >= state.filters.minPrice && p.price <= state.filters.maxPrice
    );

    // Search query filter
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (state.filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      case "rating":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "eco-score":
        result.sort((a, b) => b.ecoImpactScore - a.ecoImpactScore);
        break;
    }

    return result;
  }, [state.products, state.filters]);

  // Wishlist operations
  const addToWishlist = (productId: string) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.includes(productId)
        ? prev.wishlist
        : [...prev.wishlist, productId],
    }));
  };

  const removeFromWishlist = (productId: string) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((id) => id !== productId),
    }));
  };

  const isInWishlist = (productId: string) => {
    return state.wishlist.includes(productId);
  };

  const wishlistProducts = state.products.filter((p) =>
    state.wishlist.includes(p.id)
  );

  // Cart operations
  const addToCart = (productId: string, quantity = 1) => {
    setState((prev) => {
      const existing = prev.cart.find((item) => item.productId === productId);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        ...prev,
        cart: [...prev.cart, { productId, quantity, addedAt: new Date().toISOString() }],
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.productId !== productId),
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setState((prev) => ({ ...prev, cart: [] }));
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => {
      const product = state.products.find((p) => p.id === item.productId);
      if (product) {
        return total + product.price * item.quantity + (product.shippingCost || 0);
      }
      return total;
    }, 0);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const cartProducts = state.cart
    .map((item) => {
      const product = state.products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((item): item is { product: Product; quantity: number } => item !== null);

  // Review operations
  const addReview = (
    productId: string,
    review: Omit<Review, "id" | "productId" | "createdAt" | "helpful">
  ) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      productId,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.id === productId) {
          const newReviews = [...p.reviews, newReview];
          const avgRating =
            newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
          return { ...p, reviews: newReviews, averageRating: avgRating };
        }
        return p;
      }),
    }));
  };

  const markReviewHelpful = (productId: string, reviewId: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            reviews: p.reviews.map((r) =>
              r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
            ),
          };
        }
        return p;
      }),
    }));
  };

  const recentlyViewedProducts = state.recentlyViewed
    .map((id) => state.products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  return (
    <MarketplaceContext.Provider
      value={{
        ...state,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        incrementViews,
        setFilters,
        resetFilters,
        filteredProducts,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistProducts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        cartProducts,
        addReview,
        markReviewHelpful,
        recentlyViewedProducts,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceStore() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplaceStore must be used within a MarketplaceProvider");
  }
  return context;
}
