import { fetchData, validateResult } from '@/shared/utils/utils';
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
  payment_order_id?: string;
  status: 'pending';
};

type Options = {
  orderId?: string;
  type: 'all' | 'single';
  array: Array<{
    amount: number;
    reffererId: number;
  }>;
};

const ValidationStatus = z.enum(['pending', 'waiting', 'running', 'success', 'failed']);

const ValidatorOrderSchema = z.object({
  message: z.string(),
  tx_hash: z.string(),
  tx_id: z.string(),
  status: ValidationStatus,
});

type ValidatorOrderResponse = z.infer<typeof ValidatorOrderSchema>;

const UpdateEarningBalanceSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  newBalance: z.number(),
  amount: z.number(),
});

type UpdateEarningBalanceResponse = z.infer<typeof UpdateEarningBalanceSchema>;

const updateEarningBalance = async (userId: number, amount: number) => {
  const { data, status, statusText } = await axios.patch<UpdateEarningBalanceResponse>(`/api/web2/referral/user/${userId}/balance`, {
    amount,
  });
  if (status !== 200) throw new Error(statusText);

  return validateResult(data, UpdateEarningBalanceSchema);
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
    onSuccess: async ({ result: ValidData, options: { type, orderId, array } }) => {
      switch (true) {
        case ValidData.status === 'success' && type === 'all':
          array.forEach(async (item) => {
            await updateEarningBalance(item.reffererId, item.amount);
          });
          return await fetchData<DeletePaymentOrderResponse>({
            method: 'DELETE',
            url: '/api/web3/referral/payment-orders/all',
            schema: z.object({
              message: z.string(),
            }),
          });
        case ValidData.status === 'success' && type === 'single':
          if (!orderId) throw new Error('Order ID is required');
          await updateEarningBalance(array[0].reffererId, array[0].amount);
          return await fetchData<DeletePaymentOrderResponse>({
            method: 'DELETE',
            url: `/api/web3/referral/payment-orders`,
            schema: z.object({
              message: z.string(),
            }),
            params: {
              order_id: orderId,
            },
          });
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
