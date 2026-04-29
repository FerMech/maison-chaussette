import fs from "fs";
import path from "path";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  deliveryMode: string;
  items: any[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

const ordersFilePath = path.join(process.cwd(), "src/data/orders.json");

export function getOrders(): Order[] {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(ordersFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export function saveOrders(orders: Order[]): boolean {
  try {
    const dir = path.dirname(ordersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving orders:", error);
    return false;
  }
}
