import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Assure-toi que ce fichier existe

export async function GET() {
  // Récupère les commandes depuis Supabase
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // On prépare les données pour qu'elles correspondent à tes colonnes SQL
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          // Mapping : nom_colonne_sql: valeur_du_formulaire
          user_name: body.customerName,
          phone: body.phone,
          wilaya: body.wilaya,
          commune: body.commune, // <--- AJOUTEZ CETTE LIGNE ICI
          address: body.address, // Tu peux combiner adresse + commune si besoin
          total: body.total,
          items: body.items, // JSONB accepte directement l'objet
          status: "pending"
          // 'id' et 'created_at' sont générés automatiquement par Supabase
        }
      ])
      .select();

    if (error) {
      console.error("Erreur Supabase lors de l'insertion:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}