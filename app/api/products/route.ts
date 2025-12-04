import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

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
    } = body;

    // Validation
    if (!name || !productDetails || priceINR == null || priceUSD == null || !metal || !category || !stock || !image1 || !image2 || !image3) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create images array
    const images = [image1, image2, image3];
    if (image4) images.push(image4);

    // Create new product
    const product = await Product.create({
      name,
      description: productDetails,
      priceINR: parseFloat(priceINR),
      priceUSD: parseFloat(priceUSD),
      metal,
      category,
      stock: parseInt(stock),
      images,
      featured: featured || false,
      averageRating: 0,
      numReviews: 0,
    });

    // Transform to plain object with string ID
    const transformedProduct = {
      ...product.toObject(),
      _id: product._id.toString(),
    };

    return NextResponse.json(
      { message: "Product created successfully", product: transformedProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

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

    const products = await Product.find(query).sort(sort).lean();

    // Transform products to have string IDs
    const transformedProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
    }));

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Delete all products
    const result = await Product.deleteMany({});

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} products`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting products:", error);
    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 }
    );
  }
}
