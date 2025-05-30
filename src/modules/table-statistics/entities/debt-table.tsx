import type { GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { Button, Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { useState } from 'react';

type DebtTableDataType = {
  order_id: number;
  tickets: string;
  date: string;
  debt_amount: number;
  refferal: string;
};

type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<DebtTableDataType>['field'];
  sortOrder?: SorterResult<DebtTableDataType>['order'];
  filters?: Parameters<GetProp<TableProps<DebtTableDataType>, 'onChange'>>[1];
};

const columns: TableColumnsType<DebtTableDataType> = [
  {
    title: 'Количество билетов',
    dataIndex: 'tickets',
    sorter: (a, b) => a.tickets.localeCompare(b.tickets),
  },
  {
    title: 'Дата',
    dataIndex: 'date',
    sorter: (a, b) => a.date.localeCompare(b.date),
  },
  {
    title: 'Сумма задолженности',
    dataIndex: 'debt_amount',
    sorter: (a, b) => a.debt_amount - b.debt_amount,
  },
  {
    title: 'Реферал',
    dataIndex: 'refferal',
  },
  {
    title: 'Действие',
    dataIndex: 'action',
    render: (_, record) => <Button onClick={() => handleAction(record)}>Действие</Button>,
  },
];

const DEBT_TABLE_DATA: DebtTableDataType[] = [
  {
    order_id: 1,
    tickets: '10',
    date: '2024-01-01',
    debt_amount: 1000,
    refferal: '1000',
  },
  {
    order_id: 2,
    tickets: '10',
    date: '2024-01-01',
    debt_amount: 1000,
    refferal: '1000',
  },
];

const handleAction = (record: DebtTableDataType) => {
  console.log('Вы выбрали запись:', record);
};

export const DebtTable = () => {
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

  return <Table<DebtTableDataType> columns={columns} dataSource={DEBT_TABLE_DATA} onChange={handleTableChange} pagination={tableParams.pagination} />;
};
