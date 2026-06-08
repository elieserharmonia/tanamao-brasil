-- 1. Anti-Fraude: Limite de Avaliações
-- Regra: 1 avaliação por cliente por profissional a cada 30 dias
CREATE OR REPLACE FUNCTION public.check_review_fraud()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.reviews 
        WHERE client_id = NEW.client_id 
        AND professional_id = NEW.professional_id 
        AND created_at > (NOW() - INTERVAL '30 days')
    ) THEN
        RAISE EXCEPTION 'Você já avaliou este profissional nos últimos 30 dias.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_anti_fraud_reviews
    BEFORE INSERT ON public.reviews
    FOR EACH ROW EXECUTE PROCEDURE public.check_review_fraud();

-- 2. Downgrade Automático: Ocultação de Fotos Excedentes
-- Regra: Se o plano mudar para 'free', mantém apenas as 3 fotos mais recentes visíveis
CREATE OR REPLACE FUNCTION public.handle_plan_downgrade()
RETURNS TRIGGER AS $$
BEGIN
    -- Se houve downgrade para free
    IF (OLD.plan_type = 'premium' AND NEW.plan_type = 'free') THEN
        -- Marca como hidden as fotos que não são as 3 principais/recentes
        UPDATE public.professional_photos
        SET is_hidden = true
        WHERE professional_id = NEW.id
        AND id NOT IN (
            SELECT id FROM public.professional_photos 
            WHERE professional_id = NEW.id 
            ORDER BY is_main DESC, created_at DESC 
            LIMIT 3
        );
    END IF;
    
    -- Se houve upgrade para premium, libera as fotos hidden (dentro do limite de 12)
    IF (OLD.plan_type = 'free' AND NEW.plan_type = 'premium') THEN
        UPDATE public.professional_photos
        SET is_hidden = false
        WHERE professional_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_professional_downgrade
    AFTER UPDATE OF plan_type ON public.professionals
    FOR EACH ROW EXECUTE PROCEDURE public.handle_plan_downgrade();
