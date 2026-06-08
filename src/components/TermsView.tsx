import React from 'react';

export default function TermsView() {
  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase italic">Termos de Uso</h1>
          <p className="text-slate-500 font-medium italic uppercase text-xs tracking-widest">Última atualização: 07 de Junho de 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-400">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma TáNaMão Brasil, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, você não deve acessar o serviço.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">2. Descrição do Serviço</h2>
            <p>
              O TáNaMão Brasil é um marketplace que conecta clientes a profissionais autônomos. 
              Nós não prestamos os serviços listados e não somos empregadores dos profissionais cadastrados. 
              Toda a negociação e execução do serviço são de responsabilidade exclusiva entre as partes envolvidas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">3. Responsabilidades do Profissional</h2>
            <p>
              O profissional compromete-se a fornecer informações verídicas, manter seu perfil atualizado e prestar os serviços de forma ética e profissional. 
              A falsificação de informações ou certificados resultará em banimento imediato.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">4. Pagamentos e Assinaturas</h2>
            <p>
              O processamento de pagamentos para planos de destaque e premium é realizado pelo Mercado Pago. 
              Assinaturas podem ser canceladas a qualquer momento através do painel do profissional.
              Não realizamos estornos para períodos já utilizados.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic">5. Limitação de Responsabilidade</h2>
            <p>
              O TáNaMão Brasil não se responsabiliza por danos, perdas ou prejuízos decorrentes da contratação de serviços através da plataforma. 
              Recomendamos que o cliente sempre verifique as referências e avaliações antes de fechar qualquer negócio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
