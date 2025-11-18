import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { dummyProducts } from "@/lib/dummy-data";

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

    return NextResponse.json({
      message: "Database seeded successfully",
      count: products.length,
      products: products.map((p) => ({ id: p._id, name: p.name })),
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
