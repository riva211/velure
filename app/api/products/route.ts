import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const sortBy = searchParams.get("sortBy") || "featured";

    // Build query
    const query: any = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice && maxPrice !== "Infinity") query.price.$lte = parseFloat(maxPrice);
    }

    if (inStockOnly) {
      query.stock = { $gt: 0 };
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case "price-low":
        sort = { price: 1 };
        break;
      case "price-high":
        sort = { price: -1 };
        break;
      case "rating":
        sort = { averageRating: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      default:
        sort = { featured: -1, createdAt: -1 };
    }

    const products = await Product.find(query).sort(sort);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
