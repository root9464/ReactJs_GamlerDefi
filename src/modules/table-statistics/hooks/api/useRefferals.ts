import { fetchData } from '@/shared/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { ReferralProgramChoiceSchema, type ReferralProgramChoice } from './usePaymentOrders';

const useRefferals = (userId: number) =>
  useQuery({
    queryKey: ['refferals', userId],
    queryFn: async () => {
      const refferals = await fetchData<ReferralProgramChoice[]>({
        method: 'GET',
        url: `/api/web2/referral/referrer/${userId}`,
        schema: z.array(ReferralProgramChoiceSchema),
      });
      return refferals;
    },
  });

export { useRefferals };
