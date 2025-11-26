import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@velure.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Check if admin user already exists
    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      return NextResponse.json({
        message: "Admin user already exists",
        email: adminEmail,
        existed: true,
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    adminUser = await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      email: adminEmail,
      existed: false,
    });
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      {
        error: "Failed to create admin user",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@velure.com";
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      return NextResponse.json({
        exists: false,
        email: adminEmail,
        message: "Admin user does not exist. Use POST to create it.",
      });
    }

    return NextResponse.json({
      exists: true,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      createdAt: adminUser.createdAt,
    });
  } catch (error: any) {
    console.error("Error checking admin user:", error);
    return NextResponse.json(
      {
        error: "Failed to check admin user",
        details: error.message
      },
      { status: 500 }
    );
  }
}
