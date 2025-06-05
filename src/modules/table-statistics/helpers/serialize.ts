import { formatUnixToDate } from '@/shared/utils/utils';
import type { Action, ResponseGetTrHistory } from '../hooks/api/useGetTransactions';
import type { Referrals } from '../hooks/api/useRefferals';
import { isJettonTransfer } from '../utils/transactions';

type TrimmedUser = {
  user_id: number;
  name: string | null;
  telegram: string;
  refer_id: number | null | undefined;
  percent?: number;
  createdAt?: string | null;
  referred_users?: TrimmedUser[];
};

const trimUserData = (user: Referrals, level: number = 0): TrimmedUser => {
  const baseData = {
    user_id: user.user_id,
    name: user.name,
    telegram: user.telegram,
    refer_id: user.refer_id,
  };

  const result: TrimmedUser = { ...baseData };

  if (level >= 1) {
    result.createdAt = user.createdAt;
    result.percent = level === 1 ? 20 : level === 2 ? 2 : 0;
  }

  if (user.referred_users?.length) {
    result.referred_users = user.referred_users.map((ref) => trimUserData(ref, level + 1));
  }

  return result;
};

const isFrogeJettonTransfer = (action: Action): action is Extract<Action, { type: 'JettonTransfer' }> =>
  isJettonTransfer(action) && action.JettonTransfer.jetton.symbol === 'FROGE';

function filterFrogeTransfers(data: ResponseGetTrHistory) {
  return data.events.flatMap((event) =>
    event.actions
      .filter(isJettonTransfer)
      .filter(isFrogeJettonTransfer)
      .map((action) => ({
        id: event.event_id,
        time: formatUnixToDate(event.timestamp),
        amount: Number(action.JettonTransfer.amount) / 10 ** action.JettonTransfer.jetton.decimals,
        action: action.simple_preview.description,
      })),
  );
}

export { filterFrogeTransfers, trimUserData };
