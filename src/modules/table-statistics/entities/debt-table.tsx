import { useQueryClient } from '@tanstack/react-query';
import { useTonAddress } from '@tonconnect/ui-react';
import type { GetProp, TablePaginationConfig, TableProps } from 'antd';
import { Button, Table } from 'antd';
import Column from 'antd/es/table/Column';
import type { SorterResult } from 'antd/es/table/interface';
import { useState, type FC } from 'react';
import { usePay } from '../hooks/api/usePay';
import { usePayOrder } from '../hooks/api/usePayOrder';
import type { AdditionalInformation } from '../hooks/api/usePaymentOrders';

type DebtTableDataType = {
  order_id: string;
  tickets: number;
  date: string;
  debt_amount: number;
  refferal: string;
  refferer_id: number;
};

type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<DebtTableDataType>['field'];
  sortOrder?: SorterResult<DebtTableDataType>['order'];
  filters?: Parameters<GetProp<TableProps<DebtTableDataType>, 'onChange'>>[1];
};

export const DebtTable: FC<{ tableData: DebtTableDataType[] }> = ({ tableData }) => {
  const address = useTonAddress();
  const queryClient = useQueryClient();
  const cacheUserData: AdditionalInformation | undefined = queryClient.getQueryData(['account', address]);
  const { mutateAsync: createCell, isPending, isSuccess } = usePayOrder();
  const { payOrder } = usePay(cacheUserData?.user_id ?? 0);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams((prev) => ({
      ...prev,
      pagination,
    }));
  };

  return (
    <Table dataSource={tableData} onChange={handleTableChange} pagination={tableParams.pagination} rowKey='order_id'>
      <Column title='Количество билетов' dataIndex='tickets' sorter={(a, b) => a.tickets - b.tickets} key='tickets' />
      <Column title='Дата' dataIndex='date' sorter={(a, b) => a.date.localeCompare(b.date)} key='date' />
      <Column title='Сумма задолженности' dataIndex='debt_amount' sorter={(a, b) => a.debt_amount - b.debt_amount} key='debt_amount' />
      <Column title='Реферал' dataIndex='refferal' key='refferal' />
      <Column
        title={isPending ? 'Ожидание...' : isSuccess ? 'Выполнено' : 'Действие'}
        dataIndex='action'
        render={(_, record: DebtTableDataType) => (
          <Button
            key={record.order_id}
            onClick={() => payOrder(createCell, record.order_id, { amount: record.debt_amount, reffererId: record.refferer_id })}>
            Действие
          </Button>
        )}
        key='action'
      />
    </Table>
  );
};
