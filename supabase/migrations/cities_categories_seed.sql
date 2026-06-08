-- Populando categorias (Exemplos Reais Brasil)
INSERT INTO public.categories (name, slug, icon, description) VALUES
('Eletricista', 'eletricista', 'Zap', 'Instalações, reparos e manutenção elétrica residencial e industrial.'),
('Encanador', 'encanador', 'Droplets', 'Reparos de vazamentos, desentupimento e instalações hidráulicas.'),
('Pedreiro', 'pedreiro', 'Square', 'Construção civil, reformas em geral e acabamento.'),
('Pintor', 'pintor', 'Paintbrush', 'Pintura residencial, comercial e efeitos decorativos.'),
('Marido de Aluguel', 'marido-de-aluguel', 'Wrench', 'Pequenos reparos e manutenção doméstica diversa.'),
('Diarista', 'diarista', 'Sparkles', 'Limpeza residencial e organização de ambientes.'),
('Mecânico', 'mecanico', 'Car', 'Manutenção preventiva e corretiva de veículos.'),
('Montador de Móveis', 'montador-de-moveis', 'Hammer', 'Montagem e desmontagem de móveis de todas as marcas.')
ON CONFLICT (slug) DO NOTHING;

-- Populando cidades (Principais Polos Brasil)
INSERT INTO public.cities (name, state, slug) VALUES
('São Paulo', 'SP', 'sao-paulo-sp'),
('Rio de Janeiro', 'RJ', 'rio-de-janeiro-rj'),
('Belo Horizonte', 'MG', 'belo-horizonte-mg'),
('Curitiba', 'PR', 'curitiba-pr'),
('Porto Alegre', 'RS', 'porto-alegre-rs'),
('Salvador', 'BA', 'salvador-ba'),
('Fortaleza', 'CE', 'fortaleza-ce'),
('Brasília', 'DF', 'brasilia-df'),
('Campinas', 'SP', 'campinas-sp'),
('Goiânia', 'GO', 'goiania-go')
ON CONFLICT (name, state) DO NOTHING;
