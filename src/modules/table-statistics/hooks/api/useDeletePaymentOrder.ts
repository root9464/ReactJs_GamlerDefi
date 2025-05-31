import { fetchData } from '@/shared/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

type DeletePaymentOrderResponse = {
  message: string;
};

type ValidatorOrder = {
  tx_hash: string;
  tx_query_id: number;
  target_address: string;
  payment_order_id: string;
  status: 'pending';
};

type Options = {
  orderId?: string;
  type: 'all' | 'single';
  amount: number;
  reffererId: number;
};

const ValidationStatus = z.enum(['pending', 'waiting', 'running', 'success', 'failed']);

const ValidatorOrderSchema = z.object({
  message: z.string(),
  tx_hash: z.string(),
  tx_id: z.string(),
  status: ValidationStatus,
});

type ValidatorOrderResponse = z.infer<typeof ValidatorOrderSchema>;

const deletePaymentOrder = async (type: Options['type'], orderId?: string) => {
  const endpoint = type === 'all' ? '/api/web3/referral/payment-orders/all' : `/api/web3/referral/payment-orders/${orderId}`;
  const { data, status, statusText } = await axios.delete<DeletePaymentOrderResponse>(endpoint);
  if (status !== 200) throw new Error(statusText);
  return data;
};

const UpdateEarningBalanceSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  newBalance: z.number(),
  amount: z.number(),
});

type UpdateEarningBalanceResponse = z.infer<typeof UpdateEarningBalanceSchema>;

const updateEarningBalance = async (userId: number, amount: number) => {
  const data = await fetchData<UpdateEarningBalanceResponse>({
    method: 'POST',
    url: `/api/web2/referral/user/${userId}/balance`,
    schema: UpdateEarningBalanceSchema,
    body: {
      amount,
    },
  });
  return data;
};

const useDeletePaymentOrder = (authorId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-payment-order', authorId],
    mutationFn: async ([order, options]: [ValidatorOrder, Options]) => {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 10 * 6 * 2)); // 120000 = 2 minutes
      console.log('start');
      const result = await fetchData<ValidatorOrderResponse>({
        method: 'POST',
        url: '/api/web3/validation/validate',
        schema: ValidatorOrderSchema,
        data: order,
      });
      return { result, options };
    },
    onSuccess: async ({ result: ValidData, options: { type, orderId, amount, reffererId } }) => {
      switch (true) {
        case ValidData.status === 'success' && type === 'all':
          await updateEarningBalance(reffererId, amount);
          return await deletePaymentOrder('all');
        case ValidData.status === 'success' && type === 'single':
          if (!orderId) throw new Error('Order ID is required');
          await updateEarningBalance(reffererId, amount);
          return await deletePaymentOrder('single', orderId);
        default:
          throw new Error('Invalid delete type');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-orders', authorId] });
    },
  });
};

export { useDeletePaymentOrder };
export type { Options, ValidatorOrder };
