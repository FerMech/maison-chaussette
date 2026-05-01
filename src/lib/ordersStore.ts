import { supabase } from "@/lib/supabaseClient";

export interface Order {
  id: string;
  user_name: string; // Mis à jour pour correspondre à ta colonne SQL
  phone: string;
  wilaya: string;
  address: string;
  total: number;
  items: any[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string; // Mis à jour pour correspondre à Supabase
}

// Récupère toutes les commandes depuis Supabase
export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des commandes:", error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur imprévue:", error);
    return [];
  }
}

// Ajoute une nouvelle commande dans Supabase
export async function addOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .insert([orderData]);

    if (error) {
      console.error("Erreur lors de l'ajout de la commande:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur imprévue lors de l'ajout:", error);
    return false;
  }
}