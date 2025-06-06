import type { GetProp, TablePaginationConfig, TableProps } from 'antd';
import { Table } from 'antd';
import Column from 'antd/es/table/Column';
import type { SorterResult } from 'antd/es/table/interface';
import { useState, type FC } from 'react';

type TransactionsTableDataType = {
  id: string;
  time: string;
  amount: number;
  action: string;
};

type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<TransactionsTableDataType>['field'];
  sortOrder?: SorterResult<TransactionsTableDataType>['order'];
  filters?: Parameters<GetProp<TableProps<TransactionsTableDataType>, 'onChange'>>[1];
};

export const TransactionsTable: FC<{ tableData: TransactionsTableDataType[] }> = ({ tableData }) => {
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
    <Table dataSource={tableData} onChange={handleTableChange} pagination={tableParams.pagination} rowKey='id'>
      <Column title='Дата' dataIndex='time' key='time' />
      <Column title='Сумма' dataIndex='amount' key='amount' />
      <Column title='Действие' dataIndex='action' key='action' />
    </Table>
  );
};
