import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Build query
    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Transform orders to match expected format
    const transformedOrders = orders.map((order: any) => ({
      _id: order._id.toString(),
      orderId: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      customer: {
        name: order.user?.name || order.shippingAddress?.fullName || "Guest",
        email: order.user?.email || "N/A",
      },
      items: order.orderItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      shippingAddress: order.shippingAddress,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Delete all orders
    const result = await Order.deleteMany({});

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} orders`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting orders:", error);
    return NextResponse.json(
      { error: "Failed to delete orders" },
      { status: 500 }
    );
  }
}
