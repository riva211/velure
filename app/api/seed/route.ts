import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import { dummyProducts } from "@/lib/dummy-data";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    await connectDB();

    // Clear existing products (optional - remove if you want to keep existing)
    await Product.deleteMany({});

    // Insert dummy products
    const products = await Product.insertMany(
      dummyProducts.map((product) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        stock: product.stock,
        featured: product.featured,
        averageRating: product.averageRating,
        numReviews: product.numReviews,
      }))
    );

    // Create admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || "admin@velure.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      count: products.length,
      products: products.map((p) => ({ id: p._id, name: p.name })),
      admin: {
        message: "Admin user created/verified",
        email: adminEmail,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST request to seed the database with dummy products",
    note: "This will clear existing products and create new ones",
  });
}
