import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders, Order } from "@/lib/ordersStore";

export async function GET() {
  const orders = getOrders();
  // Sort by newest first
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sortedOrders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orders = getOrders();
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: body.customerName,
      phone: body.phone,
      wilaya: body.wilaya,
      commune: body.commune,
      address: body.address,
      deliveryMode: body.deliveryMode,
      items: body.items,
      total: body.total,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    const success = saveOrders(orders);
    
    if (success) {
      return NextResponse.json(newOrder, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
