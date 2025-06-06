import { useJettonWallet } from '@/shared/hooks/api/useJettonWallet';
import { Address, Cell, toNano } from '@ton/core';
import { CHAIN, useTonAddress, useTonConnectUI, type SendTransactionRequest } from '@tonconnect/ui-react';
import { useDeletePaymentOrder } from './useDeletePaymentOrder';

type CreateCellFn<T> = (id: T) => Promise<{ cell: string }>;

const usePay = (authorId: number) => {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const { data: jettonWallets, isError: isErrorJettonWallet } = useJettonWallet({ address });
  if (isErrorJettonWallet) throw new Error('Error fetching jetton wallet');
  const jettonWallet = jettonWallets?.balances.find((b) => b.jetton.symbol === 'FROGE');
  const { mutate: deleteOrder } = useDeletePaymentOrder(authorId);

  const payProcess = async (cell: string, commission_count: number) => {
    if (!jettonWallet) return;
    try {
      const validUntil = Date.now() + 300000; // 5 minutes
      const message: SendTransactionRequest = {
        validUntil,
        network: CHAIN.TESTNET,
        messages: [
          {
            address: Address.parse(jettonWallet.wallet_address.address).toString(),
            amount: toNano(commission_count).toString(),
            payload: cell,
          },
        ],
      };
      const { boc } = await tonConnectUI.sendTransaction(message);
      const trHash = Cell.fromBase64(boc).hash().toString('hex');
      return { trHash, validUntil, cell };
    } catch (error) {
      throw new Error((error as Error).message || 'Error sending transaction');
    }
  };

  const payAllOrders = async (createCell: CreateCellFn<number>, array: Array<{ amount: number; reffererId: number }>) => {
    if (!jettonWallet) return;
    const { cell } = await createCell(authorId);
    const trRes = await payProcess(cell, array.length * 0.4);
    if (!trRes) return;
    const { trHash, validUntil } = trRes;

    deleteOrder([
      {
        tx_hash: trHash,
        tx_query_id: validUntil,
        target_address: address,
        status: 'pending',
      },
      { type: 'all', array },
    ]);
  };

  const payOrder = async (createCell: CreateCellFn<string>, orderId: string, obj: { amount: number; reffererId: number }) => {
    if (!jettonWallet) return;
    const { cell } = await createCell(orderId);
    const trRes = await payProcess(cell, 0.4);
    if (!trRes) return;
    const { trHash, validUntil } = trRes;
    deleteOrder([
      {
        tx_hash: trHash,
        tx_query_id: validUntil,
        target_address: address,
        payment_order_id: orderId,
        status: 'pending',
      },
      { type: 'single', array: [obj] },
    ]);
  };

  return { payAllOrders, payOrder };
};

export { usePay };
