-- Busca de profissionais com filtros e ranking dinâmico
CREATE OR REPLACE FUNCTION public.search_professionals(
    p_city_slug TEXT DEFAULT NULL,
    p_category_slug TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    rating_avg DECIMAL,
    review_count INTEGER,
    plan_type TEXT,
    category_name TEXT,
    city_name TEXT,
    state TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        pr.full_name,
        pr.avatar_url,
        p.bio,
        p.rating_avg,
        p.review_count,
        p.plan_type,
        cat.name as category_name,
        ct.name as city_name,
        ct.state
    FROM public.professionals p
    JOIN public.profiles pr ON p.id = pr.id
    JOIN public.categories cat ON p.category_id = cat.id
    JOIN public.cities ct ON p.city_id = ct.id
    WHERE 
        p.is_active = true
        AND (p_city_slug IS NULL OR ct.slug = p_city_slug)
        AND (p_category_slug IS NULL OR cat.slug = p_category_slug)
    ORDER BY 
        (CASE WHEN p.plan_type = 'premium' THEN 1 ELSE 2 END) ASC,
        p.rating_avg DESC,
        p.created_at DESC
    LIMIT p_limit 
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Verificação de limite de fotos baseado no plano
CREATE OR REPLACE FUNCTION public.check_photo_limit(p_professional_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_plan TEXT;
    max_allowed INTEGER;
    current_count INTEGER;
BEGIN
    SELECT plan_type INTO current_plan FROM public.professionals WHERE id = p_professional_id;
    SELECT max_photos INTO max_allowed FROM public.plans WHERE id = ('plan-' || current_plan);
    SELECT COUNT(*) INTO current_count FROM public.professional_photos WHERE professional_id = p_professional_id;
    
    RETURN current_count < max_allowed;
END;
$$ LANGUAGE plpgsql STABLE;

-- 3. SEO Slug Helper
CREATE OR REPLACE FUNCTION public.slugify(v_text TEXT)
RETURNS TEXT AS $$
DECLARE
    v_slug TEXT;
BEGIN
    v_slug := lower(v_text);
    v_slug := regexp_replace(v_slug, '[áàâãä]', 'a', 'g');
    v_slug := regexp_replace(v_slug, '[éèêë]', 'e', 'g');
    v_slug := regexp_replace(v_slug, '[íìîï]', 'i', 'g');
    v_slug := regexp_replace(v_slug, '[óòôõö]', 'o', 'g');
    v_slug := regexp_replace(v_slug, '[úùûü]', 'u', 'g');
    v_slug := regexp_replace(v_slug, 'ç', 'c', 'g');
    v_slug := regexp_replace(v_slug, '[^a-z0-9]', '-', 'g');
    v_slug := regexp_replace(v_slug, '-+', '-', 'g');
    v_slug := trim(both '-' from v_slug);
    RETURN v_slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Constraints Adicionais de Segurança
-- Garante que o whatsapp siga um padrão mínimo brasileiro (10-11 dígitos)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_whatsapp_format') THEN
        ALTER TABLE public.professionals 
        ADD CONSTRAINT check_whatsapp_format 
        CHECK (whatsapp ~ '^[0-9]{10,11}$');
    END IF;
END $$;

