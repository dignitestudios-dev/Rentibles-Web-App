// data/mock-data.ts

import { Category, ProductRequest } from "@/src/types/index.type";

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics" },
  { id: "cat-2", name: "Clothing", slug: "clothing" },
  { id: "cat-3", name: "Home & Garden", slug: "home-garden" },
  { id: "cat-4", name: "Sports & Outdoors", slug: "sports-outdoors" },
  { id: "cat-5", name: "Books & Media", slug: "books-media" },
  { id: "cat-6", name: "Food & Beverages", slug: "food-beverages" },
  { id: "cat-7", name: "Health & Beauty", slug: "health-beauty" },
  { id: "cat-8", name: "Toys & Games", slug: "toys-games" },
];

export const mockProductRequests: ProductRequest[] = [
  {
    id: "req-1",
    productName: "iPhone 15 Pro Max",
    description:
      "Latest flagship smartphone with titanium design and A17 Pro chip. Looking for best price with warranty.",
    storeName: "Tech World Store",
    category: mockCategories[0],
    createdAt: new Date("2024-02-08T10:30:00"),
    status: "pending",
  },
  {
    id: "req-2",
    productName: "Nike Air Max 2024",
    description:
      "Premium running shoes with advanced cushioning technology. Size 10, preferably in black or white color.",
    storeName: "Sports Hub",
    category: mockCategories[3],
    createdAt: new Date("2024-02-07T14:20:00"),
    status: "pending",
  },
  {
    id: "req-3",
    productName: "Organic Green Tea",
    description:
      "High-quality organic green tea leaves from Japan. Looking for bulk purchase options.",
    storeName: "Healthy Living Market",
    category: mockCategories[5],
    createdAt: new Date("2024-02-06T09:15:00"),
    status: "approved",
  },
  {
    id: "req-4",
    productName: "Sony PlayStation 5",
    description:
      "Next-gen gaming console with disc drive. Bundle with extra controller preferred.",
    storeName: "Game Zone",
    category: mockCategories[0],
    createdAt: new Date("2024-02-05T16:45:00"),
    status: "pending",
  },
  {
    id: "req-5",
    productName: "The Psychology of Money",
    description:
      "Bestselling book by Morgan Housel. Hardcover edition preferred.",
    storeName: "Book Haven",
    category: mockCategories[4],
    createdAt: new Date("2024-02-04T11:30:00"),
    status: "pending",
  },
];
