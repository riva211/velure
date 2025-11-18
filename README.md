# Velure - Modern E-Commerce Platform

A full-stack e-commerce application built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS.

## Features

### Customer Features
- **Authentication**: Secure user registration and login with NextAuth.js
- **Product Browsing**: Browse products with filters, categories, and search functionality
- **Product Details**: Detailed product pages with reviews, ratings, and image galleries
- **Shopping Cart**: Add, remove, and update items in cart
- **Checkout**: Complete checkout process with Square payment integration (UI placeholder)
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop devices

### Admin Features
- **Protected Admin Panel**: Role-based access control for admin users
- **Dashboard**: Overview of sales, orders, products, and customers
- **Product Management**: Add, edit, and delete products from inventory
- **Order Management**: View and update order status (pending, processing, shipped, delivered)
- **Inventory Tracking**: Monitor stock levels and product availability

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js v5
- **Database**: MongoDB with Mongoose
- **Payment**: Square (placeholder integration)

## Project Structure

```
velure/
├── app/
│   ├── (auth)/
│   │   ├── login/         # Login page
│   │   └── signup/        # Registration page
│   ├── admin/
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   └── layout.tsx     # Admin layout with sidebar
│   ├── products/
│   │   ├── [id]/          # Product detail page
│   │   └── page.tsx       # Products listing
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── about/             # About page
│   ├── api/
│   │   └── auth/          # Authentication API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx     # Navigation bar
│   │   └── Footer.tsx     # Footer
│   ├── products/
│   │   └── ProductCard.tsx # Product card component
│   ├── ui/                # shadcn/ui components
│   └── providers.tsx      # Context providers
├── lib/
│   ├── models/
│   │   ├── User.ts        # User model
│   │   ├── Product.ts     # Product model
│   │   ├── Order.ts       # Order model
│   │   └── Cart.ts        # Cart model
│   ├── auth.ts            # NextAuth configuration
│   ├── mongodb.ts         # MongoDB connection
│   └── utils.ts           # Utility functions
├── types/
│   └── next-auth.d.ts     # NextAuth type definitions
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd velure
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/velure
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/velure

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-a-strong-random-string

# Admin credentials (for initial setup)
ADMIN_EMAIL=admin@velure.com
ADMIN_PASSWORD=admin123
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

4. **Set up MongoDB**

- **Option 1: Local MongoDB**
  - Install MongoDB locally
  - Start MongoDB service
  - Use connection string: `mongodb://localhost:27017/velure`

- **Option 2: MongoDB Atlas (Cloud)**
  - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - Create a new cluster
  - Get your connection string
  - Replace `<password>` with your database user password

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating an Admin User

Since the app uses role-based authentication, you'll need to manually create an admin user in MongoDB:

1. Sign up through the website at `/signup`
2. Open MongoDB (MongoDB Compass or Atlas dashboard)
3. Find your user in the `users` collection
4. Change the `role` field from `"user"` to `"admin"`

Alternatively, you can create a seed script or use MongoDB shell:

```javascript
db.users.updateOne(
  { email: "admin@velure.com" },
  { $set: { role: "admin" } }
)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Pages

### Public Pages
- `/` - Home page with hero section and featured products
- `/products` - Product listing with filters and search
- `/products/[id]` - Individual product details
- `/about` - About page
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - Login page
- `/signup` - Registration page

### Protected Admin Pages
- `/admin/dashboard` - Admin dashboard overview
- `/admin/products` - Product management
- `/admin/orders` - Order management

## Features Roadmap

### Current Features ✅
- User authentication and authorization
- Product browsing and filtering
- Shopping cart functionality
- Admin dashboard
- Order management
- Mobile-responsive design

### Upcoming Features 🚧
- Square payment integration (currently UI placeholder)
- Email notifications
- Product reviews system (UI ready, backend pending)
- Wishlist functionality (UI ready, backend pending)
- Order tracking
- User profile management
- Advanced analytics dashboard
- Product image upload
- Inventory alerts
- Discount codes/coupons

## API Routes Structure

The app includes placeholder API route structure for:
- `/api/auth/*` - Authentication endpoints (NextAuth)
- `/api/products` - Product CRUD operations (to be implemented)
- `/api/orders` - Order management (to be implemented)
- `/api/cart` - Cart operations (to be implemented)

## Database Models

### User
- name, email, password (hashed)
- role: "user" | "admin"
- timestamps

### Product
- name, description, price, category
- images[], stock, featured
- reviews with ratings
- timestamps

### Order
- user reference
- orderItems[] with product details
- shippingAddress
- paymentMethod, paymentResult
- prices (items, tax, shipping, total)
- status: pending | processing | shipped | delivered | cancelled
- timestamps

### Cart
- user reference
- items[] with product details and quantities
- timestamps

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Environment Variables for Production

Make sure to set these in your production environment:

```env
MONGODB_URI=<your-production-mongodb-uri>
NEXTAUTH_URL=<your-production-url>
NEXTAUTH_SECRET=<strong-random-secret>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, email support@velure.com or open an issue in the repository.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)

---

Built with ❤️ using Next.js and TypeScript
