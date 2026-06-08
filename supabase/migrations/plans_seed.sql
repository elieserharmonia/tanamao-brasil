-- Inserção dos Planos de Negócio
INSERT INTO public.plans (id, name, price, max_photos, benefits)
VALUES 
(
  'plan-free', 
  'Plano Gratuito', 
  0.00, 
  3, 
  '{"search_priority": 1, "custom_whatsapp": true, "verified_badge": false}'::jsonb
),
(
  'plan-premium', 
  'Plano Premium', 
  49.90, 
  12, 
  '{"search_priority": 3, "custom_whatsapp": true, "verified_badge": true, "analytics": true}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
  price = EXCLUDED.price,
  max_photos = EXCLUDED.max_photos,
  benefits = EXCLUDED.benefits;
