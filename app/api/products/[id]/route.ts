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

    if (!product || Array.isArray(product)) {
      console.log("Product not found for ID:", id);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Transform MongoDB document to plain object with string ID
    const transformedProduct = {
      ...product,
      _id: (product._id as mongoose.Types.ObjectId).toString(),
    };

    console.log("Product found:", (product as any).name);
    return NextResponse.json({ product: transformedProduct });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      name,
      productDetails,
      priceINR,
      priceUSD,
      metal,
      category,
      stock,
      image1,
      image2,
      image3,
      image4,
      featured,
    } = body || {};

    // Build update object only with provided fields
    const update: any = {};
    if (typeof name === "string") update.name = name;
    if (typeof productDetails === "string") update.description = productDetails;
    if (priceINR !== undefined) update.priceINR = parseFloat(priceINR);
    if (priceUSD !== undefined) update.priceUSD = parseFloat(priceUSD);
    if (typeof metal === "string") update.metal = metal;
    if (typeof category === "string") update.category = category;
    if (stock !== undefined) update.stock = parseInt(stock);

    // Handle images if provided as separate fields
    const imagesProvided = [image1, image2, image3].some((v) => typeof v === "string" && v.trim() !== "");
    if (imagesProvided) {
      const images: string[] = [];
      if (typeof image1 === "string" && image1.trim()) images.push(image1);
      if (typeof image2 === "string" && image2.trim()) images.push(image2);
      if (typeof image3 === "string" && image3.trim()) images.push(image3);
      if (typeof image4 === "string" && image4.trim()) images.push(image4);
      if (images.length > 0) update.images = images;
    }

    if (typeof featured === "boolean") update.featured = featured;

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const transformed = { ...updated, _id: (updated._id as mongoose.Types.ObjectId).toString() };
    return NextResponse.json({ message: "Product updated successfully", product: transformed });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
