-- 1. LGPD & Audit Logging
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    actor_id UUID REFERENCES auth.users(id),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'SENSITIVE_ACCESS')),
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_record ON public.audit_logs (table_name, record_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs (created_at DESC);

-- 2. Soft Delete implementation
-- Adicionando deleted_at às tabelas principais
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Atualizando RLS para ignorar deletados
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles 
FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Public professionals are viewable by everyone" ON public.professionals;
CREATE POLICY "Public professionals are viewable by everyone" ON public.professionals 
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

-- Função de Soft Delete
CREATE OR REPLACE FUNCTION public.soft_delete_user()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles SET deleted_at = NOW() WHERE id = OLD.id;
    UPDATE public.professionals SET deleted_at = NOW() WHERE id = OLD.id;
    RETURN NULL; -- Cancela o Delete Real
END;
$$ LANGUAGE plpgsql;
