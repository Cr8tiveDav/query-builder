// Mock Datasets for visual query execution simulator

export interface UserRecord {
  id: string;
  name: string;
  age: number;
  status: "active" | "inactive" | "pending";
  country: string;
  purchases: number;
  createdAt: string;
  isActive: boolean;
}

export interface ProductRecord {
  id: string;
  title: string;
  price: number;
  category: "electronics" | "clothing" | "books" | "food";
  stock: number;
  rating: number;
  releaseDate: string;
  isFeatured: boolean;
}

export interface LogRecord {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  statusCode: number;
  serviceName: string;
  ipAddress: string;
  timestamp: string;
}

export const MOCK_USERS: UserRecord[] = [
  { id: "u-1", name: "Chinedu Okafor", age: 24, status: "active", country: "Nigeria", purchases: 15, createdAt: "2026-01-15", isActive: true },
  { id: "u-2", name: "Jane Smith", age: 17, status: "pending", country: "United Kingdom", purchases: 0, createdAt: "2026-03-22", isActive: false },
  { id: "u-3", name: "David Miller", age: 34, status: "active", country: "United States", purchases: 45, createdAt: "2025-11-05", isActive: true },
  { id: "u-4", name: "Amina Yusuf", age: 19, status: "active", country: "Nigeria", purchases: 8, createdAt: "2026-02-10", isActive: true },
  { id: "u-5", name: "Jean Dupont", age: 29, status: "inactive", country: "France", purchases: 12, createdAt: "2025-08-30", isActive: false },
  { id: "u-6", name: "Yuki Tanaka", age: 42, status: "active", country: "Japan", purchases: 89, createdAt: "2025-04-12", isActive: true },
  { id: "u-7", name: "Carlos Gomez", age: 16, status: "pending", country: "Spain", purchases: 2, createdAt: "2026-05-01", isActive: true },
  { id: "u-8", name: "Chioma Adebayo", age: 28, status: "active", country: "Nigeria", purchases: 34, createdAt: "2025-12-25", isActive: true },
  { id: "u-9", name: "John Doe", age: 31, status: "inactive", country: "United States", purchases: 5, createdAt: "2025-09-18", isActive: false },
  { id: "u-10", name: "Sarah Connor", age: 45, status: "active", country: "United States", purchases: 110, createdAt: "2025-01-20", isActive: true },
  { id: "u-11", name: "Emeka Obi", age: 22, status: "active", country: "Nigeria", purchases: 11, createdAt: "2026-04-18", isActive: true },
  { id: "u-12", name: "Emily Watson", age: 18, status: "active", country: "United Kingdom", purchases: 18, createdAt: "2026-02-28", isActive: true },
  { id: "u-13", name: "Kofi Mensah", age: 26, status: "pending", country: "Ghana", purchases: 1, createdAt: "2026-05-15", isActive: false },
  { id: "u-14", name: "Liam Wilson", age: 38, status: "active", country: "Canada", purchases: 54, createdAt: "2025-10-10", isActive: true },
  { id: "u-15", name: "Fatima Al-Sayed", age: 23, status: "active", country: "Egypt", purchases: 20, createdAt: "2026-01-08", isActive: true },
  { id: "u-16", name: "Lucas Silva", age: 27, status: "inactive", country: "Brazil", purchases: 4, createdAt: "2025-07-22", isActive: false },
  { id: "u-17", name: "Ngozi Eze", age: 15, status: "pending", country: "Nigeria", purchases: 0, createdAt: "2026-05-20", isActive: false },
  { id: "u-18", name: "Sophia Martinez", age: 33, status: "active", country: "Mexico", purchases: 32, createdAt: "2025-11-14", isActive: true },
  { id: "u-19", name: "Oliver Brown", age: 21, status: "active", country: "United Kingdom", purchases: 14, createdAt: "2026-03-05", isActive: true },
  { id: "u-20", name: "Tunde Bakare", age: 35, status: "active", country: "Nigeria", purchases: 78, createdAt: "2025-05-30", isActive: true },
  { id: "u-21", name: "Anna Schmidt", age: 50, status: "active", country: "Germany", purchases: 95, createdAt: "2025-02-14", isActive: true },
  { id: "u-22", name: "Harry Potter", age: 17, status: "inactive", country: "United Kingdom", purchases: 12, createdAt: "2025-06-30", isActive: false },
  { id: "u-23", name: "Elena Petrova", age: 29, status: "active", country: "Russia", purchases: 22, createdAt: "2025-12-01", isActive: true },
  { id: "u-24", name: "Olumide Sowore", age: 41, status: "active", country: "Nigeria", purchases: 120, createdAt: "2025-03-15", isActive: true },
  { id: "u-25", name: "William Taylor", age: 30, status: "pending", country: "Australia", purchases: 3, createdAt: "2026-04-30", isActive: true },
  { id: "u-26", name: "Chloe Dupont", age: 25, status: "active", country: "France", purchases: 41, createdAt: "2025-10-24", isActive: true },
  { id: "u-27", name: "Babajide Sanwo", age: 56, status: "active", country: "Nigeria", purchases: 210, createdAt: "2025-01-01", isActive: true },
  { id: "u-28", name: "Grace Hopper", age: 85, status: "inactive", country: "United States", purchases: 150, createdAt: "2024-12-09", isActive: false },
  { id: "u-29", name: "Ali Hassan", age: 19, status: "pending", country: "Saudi Arabia", purchases: 0, createdAt: "2026-05-18", isActive: false },
  { id: "u-30", name: "James Bond", age: 40, status: "active", country: "United Kingdom", purchases: 507, createdAt: "2025-01-07", isActive: true },
  { id: "u-31", name: "Uche Okeke", age: 20, status: "active", country: "Nigeria", purchases: 7, createdAt: "2026-03-10", isActive: true },
  { id: "u-32", name: "Marie Curie", age: 67, status: "inactive", country: "Poland", purchases: 15, createdAt: "2025-03-03", isActive: false },
  { id: "u-33", name: "Kenji Sato", age: 37, status: "active", country: "Japan", purchases: 48, createdAt: "2025-10-09", isActive: true },
  { id: "u-34", name: "Bosede Balogun", age: 32, status: "active", country: "Nigeria", purchases: 19, createdAt: "2025-11-20", isActive: true },
  { id: "u-35", name: "Mia Rossi", age: 28, status: "active", country: "Italy", purchases: 36, createdAt: "2025-12-12", isActive: true },
  { id: "u-36", name: "Hans Müller", age: 46, status: "inactive", country: "Germany", purchases: 8, createdAt: "2025-09-01", isActive: false },
  { id: "u-37", name: "Damilola Cole", age: 18, status: "pending", country: "Nigeria", purchases: 1, createdAt: "2026-05-25", isActive: true },
  { id: "u-38", name: "Charlotte Green", age: 22, status: "active", country: "Canada", purchases: 27, createdAt: "2026-01-22", isActive: true },
  { id: "u-39", name: "Arjun Mehta", age: 31, status: "active", country: "India", purchases: 64, createdAt: "2025-08-15", isActive: true },
  { id: "u-40", name: "Funmi Adeoyin", age: 43, status: "active", country: "Nigeria", purchases: 98, createdAt: "2025-06-11", isActive: true },
  { id: "u-41", name: "Noah Carter", age: 24, status: "inactive", country: "New Zealand", purchases: 11, createdAt: "2025-09-29", isActive: false },
  { id: "u-42", name: "Isabella Silva", age: 30, status: "active", country: "Brazil", purchases: 43, createdAt: "2025-11-01", isActive: true },
  { id: "u-43", name: "Efe Ambrose", age: 27, status: "active", country: "Nigeria", purchases: 26, createdAt: "2025-12-08", isActive: true },
  { id: "u-44", name: "Sophia Loren", age: 80, status: "inactive", country: "Italy", purchases: 30, createdAt: "2025-04-04", isActive: false },
  { id: "u-45", name: "Chen Wei", age: 36, status: "active", country: "China", purchases: 74, createdAt: "2025-09-12", isActive: true },
  { id: "u-46", name: "Oluwaseun Ajayi", age: 21, status: "pending", country: "Nigeria", purchases: 2, createdAt: "2026-04-12", isActive: true },
  { id: "u-47", name: "Leo Tolstoy", age: 82, status: "inactive", country: "Russia", purchases: 18, createdAt: "2025-02-28", isActive: false },
  { id: "u-48", name: "Fatima Bello", age: 30, status: "active", country: "Nigeria", purchases: 52, createdAt: "2025-10-30", isActive: true },
  { id: "u-49", name: "Thomas Jefferson", age: 50, status: "inactive", country: "United States", purchases: 40, createdAt: "2025-07-04", isActive: false },
  { id: "u-50", name: "Kelechi Iheanacho", age: 29, status: "active", country: "Nigeria", purchases: 83, createdAt: "2025-05-25", isActive: true }
];

export const MOCK_PRODUCTS: ProductRecord[] = [
  { id: "p-1", title: "Wireless Noise-Cancelling Headphones", price: 149.99, category: "electronics", stock: 120, rating: 4.6, releaseDate: "2025-10-12", isFeatured: true },
  { id: "p-2", title: "Organic Cotton Crewneck T-Shirt", price: 24.50, category: "clothing", stock: 450, rating: 4.2, releaseDate: "2026-01-20", isFeatured: false },
  { id: "p-3", title: "Introduction to Algorithms, 4th Ed", price: 89.99, category: "books", stock: 85, rating: 4.8, releaseDate: "2022-04-05", isFeatured: true },
  { id: "p-4", title: "Extra Virgin Olive Oil 500ml", price: 15.99, category: "food", stock: 200, rating: 4.5, releaseDate: "2025-11-18", isFeatured: false },
  { id: "p-5", title: "Smart Watch Series 5", price: 299.00, category: "electronics", stock: 45, rating: 4.3, releaseDate: "2025-09-01", isFeatured: true },
  { id: "p-6", title: "Slim Fit Stretch Chino Pants", price: 49.99, category: "clothing", stock: 150, rating: 4.0, releaseDate: "2025-08-15", isFeatured: false },
  { id: "p-7", title: "The Hobbit by J.R.R. Tolkien", price: 14.99, category: "books", stock: 320, rating: 4.9, releaseDate: "2021-09-21", isFeatured: true },
  { id: "p-8", title: "Gluten-Free Almond Granola 1kg", price: 12.49, category: "food", stock: 110, rating: 4.1, releaseDate: "2026-02-10", isFeatured: false },
  { id: "p-9", title: "Mechanical Gaming Keyboard", price: 79.99, category: "electronics", stock: 95, rating: 4.4, releaseDate: "2025-12-05", isFeatured: false },
  { id: "p-10", title: "Waterproof Winter Parka Jacket", price: 189.50, category: "clothing", stock: 35, rating: 4.7, releaseDate: "2025-10-30", isFeatured: true },
  { id: "p-11", title: "Clean Code by Robert C. Martin", price: 34.99, category: "books", stock: 140, rating: 4.8, releaseDate: "2008-08-01", isFeatured: true },
  { id: "p-12", title: "Organic Matcha Green Tea Powder", price: 19.99, category: "food", stock: 180, rating: 4.6, releaseDate: "2026-03-15", isFeatured: true },
  { id: "p-13", title: "4K Ultra HD LED Projector", price: 549.99, category: "electronics", stock: 12, rating: 4.2, releaseDate: "2025-06-25", isFeatured: true },
  { id: "p-14", title: "Unisex Canvas Slip-on Sneakers", price: 39.99, category: "clothing", stock: 240, rating: 3.9, releaseDate: "2025-05-18", isFeatured: false },
  { id: "p-15", title: "Sapiens: A Brief History of Humankind", price: 18.00, category: "books", stock: 280, rating: 4.7, releaseDate: "2015-02-10", isFeatured: false },
  { id: "p-16", title: "Dark Chocolate Almond Milk 1L", price: 4.99, category: "food", stock: 350, rating: 4.3, releaseDate: "2026-04-01", isFeatured: false },
  { id: "p-17", title: "Ergonomic Office Desk Chair", price: 229.00, category: "clothing", stock: 28, rating: 4.1, releaseDate: "2025-03-12", isFeatured: true },
  { id: "p-18", title: "10.2-inch iPad 64GB Wi-Fi", price: 329.00, category: "electronics", stock: 60, rating: 4.7, releaseDate: "2024-09-24", isFeatured: true },
  { id: "p-19", title: "Atomic Habits by James Clear", price: 16.20, category: "books", stock: 500, rating: 4.9, releaseDate: "2018-10-16", isFeatured: true },
  { id: "p-20", title: "Raw Honey Organic 500g", price: 9.50, category: "food", stock: 160, rating: 4.4, releaseDate: "2025-07-04", isFeatured: false },
  { id: "p-21", title: "USB-C Multi-Port Hub Adapter", price: 35.99, category: "electronics", stock: 190, rating: 4.2, releaseDate: "2025-11-05", isFeatured: false },
  { id: "p-22", title: "Denim Trucker Jacket Classic", price: 69.99, category: "clothing", stock: 80, rating: 4.3, releaseDate: "2025-04-12", isFeatured: false },
  { id: "p-23", title: "Designing Data-Intensive Applications", price: 49.99, category: "books", stock: 75, rating: 4.9, releaseDate: "2017-03-16", isFeatured: true },
  { id: "p-24", title: "Spicy Sriracha Chili Sauce 480ml", price: 6.49, category: "food", stock: 300, rating: 4.5, releaseDate: "2025-12-10", isFeatured: false },
  { id: "p-25", title: "Bluetooth Portable Speaker Waterproof", price: 59.99, category: "electronics", stock: 145, rating: 4.5, releaseDate: "2025-07-22", isFeatured: true },
  { id: "p-26", title: "Pack of 3 Cotton Ankle Socks", price: 12.99, category: "clothing", stock: 600, rating: 4.1, releaseDate: "2026-01-05", isFeatured: false },
  { id: "p-27", title: "Thinking, Fast and Slow", price: 17.00, category: "books", stock: 190, rating: 4.6, releaseDate: "2011-10-25", isFeatured: false },
  { id: "p-28", title: "Organic Quinoa Grain 1kg", price: 8.99, category: "food", stock: 140, rating: 4.2, releaseDate: "2026-02-14", isFeatured: false },
  { id: "p-29", title: "Active Noise-Cancelling Earbuds", price: 99.99, category: "electronics", stock: 85, rating: 4.3, releaseDate: "2025-09-18", isFeatured: false },
  { id: "p-30", title: "Fleece Hooded Sweatshirt Pullover", price: 39.99, category: "clothing", stock: 220, rating: 4.4, releaseDate: "2025-10-10", isFeatured: true },
  { id: "p-31", title: "Zero to One by Peter Thiel", price: 15.00, category: "books", stock: 210, rating: 4.5, releaseDate: "2014-09-16", isFeatured: false },
  { id: "p-32", title: "Roasted Salted Pistachios 500g", price: 11.99, category: "food", stock: 170, rating: 4.6, releaseDate: "2025-11-20", isFeatured: false },
  { id: "p-33", title: "Smart LED Light Bulb RGB", price: 21.99, category: "electronics", stock: 320, rating: 4.1, releaseDate: "2025-05-30", isFeatured: false },
  { id: "p-34", title: "Yoga Pants High Waisted", price: 29.99, category: "clothing", stock: 180, rating: 4.5, releaseDate: "2025-08-30", isFeatured: false },
  { id: "p-35", title: "Educated: A Memoir by Tara Westover", price: 16.99, category: "books", stock: 150, rating: 4.7, releaseDate: "2018-02-20", isFeatured: true },
  { id: "p-36", title: "Ground Coffee Medium Roast 500g", price: 8.49, category: "food", stock: 250, rating: 4.5, releaseDate: "2026-03-10", isFeatured: false },
  { id: "p-37", title: "Wireless Optical Mouse 2.4G", price: 18.99, category: "electronics", stock: 400, rating: 4.0, releaseDate: "2025-04-18", isFeatured: false },
  { id: "p-38", title: "Leather Bi-Fold Wallet with RFID Block", price: 27.50, category: "clothing", stock: 130, rating: 4.5, releaseDate: "2025-09-29", isFeatured: false },
  { id: "p-39", title: "Guns, Germs, and Steel by Jared Diamond", price: 19.99, category: "books", stock: 95, rating: 4.4, releaseDate: "1997-03-01", isFeatured: false },
  { id: "p-40", title: "Sparkling Water Lemon Pack of 12", price: 6.99, category: "food", stock: 280, rating: 4.3, releaseDate: "2026-04-12", isFeatured: false },
  { id: "p-41", title: "External Solid State Drive 1TB", price: 119.99, category: "electronics", stock: 50, rating: 4.8, releaseDate: "2025-08-28", isFeatured: true },
  { id: "p-42", title: "Runners Athletic Sports Shoes", price: 85.00, category: "clothing", stock: 90, rating: 4.2, releaseDate: "2025-11-01", isFeatured: true },
  { id: "p-43", title: "Man's Search for Meaning", price: 12.50, category: "books", stock: 330, rating: 4.9, releaseDate: "2006-06-01", isFeatured: true },
  { id: "p-44", title: "Instant Oatmeal Variety Pack of 24", price: 14.29, category: "food", stock: 150, rating: 4.1, releaseDate: "2026-01-22", isFeatured: false },
  { id: "p-45", title: "Graphic T-Shirt Vintage Print", price: 19.99, category: "clothing", stock: 170, rating: 4.0, releaseDate: "2026-02-28", isFeatured: false },
  { id: "p-46", title: "1080p Web Camera with Microphone", price: 45.00, category: "electronics", stock: 110, rating: 4.3, releaseDate: "2024-12-15", isFeatured: false },
  { id: "p-47", title: "The Lean Startup by Eric Ries", price: 21.99, category: "books", stock: 125, rating: 4.5, releaseDate: "2011-09-13", isFeatured: false },
  { id: "p-48", title: "Peanut Butter Creamy 1kg", price: 7.99, category: "food", stock: 190, rating: 4.7, releaseDate: "2025-10-30", isFeatured: false },
  { id: "p-49", title: "Dual Monitor Desk Arm Stand", price: 69.99, category: "electronics", stock: 40, rating: 4.5, releaseDate: "2025-07-04", isFeatured: false },
  { id: "p-50", title: "Merino Wool Hiking Socks Pack of 2", price: 24.99, category: "clothing", stock: 160, rating: 4.8, releaseDate: "2025-11-14", isFeatured: true }
];

export const MOCK_LOGS: LogRecord[] = [
  { id: "l-1", level: "info", message: "User authentication successful for chinedu@hng.tech", statusCode: 200, serviceName: "auth-service", ipAddress: "192.168.1.105", timestamp: "2026-06-02T08:12:00" },
  { id: "l-2", level: "warn", message: "Database connection pool approaching max limits (82% usage)", statusCode: 200, serviceName: "db-service", ipAddress: "10.0.0.15", timestamp: "2026-06-02T08:10:45" },
  { id: "l-3", level: "error", message: "Failed to process payment transaction for txn_8471b", statusCode: 500, serviceName: "payment-service", ipAddress: "192.168.1.200", timestamp: "2026-06-02T08:08:12" },
  { id: "l-4", level: "info", message: "Successfully synced inventory counts with warehouse B", statusCode: 200, serviceName: "inventory-service", ipAddress: "10.0.1.5", timestamp: "2026-06-02T07:55:00" },
  { id: "l-5", level: "debug", message: "Fetching user profile parameters for id=u-1", statusCode: 200, serviceName: "user-service", ipAddress: "192.168.1.105", timestamp: "2026-06-02T07:54:15" },
  { id: "l-6", level: "error", message: "Unauthorized API access attempt to /v1/admin/settings", statusCode: 401, serviceName: "gateway-service", ipAddress: "45.12.89.23", timestamp: "2026-06-02T07:42:09" },
  { id: "l-7", level: "info", message: "Initiating daily logs compression job", statusCode: 200, serviceName: "cron-service", ipAddress: "127.0.0.1", timestamp: "2026-06-02T00:00:01" },
  { id: "l-8", level: "warn", message: "Slow query detected: SELECT * FROM products WHERE price > 500 (duration=1542ms)", statusCode: 200, serviceName: "db-service", ipAddress: "10.0.0.15", timestamp: "2026-06-02T07:31:55" },
  { id: "l-9", level: "error", message: "Failed to dispatch email verification to user_481", statusCode: 502, serviceName: "notification-service", ipAddress: "192.168.1.204", timestamp: "2026-06-02T07:18:10" },
  { id: "l-10", level: "info", message: "Health check endpoint /health returned status UP", statusCode: 200, serviceName: "gateway-service", ipAddress: "10.0.0.1", timestamp: "2026-06-02T07:00:00" },
  { id: "l-11", level: "info", message: "User registered: amina@hng.tech", statusCode: 201, serviceName: "auth-service", ipAddress: "192.168.1.112", timestamp: "2026-06-02T06:45:30" },
  { id: "l-12", level: "warn", message: "Redis cache memory usage > 90%", statusCode: 200, serviceName: "cache-service", ipAddress: "10.0.0.22", timestamp: "2026-06-02T06:30:15" },
  { id: "l-13", level: "debug", message: "Cache hit for key 'product:p-1'", statusCode: 200, serviceName: "cache-service", ipAddress: "10.0.0.22", timestamp: "2026-06-02T06:29:40" },
  { id: "l-14", level: "error", message: "Internal server error: Cannot read property 'map' of undefined", statusCode: 500, serviceName: "user-service", ipAddress: "192.168.1.10", timestamp: "2026-06-02T06:12:08" },
  { id: "l-15", level: "info", message: "Product p-1 added to cart by guest_894", statusCode: 200, serviceName: "cart-service", ipAddress: "82.41.204.18", timestamp: "2026-06-02T06:05:44" },
  { id: "l-16", level: "info", message: "Checkout completed for order_1842 (value=$149.99)", statusCode: 200, serviceName: "cart-service", ipAddress: "82.41.204.18", timestamp: "2026-06-02T06:08:12" },
  { id: "l-17", level: "warn", message: "Deprecation warning: Endpoint /v1/auth/legacy will be removed in next release", statusCode: 200, serviceName: "auth-service", ipAddress: "192.168.1.1", timestamp: "2026-06-02T05:55:00" },
  { id: "l-18", level: "error", message: "Payment checkout session expired for session_947", statusCode: 400, serviceName: "payment-service", ipAddress: "192.168.1.200", timestamp: "2026-06-02T05:48:19" },
  { id: "l-19", level: "info", message: "User logout requested for id=u-3", statusCode: 200, serviceName: "auth-service", ipAddress: "192.168.1.22", timestamp: "2026-06-02T05:32:00" },
  { id: "l-20", level: "info", message: "Database backup completed successfully (backup_20260602.sql, size=24.5MB)", statusCode: 200, serviceName: "cron-service", ipAddress: "127.0.0.1", timestamp: "2026-06-02T04:00:15" },
  { id: "l-21", level: "debug", message: "Cache miss for key 'product:p-2'", statusCode: 200, serviceName: "cache-service", ipAddress: "10.0.0.22", timestamp: "2026-06-02T03:45:00" },
  { id: "l-22", level: "error", message: "Failed database connection attempt (Access denied for user 'root'@'db-node-1')", statusCode: 500, serviceName: "db-service", ipAddress: "10.0.0.15", timestamp: "2026-06-02T03:12:12" },
  { id: "l-23", level: "warn", message: "High latency detected on gateway requests (avg=412ms)", statusCode: 200, serviceName: "gateway-service", ipAddress: "10.0.0.1", timestamp: "2026-06-02T02:45:10" },
  { id: "l-24", level: "info", message: "SSL certificate verified and valid until 2027-06-02", statusCode: 200, serviceName: "gateway-service", ipAddress: "10.0.0.1", timestamp: "2026-06-02T02:00:00" },
  { id: "l-25", level: "info", message: "New device login detected for user_94 (browser=Firefox, OS=Linux)", statusCode: 200, serviceName: "auth-service", ipAddress: "112.44.89.1", timestamp: "2026-06-02T01:30:15" },
  { id: "l-26", level: "debug", message: "Garbage collection execution triggered (reclaimed 415MB heap)", statusCode: 200, serviceName: "gateway-service", ipAddress: "10.0.0.1", timestamp: "2026-06-02T01:15:30" },
  { id: "l-27", level: "info", message: "Log rotation completed cleanly", statusCode: 200, serviceName: "cron-service", ipAddress: "127.0.0.1", timestamp: "2026-06-02T00:05:00" },
  { id: "l-28", level: "error", message: "Missing required parameter 'email' on registration api", statusCode: 400, serviceName: "auth-service", ipAddress: "192.168.1.18", timestamp: "2026-06-01T23:45:12" },
  { id: "l-29", level: "info", message: "Product details loaded for p-7", statusCode: 200, serviceName: "product-service", ipAddress: "192.168.1.44", timestamp: "2026-06-01T23:30:15" },
  { id: "l-30", level: "warn", message: "High volume of requests from IP 45.12.89.23 (potential DDoS/scrape)", statusCode: 200, serviceName: "gateway-service", ipAddress: "10.0.0.1", timestamp: "2026-06-01T23:15:20" },
  { id: "l-31", level: "info", message: "Successfully published event 'order.placed' to RabbitMQ queue", statusCode: 200, serviceName: "cart-service", ipAddress: "10.0.0.8", timestamp: "2026-06-01T22:58:14" },
  { id: "l-32", level: "error", message: "Elasticsearch cluster yellow status (1 unassigned shard)", statusCode: 500, serviceName: "search-service", ipAddress: "10.0.0.35", timestamp: "2026-06-01T22:12:00" },
  { id: "l-33", level: "info", message: "Search query executed: ' noise cancelling headphones' (returned 15 hits)", statusCode: 200, serviceName: "search-service", ipAddress: "192.168.1.100", timestamp: "2026-06-01T22:10:45" },
  { id: "l-34", level: "warn", message: "API Gateway rate limit triggered for client_token_481a", statusCode: 429, serviceName: "gateway-service", ipAddress: "94.22.105.18", timestamp: "2026-06-01T21:45:00" },
  { id: "l-35", level: "info", message: "Password reset token generated for user_8", statusCode: 200, serviceName: "auth-service", ipAddress: "192.168.1.8", timestamp: "2026-06-01T21:30:20" },
  { id: "l-36", level: "debug", message: "Connecting to database node db-replica-1", statusCode: 200, serviceName: "db-service", ipAddress: "10.0.0.16", timestamp: "2026-06-01T21:12:00" },
  { id: "l-37", level: "info", message: "File upload successful: invoice_1842.pdf (size=142KB)", statusCode: 201, serviceName: "billing-service", ipAddress: "192.168.1.55", timestamp: "2026-06-01T20:45:18" },
  { id: "l-38", level: "error", message: "Failed to parse CSV upload (Incorrect formatting on row 42)", statusCode: 400, serviceName: "billing-service", ipAddress: "192.168.1.55", timestamp: "2026-06-01T20:42:01" },
  { id: "l-39", level: "info", message: "Shipping label printed for order_1841", statusCode: 200, serviceName: "fulfillment-service", ipAddress: "10.0.2.10", timestamp: "2026-06-01T20:00:15" },
  { id: "l-40", level: "warn", message: "Stripe API response delay (duration=1890ms)", statusCode: 200, serviceName: "payment-service", ipAddress: "192.168.1.200", timestamp: "2026-06-01T19:48:30" },
  { id: "l-41", level: "info", message: "User account suspended (fraud check flagged u-22)", statusCode: 200, serviceName: "user-service", ipAddress: "10.0.0.5", timestamp: "2026-06-01T19:15:00" },
  { id: "l-42", level: "debug", message: "Cleaning session keys from database cache", statusCode: 200, serviceName: "cron-service", ipAddress: "127.0.0.1", timestamp: "2026-06-01T19:00:00" },
  { id: "l-43", level: "info", message: "Theme configuration updated by admin_1", statusCode: 200, serviceName: "settings-service", ipAddress: "192.168.1.2", timestamp: "2026-06-01T18:30:15" },
  { id: "l-44", level: "error", message: "Disk space critical on service-node-4: 93% full", statusCode: 500, serviceName: "sysmon-service", ipAddress: "10.0.0.4", timestamp: "2026-06-01T18:12:00" },
  { id: "l-45", level: "info", message: "New user verification sms queued for id=u-11", statusCode: 200, serviceName: "notification-service", ipAddress: "192.168.1.204", timestamp: "2026-06-01T17:45:00" },
  { id: "l-46", level: "warn", message: "Missing translation key 'payment.checkout.success' in language French", statusCode: 200, serviceName: "localization-service", ipAddress: "10.0.0.41", timestamp: "2026-06-01T17:15:30" },
  { id: "l-47", level: "info", message: "GraphQL query compiler loaded successfully", statusCode: 200, serviceName: "query-service", ipAddress: "10.0.0.80", timestamp: "2026-06-01T16:30:00" },
  { id: "l-48", level: "debug", message: "Starting compilation of active AST query node", statusCode: 200, serviceName: "query-service", ipAddress: "10.0.0.80", timestamp: "2026-06-01T16:29:45" },
  { id: "l-49", level: "info", message: "Admin dashboard configuration pulled", statusCode: 200, serviceName: "settings-service", ipAddress: "192.168.1.2", timestamp: "2026-06-01T15:45:00" },
  { id: "l-50", level: "error", message: "DNS resolution failed for hostname 'api.external-processor.com'", statusCode: 503, serviceName: "gateway-service", ipAddress: "10.0.0.1", timestamp: "2026-06-01T15:12:00" }
];
