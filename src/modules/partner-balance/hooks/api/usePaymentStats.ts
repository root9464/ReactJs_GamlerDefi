import { PaymentOrderSchema, type PaymentOrder } from '@/modules/table-statistics/hooks/api/usePaymentOrders';
import { validateResult } from '@/shared/utils/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

const useDebt = (authorId: number) =>
  useQuery({
    queryKey: ['debt', authorId],
    queryFn: async () => {
      const { data, status, statusText } = await axios.get<PaymentOrder[]>(`/api/web3/referral/${authorId}/payment-orders`);
      if (status !== 200) throw new Error(statusText);
      const paymentOrders = validateResult(data, z.array(PaymentOrderSchema));
      const debt = paymentOrders.reduce((acc, order) => acc + order.total_amount, 0);
      return debt;
    },
    enabled: !!authorId,
  });

const EarningsSchema = z.object({
  balance: z.number(),
});

type Earnings = z.infer<typeof EarningsSchema>;

const useEarnings = (authorId: number) =>
  useQuery({
    queryKey: ['earnings', authorId],
    queryFn: async () => {
      const { data, status, statusText } = await axios.get<Earnings>(`/api/web2/referral/user/${authorId}/balance`);
      if (status !== 200) throw new Error(statusText);
      const earnings = validateResult(data, EarningsSchema);
      return earnings;
    },
  });

export { useDebt, useEarnings };
