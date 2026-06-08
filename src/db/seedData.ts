// TáNaMão Brasil - Banco de Dados Semente (Seed Data)

import { Category, Cidade as City, Profile, Professional, Plan, Review, ProfessionalPhoto } from '../types';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-eletricista',
    nome: 'Eletricista',
    slug: 'eletricista',
    description: 'Instalações elétricas, padrão, reparos de curtos, disjuntores e fiação residencial.',
    image_url: 'Zap',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-encanador',
    nome: 'Encanador / Bombeiro Hidráulico',
    slug: 'encanador',
    description: 'Vazamentos, detecção eletrônica, encanamento geral e desentupimento.',
    image_url: 'Droplet',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-pintor',
    nome: 'Pintor Residencial',
    slug: 'pintor',
    description: 'Pinturas internas, externas, aplicação de massa corrida, textura e grafiato.',
    image_url: 'Paintbrush',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-diarista',
    nome: 'Diarista / Faxineira',
    slug: 'diarista',
    description: 'Limpeza residencial profunda, limpeza pós-obra, organização e passadoria.',
    image_url: 'Sparkles',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-marceneiro',
    nome: 'Marceneiro',
    slug: 'marceneiro',
    description: 'Fabricação de móveis sob medida, restauração e reparos em madeira.',
    image_url: 'Hammer',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-mecanico',
    nome: 'Mecânico Automotivo',
    slug: 'mecanico',
    description: 'Manutenção de motor, freios, suspensão e injeção eletrônica a domicílio ou oficina.',
    image_url: 'Wrench',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-marido-aluguel',
    nome: 'Marido de Aluguel',
    slug: 'marido-aluguel',
    description: 'Pequenos reparos residenciais, pendurar quadros, instalar varal, trocar fechaduras.',
    image_url: 'Home',
    created_at: new Date().toISOString()
  }
];

export const SEED_CITIES: City[] = [
  { id: 'city-sp', nome: 'São Paulo', estado: 'SP', slug: 'sao-paulo' },
  { id: 'city-rj', nome: 'Rio de Janeiro', estado: 'RJ', slug: 'rio-de-janeiro' },
  { id: 'city-bh', nome: 'Belo Horizonte', estado: 'MG', slug: 'belo-horizonte' },
  { id: 'city-curitiba', nome: 'Curitiba', estado: 'PR', slug: 'curitiba' },
  { id: 'city-salvador', nome: 'Salvador', estado: 'BA', slug: 'salvador' }
];

export const SEED_PLANS: Plan[] = [
  {
    id: 'plan-free',
    name: 'Gratuito',
    price: 0,
    photos_limit: 3,
    has_badge: false,
    priority_level: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'plan-featured',
    name: 'Destaque',
    price: 19.90,
    photos_limit: 8,
    has_badge: true,
    priority_level: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'plan-premium',
    name: 'Premium TáNaMão',
    price: 39.90,
    photos_limit: 15,
    has_badge: true,
    priority_level: 2,
    created_at: new Date().toISOString()
  }
];

export const SEED_PROFILES: Profile[] = [
  // Admin Profile
  {
    id: 'p-admin',
    email: 'admin@tanamao.com.br',
    full_name: 'Davi Fonseca (Moderador)',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Client Profile
  {
    id: 'p-client-1',
    email: 'eliesermusicoccb@gmail.com',
    full_name: 'Elieser Silva Martins',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    role: 'client',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p-client-2',
    email: 'mariasilva@gmail.com',
    full_name: 'Maria Clara Souza',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    role: 'client',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Professional Profiles
  {
    id: 'prof-roberto',
    email: 'robertosilva@gmail.com',
    full_name: 'Roberto Eletricista SP',
    avatar_url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150',
    role: 'professional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-carlos',
    email: 'carlosencanador@gmail.com',
    full_name: 'Carlos Alberto Vazamentos',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    role: 'professional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-ana',
    email: 'analimpeza@gmail.com',
    full_name: 'Ana Cláudia Diarista Especializada',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    role: 'professional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-fabio',
    email: 'fabiopintor@gmail.com',
    full_name: 'Fábio Pintor Profissional',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    role: 'professional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-marcos',
    email: 'marcosmarceneiro@gmail.com',
    full_name: 'Marcos Planejados & Decorações',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    role: 'professional',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SEED_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-roberto',
    user_id: 'prof-roberto',
    full_name: 'Roberto Eletricista SP',
    slug: 'roberto-eletricista-sp',
    phone: '11987654321',
    whatsapp: '11987654321',
    email: 'robertosilva@gmail.com',
    city: 'São Paulo',
    state: 'SP',
    bio: 'Mais de 15 anos de experiência com instalações elétricas e manutenção preventiva/corretiva.Atendemos chamados de emergência 24h na capital. Especialistas em padrões de entrada de energia da Enel, substituição de fiação antiga com disjuntores modernos de segurança, e instalação de lustres, tomadas inteligentes e iluminação em geral. Profissional com certificações NR10 e NR35 para trabalho seguro.',
    plan_type: 'premium',
    ranking_score: 95,
    rating_avg: 4.90,
    rating_count: 3,
    click_count: 145,
    views_count: 1240,
    verified: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-carlos',
    user_id: 'prof-carlos',
    full_name: 'Carlos Alberto Vazamentos',
    slug: 'carlos-alberto-vazamentos',
    phone: '11977755555',
    whatsapp: '11977755555',
    email: 'carlosencanador@gmail.com',
    city: 'São Paulo',
    state: 'SP',
    bio: 'Experiência sólida na detecção e correção de vazamentos. Caça vazamento eletrônico por geofonamento, reduzindo rasgos desnecessários na sua parede. Atendemos bacias e caixas acopladas, troca de reparos de registros de marcas como Deca, Docol, instalação de encanamento de água fria e quente (cobre, verde PPR), além de desentupimento de pias, ralos e esgotos.',
    plan_type: 'featured',
    ranking_score: 85,
    rating_avg: 4.65,
    rating_count: 2,
    click_count: 89,
    views_count: 840,
    verified: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-ana',
    user_id: 'prof-ana',
    full_name: 'Ana Cláudia Diarista Especializada',
    slug: 'ana-claudia-diarista',
    phone: '21999887766',
    whatsapp: '21999887766',
    email: 'analimpeza@gmail.com',
    city: 'Rio de Janeiro',
    state: 'RJ',
    bio: 'Limpeza de excelência para sua casa, escritório ou apartamento. Trabalhamos com cronograma organizado de tarefas: passadoria fina, limpeza profunda pós-reformas, faxinas recorrentes mensais ou quinzenais. Levo material de limpeza ecológico próprio se o cliente preferir. Referências de clientes antigos disponíveis mediante solicitação via WhastApp.',
    plan_type: 'premium',
    ranking_score: 98,
    rating_avg: 5.00,
    rating_count: 2,
    click_count: 210,
    views_count: 1560,
    verified: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-fabio',
    user_id: 'prof-fabio',
    full_name: 'Fábio Pintor Profissional',
    slug: 'fabio-pintor-profissional',
    phone: '31988887777',
    whatsapp: '31988887777',
    email: 'fabiopintor@gmail.com',
    city: 'Belo Horizonte',
    state: 'MG',
    bio: 'Fábio Pintor é sinônimo de acabamento impecável de fino trato. Dominamos drywall, gesso liso decorativo, tratamentos contra infiltração e mofo nas paredes externas, grafiatos, texturas sofisticadas e pintura airless de alto rendimento. Deixamos o local totalmente limpo e aspirado após o término de cada dia de pintura. Entre em contato para orçamentos rápidos.',
    plan_type: 'free',
    ranking_score: 10,
    rating_avg: 4.80,
    rating_count: 1,
    click_count: 42,
    views_count: 320,
    verified: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prof-marcos',
    user_id: 'prof-marcos',
    full_name: 'Marcos Planejados & Decorações',
    slug: 'marcos-planejados',
    phone: '31977776666',
    whatsapp: '31977776666',
    email: 'marcosmarceneiro@gmail.com',
    city: 'Belo Horizonte',
    state: 'MG',
    bio: 'Marcos Planejados transforma seu espaço sob medida. Criamos painéis, cozinhas americanas completas estruturadas com compensados navais resistentes, guarda-roupas planejados, prateleiras estilizadas e balcões comerciais de altíssima resistência estética e operacional. Atendemos toda Belo Horizonte e região metropolitana com seriedade de prazo contratual.',
    plan_type: 'featured',
    ranking_score: 70,
    rating_avg: 4.50,
    rating_count: 1,
    click_count: 53,
    views_count: 410,
    verified: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SEED_PHOTOS: ProfessionalPhoto[] = [
  // Roberto
  {
    id: 'photo-1',
    professional_id: 'prof-roberto',
    photo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  },
  {
    id: 'photo-2',
    professional_id: 'prof-roberto',
    photo_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  },
  {
    id: 'photo-3',
    professional_id: 'prof-roberto',
    photo_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  },
  // Carlos
  {
    id: 'photo-4',
    professional_id: 'prof-carlos',
    photo_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  },
  // Ana
  {
    id: 'photo-5',
    professional_id: 'prof-ana',
    photo_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  },
  {
    id: 'photo-6',
    professional_id: 'prof-ana',
    photo_url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  }
];

export const SEED_REVIEWS: Review[] = [
  // On Roberto
  {
    id: 'rev-1',
    professional_id: 'prof-roberto',
    client_id: 'p-client-1',
    rating: 5,
    comment: 'Instalou um chuveiro de alta potência e organizou o quadro de disjuntores da minha casa perfeitamente. Atendimento rápido e muito educado, explicou todas as dúvidas. Certamente indico!',
    is_approved: true,
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-2',
    professional_id: 'prof-roberto',
    client_id: 'p-client-2',
    rating: 5,
    comment: 'Excelente profissional. Identificou um curto circuito na área de serviço que outros eletricistas disseram que não tinha solução fácil. Cobrou um preço justo.',
    is_approved: true,
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-3',
    professional_id: 'prof-roberto',
    client_id: 'p-admin',
    rating: 4,
    comment: 'Serviço pontual e técnico, gostei bastante do capricho do acabamento elétrico.',
    is_approved: true,
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  },
  // On Carlos
  {
    id: 'rev-4',
    professional_id: 'prof-carlos',
    client_id: 'p-client-1',
    rating: 5,
    comment: 'Localizou o vazamento na rede interna do quintal que estava vindo na conta de água gigantesca. Trabalho limpo e ágil.',
    is_approved: true,
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-5',
    professional_id: 'prof-carlos',
    client_id: 'p-client-2',
    rating: 4,
    comment: 'Bom encanador, resolveu o vazamento da caixa de descarga rápido. Só atrasou 20 minutinhos para chegar mas avisou.',
    is_approved: true,
    created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString()
  },
  // On Ana
  {
    id: 'rev-6',
    professional_id: 'prof-ana',
    client_id: 'p-client-1',
    rating: 5,
    comment: 'Fez a limpeza pós-obra do meu apartamento e ficou impecável! Tirou manchas de tinta seca de porcelanato sem riscar nada. Recomendo muito!',
    is_approved: true,
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-7',
    professional_id: 'prof-ana',
    client_id: 'p-client-2',
    rating: 5,
    comment: 'Organização impecável, excelente com passadoria e limpeza de vidros externos. Nota 10.',
    is_approved: true,
    created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
  },
  // On Fabio
  {
    id: 'rev-8',
    professional_id: 'prof-fabio',
    client_id: 'p-client-2',
    rating: 5,
    comment: 'Excelente acabamento e honestidade extrema nos materiais de pintura consumidos.',
    is_approved: true,
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
  },
  // On Marcos
  {
    id: 'rev-9',
    professional_id: 'prof-marcos',
    client_id: 'p-client-1',
    rating: 4,
    comment: 'O móvel planejado para o painel de TV da copa ficou excelente, excelente durabilidade aparente.',
    is_approved: true,
    created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
  }
];

export const SEED_PROFESSIONAL_CATEGORIES: { professional_id: string; category_id: string }[] = [
  { professional_id: 'prof-roberto', category_id: 'cat-eletricista' },
  { professional_id: 'prof-roberto', category_id: 'cat-marido-aluguel' },
  { professional_id: 'prof-carlos', category_id: 'cat-encanador' },
  { professional_id: 'prof-carlos', category_id: 'cat-marido-aluguel' },
  { professional_id: 'prof-ana', category_id: 'cat-diarista' },
  { professional_id: 'prof-fabio', category_id: 'cat-pintor' },
  { professional_id: 'prof-marcos', category_id: 'cat-marceneiro' }
];
