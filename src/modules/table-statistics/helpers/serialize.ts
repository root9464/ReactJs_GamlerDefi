import type { Referrals } from '../hooks/api/useRefferals';

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

export { trimUserData };
