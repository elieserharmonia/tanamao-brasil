import { supabaseService } from './supabaseService';

export const paymentService = {
  /**
   * Generates a Mercado Pago checkout URL
   * In a real production app, this would call a backend endpoint to hide the Access Token
   */
  async createCheckout(planId: 'featured' | 'premium', professionalId: string) {
    try {
       const plans = {
         'featured': { title: 'Plano Destaque - TáNaMão', price: 19.90 },
         'premium': { title: 'Plano Premium - TáNaMão', price: 39.90 }
       };

       const plan = plans[planId];
       if (!plan) throw new Error('Plano inválido');

       // Simulating a backend call that interacts with Mercado Pago API
       console.log(`[Mercado Pago] Generating preference for ${planId}...`);
       
       // Real flow would call fetch('/api/payments/create-preference')
       const external_reference = `sub_${Date.now()}_${professionalId}`;
       
       // For AIS Preview, we'll simulate the successful redirect after "payment"
       // but in a real app this URL would be from Mercado Pago initialization
       const checkoutUrl = `https://ais-dev-qb5j73bcfmogoon5nnhpbz-49417792959.us-west1.run.app/payment-success?pref_id=MP-${Date.now()}&status=approved&external_reference=${external_reference}&plan=${planId}`;

       return {
         checkoutUrl,
         external_reference
       };
    } catch (error) {
      console.error('Failed to create checkout:', error);
      throw error;
    }
  },

  /**
   * Finalizes the payment process after redirect
   */
  async finalizePayment(professionalId: string, planId: string, mpId: string, amount: number) {
    try {
      // 1. Create Subscription
      const sub = await supabaseService.createSubscription({
        profissional_id: professionalId,
        plano: planId,
        valor: amount,
        mercado_pago_id: mpId
      });

      // 2. Track Payment
      await supabaseService.trackPayment({
        professional_id: professionalId,
        subscription_id: sub.id,
        mercado_pago_id: mpId,
        amount: amount,
        status: 'approved',
        payment_method: 'credit_card' // Simulated
      });

      return true;
    } catch (error) {
      console.error('Finalize payment failed:', error);
      throw error;
    }
  }
};
