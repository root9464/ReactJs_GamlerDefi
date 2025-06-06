import { AdditionalInformationSchema, type AdditionalInformation } from '@/modules/table-statistics/hooks/api/usePaymentOrders';
import { fetchData } from '@/shared/utils/utils';
import { useQuery } from '@tanstack/react-query';

const useAccount = (address: string) =>
  useQuery({
    queryKey: ['account', address],
    queryFn: async () => {
      const user = await fetchData<AdditionalInformation>({
        method: 'GET',
        url: `/api/web2/referral/referrer/${address}`,
        schema: AdditionalInformationSchema,
      });

      return user;
    },
    enabled: !!address,
  });

export { useAccount };
