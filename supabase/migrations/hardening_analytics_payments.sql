-- 1. Payment Logs (Mercado Pago Webhooks)
CREATE TABLE IF NOT EXISTS public.payment_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    external_id TEXT, -- ID do Pagamento no MP
    professional_id UUID REFERENCES public.profiles(id),
    status TEXT NOT NULL,
    payload JSONB, -- JSON completo recebido do Webhook
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_logs_external ON public.payment_logs (external_id);

-- 2. Atividade & Analytics (Interaction Tracking)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'whatsapp_click', 'search_hit')),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_pro_event ON public.activity_logs (professional_id, event_type);
CREATE INDEX idx_activity_created ON public.activity_logs (created_at);

-- 3. Analytics View para o Dashboard Profissional
CREATE OR REPLACE VIEW public.v_professional_stats AS
SELECT 
    professional_id,
    COUNT(*) FILTER (WHERE event_type = 'profile_view') as total_views,
    COUNT(*) FILTER (WHERE event_type = 'whatsapp_click') as total_whatsapp_clicks,
    COUNT(*) FILTER (WHERE event_type = 'whatsapp_click')::float / 
        NULLIF(COUNT(*) FILTER (WHERE event_type = 'profile_view'), 0) as conversion_rate,
    DATE_TRUNC('day', created_at) as stat_date
FROM public.activity_logs
GROUP BY professional_id, DATE_TRUNC('day', created_at);

-- 4. Função para registrar clique (RPC protegida)
CREATE OR REPLACE FUNCTION public.track_interaction(
    p_professional_id UUID,
    p_event_type TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.activity_logs (professional_id, client_id, event_type, metadata)
    VALUES (p_professional_id, auth.uid(), p_event_type, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
