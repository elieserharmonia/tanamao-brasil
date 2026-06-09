# Plano de Vendas — TáNaMão Brasil

## Diretriz principal

Os planos devem vender **mais oportunidades de contato**, não apenas recursos técnicos. O profissional quer aparecer melhor, receber mais chamadas no WhatsApp e passar mais confiança para o cliente.

## Planos recomendados para o beta

| Plano | Preço mensal | Objetivo | Benefícios principais |
|---|---:|---|---|
| Gratuito | R$ 0,00 | Atrair base de profissionais | Perfil público, botão WhatsApp, até 3 fotos, aparece nas buscas |
| Destaque Local | R$ 19,90 | Primeira conversão paga | Mais destaque na busca local, selo de confiança, até 10 fotos, relatório básico de contatos |
| Premium Cidade | R$ 39,90 | Maior ticket inicial | Prioridade máxima na cidade, destaque na home, selo Premium, até 20 fotos, relatório completo de leads |

## Por que manter R$ 19,90 e R$ 39,90 no início

1. Reduz a barreira para profissionais autônomos testarem a plataforma.
2. Facilita venda direta via WhatsApp no beta.
3. Permite provar valor antes de subir preço.
4. Evita fricção enquanto a base de clientes ainda está crescendo.

## Evolução futura

Depois de validar demanda com profissionais pagantes, criar produtos avulsos:

- Impulsionamento de 7 dias.
- Banner por cidade/categoria.
- Destaque relâmpago no topo.
- Plano anual com desconto.
- Pacote para pequenas empresas com múltiplos profissionais.

## Métrica de validação

A assinatura só será percebida como justa se o profissional enxergar contatos. Por isso, o dashboard deve mostrar:

- visualizações do perfil;
- cliques no WhatsApp;
- ligações/toques no telefone;
- origem da busca;
- posição aproximada na cidade/categoria.

## Ajustes implementados nesta revisão

- Padronização dos nomes: Gratuito, Destaque Local e Premium Cidade.
- Padronização dos preços: R$ 0,00, R$ 19,90 e R$ 39,90.
- Padronização dos limites de fotos: 3, 10 e 20.
- Inclusão do plano Destaque Local na migration `plans_seed.sql`.
- Alinhamento dos valores no backend, dashboard/admin e tela pública de planos.
