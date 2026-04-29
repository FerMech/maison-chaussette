import fs from "fs";
import path from "path";

export interface Category {
  id: string;
  name: string;
}

const categoriesFilePath = path.join(process.cwd(), "src/data/categories.json");

export function getCategories(): Category[] {
  try {
    if (!fs.existsSync(categoriesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(categoriesFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading categories:", error);
    return [];
  }
}

export function saveCategories(categories: Category[]): boolean {
  try {
    const dir = path.dirname(categoriesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving categories:", error);
    return false;
  }
}
