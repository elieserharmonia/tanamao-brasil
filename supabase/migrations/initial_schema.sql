-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Profiles: Shared between clients and professionals
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'professional', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories: Professional sectors
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities: Geographic locations
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL, -- Ex: SP, RJ
    slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, state)
);

-- Professionals: Commercial profile
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    bio TEXT,
    whatsapp TEXT NOT NULL,
    address TEXT,
    city_id UUID REFERENCES public.cities(id),
    category_id UUID REFERENCES public.categories(id),
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
    rating_avg DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans (Metadata for billing)
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY, -- e.g., 'plan-premium'
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_photos INTEGER NOT NULL,
    benefits JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (Faturamento Mercado Pago)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES public.plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'cancelled', 'inactive')),
    external_id TEXT, -- ID do Mercado Pago
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Professional Photos (Portfolio)
CREATE TABLE IF NOT EXISTS public.professional_photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE, -- Oculta se o plano expirar
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (Avaliações)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Polícias de Leitura: Geralmente públicas
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public professionals are viewable by everyone" ON public.professionals FOR SELECT USING (is_active = true);
CREATE POLICY "Public photos are viewable by everyone" ON public.professional_photos FOR SELECT USING (is_hidden = false);
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Cities are public" ON public.cities FOR SELECT USING (true);

-- Polícias de Escrita: Donos ou Admins
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Professionals can update their own profile" ON public.professionals FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Professionals can manage their own photos" ON public.professional_photos FOR ALL USING (auth.uid() = professional_id);
CREATE POLICY "Clients can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can see their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = professional_id);
