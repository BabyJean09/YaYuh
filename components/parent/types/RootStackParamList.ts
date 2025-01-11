// types/RootStackParamList.ts
export type RootStackParamList = {
    PaymentCheckout: undefined; // No params for this screen
    PaymentConfirmation: {
      paymentMethod: string;
      babysitterName: string;
      babysitterId: number;
      totalAmount: number;
    };
  };
  