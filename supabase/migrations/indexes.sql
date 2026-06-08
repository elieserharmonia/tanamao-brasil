-- Indexação de busca combinada (Core do negócio)
CREATE INDEX IF NOT EXISTS idx_pros_city_cat ON public.professionals (city_id, category_id) WHERE is_active = true;

-- Indexação de Ranking (Performance em Order By)
-- Prioriza planos pagos, depois a melhor média de avaliação
CREATE INDEX IF NOT EXISTS idx_pros_ranking ON public.professionals (plan_type DESC, rating_avg DESC);

-- Busca por Slugs (SEO e Rotas)
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON public.cities (slug);

-- Relacionamentos (Foreign Key Lookups)
CREATE INDEX IF NOT EXISTS idx_photos_pro_id ON public.professional_photos (professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pro_id ON public.reviews (professional_id);
CREATE INDEX IF NOT EXISTS idx_subs_pro_id ON public.subscriptions (professional_id);

-- WhatsApp Lookup
CREATE INDEX IF NOT EXISTS idx_pros_whatsapp ON public.professionals (whatsapp);

-- Full Text Search (Geral)
-- Opcional: Adicionar coluna tsvector se a busca for por texto livre pesado
