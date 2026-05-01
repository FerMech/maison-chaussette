import { supabase } from '../src/lib/supabaseClient';
import { products } from '../src/data/products';

// Synchronise les produits vers Supabase
const { data, error } = await supabase.from('products').upsert(products, { onConflict: 'id' });

if (error) {
  console.error('Erreur de synchronisation:', error);
} else {
  console.log('Produits synchronisés avec succès 🚀', data);
}