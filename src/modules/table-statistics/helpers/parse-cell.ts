import { Cell } from '@ton/core';

const parseCell = (cell: string) => {
  const body = Cell.fromBase64(cell);
  const slice = body.beginParse();
  slice.loadUint(32);
  slice.loadUintBig(64);
  const coins = slice.loadCoins();
  return coins;
};

export { parseCell };
