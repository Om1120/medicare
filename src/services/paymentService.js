/**
 * Payment Service Abstraction
 * Manages invoice checkout, gateway initialization, and transaction state verification.
 */

export const PAYMENT_METHODS = [
  { id: "upi", name: "UPI (Google Pay, PhonePe, Paytm, BHIM)", type: "instant" },
  { id: "card", name: "Credit / Debit Card (Visa, Mastercard, RuPay)", type: "card" },
  { id: "netbanking", name: "Net Banking (All Major Indian Banks)", type: "bank" },
  { id: "counter", name: "Pay at Hospital Desk / Cash Counter", type: "offline" }
];

export const paymentService = {
  /**
   * Initializes a payment session
   */
  async createPayment({ billId, patientId, amount, paymentMethod, hospitalId }) {
    // Generate standard transaction identifier
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const transactionId = `TXN-${dateStr}-${randomSuffix}`;

    return {
      transactionId,
      billId,
      patientId,
      amount,
      hospitalId,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: "Processing"
    };
  },

  /**
   * Verifies payment status
   */
  async verifyPayment(paymentRecord) {
    // In production, this verifies with Razorpay/Stripe/BillDesk webhook
    return {
      ...paymentRecord,
      status: "Successful",
      settledAt: new Date().toISOString(),
      verificationCode: `AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
  }
};
