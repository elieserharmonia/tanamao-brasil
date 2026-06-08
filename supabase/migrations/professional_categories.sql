-- Table for N:N relationship between professionals and categories
CREATE TABLE IF NOT EXISTS public.professional_categories (
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, category_id)
);

-- RLS
ALTER TABLE public.professional_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view professional categories" ON public.professional_categories FOR SELECT USING (true);
CREATE POLICY "Professionals can manage their own categories" ON public.professional_categories FOR ALL USING (auth.uid() = professional_id);

-- Update professionals table to remove category_id if it exists to avoid redundancy (optional but cleaner)
-- ALTER TABLE public.professionals DROP COLUMN IF EXISTS category_id;
