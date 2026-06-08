-- 1. Automate updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. New User Sync (Auth -> Public Profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário TáNaMão'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  
  -- Se for profissional, cria tbm a entrada na tabela professionals
  IF (NEW.raw_user_meta_data->>'role' = 'professional') THEN
    INSERT INTO public.professionals (id, whatsapp)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'whatsapp');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Calculate Rating Average
CREATE OR REPLACE FUNCTION public.recalculate_professional_rating()
RETURNS TRIGGER AS $$
DECLARE
    pro_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        pro_id = OLD.professional_id;
    ELSE
        pro_id = NEW.professional_id;
    END IF;

    UPDATE public.professionals
    SET 
        rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE professional_id = pro_id),
        review_count = (SELECT COUNT(*) FROM public.reviews WHERE professional_id = pro_id)
    WHERE id = pro_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_reviews_recalc
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.recalculate_professional_rating();
