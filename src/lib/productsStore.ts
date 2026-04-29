import fs from "fs";
import path from "path";
import { Product } from "@/data/products";

const productsFilePath = path.join(process.cwd(), "src/data/products.json");

export function getProducts(): Product[] {
  try {
    const fileData = fs.readFileSync(productsFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading products file:", error);
    return [];
  }
}

export function saveProducts(products: Product[]): boolean {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing products file:", error);
    return false;
  }
}
