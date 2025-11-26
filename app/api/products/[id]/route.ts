import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id);
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    console.log("Fetching product with ID:", id);
    const product = await Product.findById(id).lean();

    if (!product) {
      console.log("Product not found for ID:", id);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Transform MongoDB document to plain object with string ID
    const transformedProduct = {
      ...product,
      _id: product._id.toString(),
    };

    console.log("Product found:", transformedProduct.name);
    return NextResponse.json({ product: transformedProduct });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
