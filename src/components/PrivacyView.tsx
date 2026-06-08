import React from 'react';

export default function PrivacyView() {
  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase italic">Política de Privacidade</h1>
          <p className="text-slate-500 font-medium italic uppercase text-xs tracking-widest">Respeitamos seus dados. Sempre.</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-400">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">1. Coleta de Dados</h2>
            <p>
              Coletamos as informações necessárias para criar e gerenciar seu perfil (Nome, E-mail, Telefone, Localização). 
              Para profissionais, também coletamos dados sobre seus serviços e fotos de portfólio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">2. Uso das Informações</h2>
            <p>
              Seus dados são usados exclusivamente para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Exibir seu perfil profissional para potenciais clientes.</li>
              <li>Permitir que clientes entrem em contato via WhatsApp.</li>
              <li>Enviar notificações importantes sobre sua conta ou pagamentos.</li>
              <li>Melhorar a experiência da plataforma através de analytics anônimos.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">3. Compartilhamento</h2>
            <p>
              Não vendemos seus dados para terceiros. 
              Ao clicar no botão do WhatsApp em um perfil, o cliente terá acesso ao número de telefone que você cadastrou publicamente. 
              Dados de pagamento são processados de forma criptografada pelo Mercado Pago.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">4. Seus Direitos</h2>
            <p>
              Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento através das configurações da sua conta ou entrando em contato com nosso suporte.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">5. Cookies</h2>
            <p>
              Utilizamos cookies e tecnologias similares para manter sua sessão ativa e personalizar sua navegação. 
              Você pode desativar o uso de cookies nas configurações do seu navegador.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
