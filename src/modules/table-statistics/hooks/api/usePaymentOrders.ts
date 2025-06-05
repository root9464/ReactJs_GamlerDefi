import type { Extend } from '@/shared/types/utilies';
import { fetchData } from '@/shared/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';

const LevelSchema = z.object({
  level_number: z.number(),
  rate: z.number(),
  amount: z.number(),
  address: z.string(),
});

const PaymentOrderSchema = z.object({
  id: z.string(),
  leader_id: z.number(),
  referrer_id: z.number(),
  referral_id: z.number(),
  total_amount: z.number(),
  ticket_count: z.number(),
  levels: z.array(LevelSchema),
  created_at: z.number(),
});

type Level = z.infer<typeof LevelSchema>;
type PaymentOrder = z.infer<typeof PaymentOrderSchema>;

const BaseUserSchema = z.object({
  user_id: z.number(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  telegram: z.string().regex(/^@.+/, 'Telegram must start with @ and contain at least one character'),
  photo_path: z.string().nullable(),
  refer_id: z.number().nullable().optional(),
  wallet_address: z.string().length(48, 'Wallet address must be 48 characters long').nullable(),
  referral_program_choice: z.boolean(),
});

const ReferralProgramChoiceSchema = BaseUserSchema.extend({
  createdAt: z.iso.datetime({ message: 'createdAt must be a valid ISO 8601 date string' }).nullable(),
});

const AdditionalInformationSchema = BaseUserSchema.extend({
  referred_users: z.array(ReferralProgramChoiceSchema).optional(),
});

type BaseUser = z.infer<typeof BaseUserSchema>;
type AdditionalInformation = z.infer<typeof AdditionalInformationSchema>;
type ReferralProgramChoice = z.infer<typeof ReferralProgramChoiceSchema>;

type AdditionalProperties = Pick<BaseUser, 'telegram'>;
type PaymentOrdersResponse = Extend<PaymentOrder, AdditionalProperties>;

const usePaymentOrder = (authorId: number) =>
  useQuery({
    queryKey: ['payment-orders', authorId],
    queryFn: async () => {
      const paymentOrders = await fetchData<PaymentOrder[]>({
        method: 'GET',
        url: `/api/web3/referral/${authorId}/payment-orders`,
        schema: z.array(PaymentOrderSchema),
      });

      const additionalInfoPromises = paymentOrders.map((order) =>
        fetchData<AdditionalInformation>({
          method: 'GET',
          url: `/api/web2/referral/referrer/${order.referral_id}`,
          schema: AdditionalInformationSchema,
        }),
      );

      const additionalInfos = await Promise.all(additionalInfoPromises);

      return paymentOrders.map<PaymentOrdersResponse>((order, index) => ({
        ...order,
        telegram: additionalInfos[index].telegram,
      }));
    },
    enabled: !!authorId,
  });

export { BaseUserSchema, PaymentOrderSchema, ReferralProgramChoiceSchema, usePaymentOrder };
export type { Level, PaymentOrder, ReferralProgramChoice };
