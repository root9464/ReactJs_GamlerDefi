import { fromNano } from '@ton/core';
import type { Action } from '../hooks/api/useGetTransactions';

const isTonTransfer = (action: Action): action is Extract<Action, { type: 'TonTransfer' }> => action.type === 'TonTransfer' && 'TonTransfer' in action;

const isJettonTransfer = (action: Action): action is Extract<Action, { type: 'JettonTransfer' }> =>
  action.type === 'JettonTransfer' && 'JettonTransfer' in action;

const isSmartContractExec = (action: Action): action is Extract<Action, { type: 'SmartContractExec' }> =>
  action.type === 'SmartContractExec' && 'SmartContractExec' in action;

type ActionHandler<T> = {
  TonTransfer?: (action: Extract<Action, { type: 'TonTransfer' }>) => T;
  JettonTransfer?: (action: Extract<Action, { type: 'JettonTransfer' }>) => T;
  SmartContractExec?: (action: Extract<Action, { type: 'SmartContractExec' }>) => T;
};

const handleAction = <T>(action: Action, handlers: ActionHandler<T>): T | undefined => {
  if (isTonTransfer(action)) return handlers.TonTransfer?.(action);
  if (isJettonTransfer(action)) return handlers.JettonTransfer?.(action);
  if (isSmartContractExec(action)) return handlers.SmartContractExec?.(action);
  return undefined;
};

const getFirstComment = (actions: Action[]): string => {
  const commentHandler: ActionHandler<string> = {
    TonTransfer: (action) => action.TonTransfer.comment || '',
    JettonTransfer: (action) => action.JettonTransfer.comment || '',
    SmartContractExec: (action) => `Operation: ${action.SmartContractExec.operation}`,
  };

  for (const action of actions) {
    const result = handleAction(action, commentHandler);
    if (result) return result;
  }
  return 'No comment';
};

const getTransactionDirection = (action: Action | undefined, currentAccountAddress: string) => {
  if (!action) return false;

  if (isTonTransfer(action)) {
    return action.TonTransfer.sender.address === currentAccountAddress;
  }

  if (isJettonTransfer(action)) {
    return action.JettonTransfer.sender.address === currentAccountAddress;
  }

  return false;
};

const getAmount = (actions: Action[]): { amount: string; symbol: string } => {
  const amountHandler: ActionHandler<{ amount: string; symbol: string }> = {
    TonTransfer: ({ TonTransfer }) => ({
      amount: fromNano(TonTransfer.amount),
      symbol: 'TON',
    }),
    JettonTransfer: ({ JettonTransfer }) => {
      const amount = Number(JettonTransfer.amount);
      const decimals = JettonTransfer.jetton.decimals;
      return {
        amount: (amount / 10 ** decimals).toFixed(2),
        symbol: JettonTransfer.jetton.symbol,
      };
    },
    SmartContractExec: ({ SmartContractExec }) => ({
      amount: fromNano(SmartContractExec.ton_attached),
      symbol: 'TON',
    }),
  };

  for (const action of actions) {
    const result = handleAction(action, amountHandler);
    if (result) return result;
  }
  return { amount: '0', symbol: 'unknown' };
};

export { getAmount, getFirstComment, getTransactionDirection, handleAction, isJettonTransfer, isSmartContractExec, isTonTransfer };
