-- Configuração do Supabase Storage para o balde "portfolios"

-- 1. Create Bucket (Executado via Admin normalmente, mas aqui como referência)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolios', 'portfolios', true);

-- 2. Policies for "portfolios" bucket

-- SELECT: Qualquer um pode ver fotos do portfólio
CREATE POLICY "Public Portfolio Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolios');

-- INSERT: Apenas o profissional dono do arquivo pode subir (valida via path_tokens)
-- O path deve seguir o padrão: portfolios/PROFESSIONAL_ID/nome-arquivo.png
CREATE POLICY "Professionals can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'portfolios' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND public.check_photo_limit(auth.uid()) -- Chama a função SQL definida em functions.sql
);

-- DELETE: O profissional pode deletar suas próprias fotos
CREATE POLICY "Professionals can delete their photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'portfolios' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- UPDATE: Não permitido por padrão (deleta e sobe de novo para evitar cache stale)
