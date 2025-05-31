import type { TokenBalance } from '@/shared/hooks/api/useJettonWallet';
import { useQueryClient } from '@tanstack/react-query';
import { Address, Cell, toNano } from '@ton/core';
import { CHAIN, useTonAddress, useTonConnectUI, type SendTransactionRequest } from '@tonconnect/ui-react';
import { parseCell } from '../../helpers/parse-cell';
import { useDeletePaymentOrder } from './useDeletePaymentOrder';

type PaymentType = 'single' | 'all';
type PaymentParams = {
  type: PaymentType;
  reffererId: number;
  orderId?: string;
  createCellFn: () => Promise<{ cell: string }>;
};

const usePay = (authorId: number) => {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const queryClient = useQueryClient();
  const jettonWallets = queryClient.getQueryData<{ balances: TokenBalance[] }>(['jetton-wallet', address]);
  const jettonWallet = jettonWallets?.balances.find((b) => b.jetton.symbol === 'FROGE');
  const { mutate: deleteOrder } = useDeletePaymentOrder(authorId);

  const processPayment = async (params: PaymentParams) => {
    if (!jettonWallet) return;

    try {
      const { cell } = await params.createCellFn();
      const jettonsAmount = Number(parseCell(cell)) / 10 ** jettonWallet.jetton.decimals;
      const validUntil = Date.now() + 300000; // 5 minutes

      const message: SendTransactionRequest = {
        validUntil,
        network: CHAIN.TESTNET,
        messages: [
          {
            address: Address.parse(jettonWallet.wallet_address.address).toString(),
            amount: toNano(0.4).toString(),
            payload: cell,
          },
        ],
      };

      const { boc } = await tonConnectUI.sendTransaction(message);
      const trHash = Cell.fromBase64(boc).hash().toString('hex');

      deleteOrder([
        {
          tx_hash: trHash,
          tx_query_id: validUntil,
          target_address: address,
          payment_order_id: params.type === 'single' ? params.orderId! : 'null',
          status: 'pending',
        },
        {
          type: params.type,
          amount: jettonsAmount,
          reffererId: params.reffererId,
          ...(params.type === 'single' && { orderId: params.orderId }),
        },
      ]);
    } catch (error) {
      throw new Error((error as Error).message || 'Payment failed');
    }
  };

  const payOrder = (orderId: string, reffererId: number, createCell: (id: string) => Promise<{ cell: string }>) =>
    processPayment({
      type: 'single',
      reffererId,
      orderId,
      createCellFn: () => createCell(orderId),
    });

  const payAllOrders = (reffererId: number, createCell: (id: number) => Promise<{ cell: string }>) =>
    processPayment({
      type: 'all',
      reffererId,
      createCellFn: () => createCell(authorId),
    });

  return { payOrder, payAllOrders };
};

export { usePay };
