import { fetchData } from '@/shared/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod/v4';

const PaymentOrderSchema = z.object({
  cell: z.string(),
});

type PaymentOrder = z.infer<typeof PaymentOrderSchema>;

const usePayOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['pay-order'],
    mutationFn: async (orderId: string) =>
      fetchData<PaymentOrder>({
        method: 'GET',
        url: `/api/web3/referral/payment-orders/pay`,
        schema: PaymentOrderSchema,
        params: {
          order_id: orderId,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment-order', data.cell] });
    },
  });
};

const usePayAllOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['pay-all-orders'],
    mutationFn: async (authorId: number) =>
      fetchData<PaymentOrder>({
        method: 'GET',
        url: `/api/web3/referral/payment-orders/all`,
        schema: PaymentOrderSchema,
        params: {
          author_id: authorId,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment-order', data.cell] });
    },
  });
};

export { usePayAllOrders, usePayOrder };
export type { PaymentOrder };
