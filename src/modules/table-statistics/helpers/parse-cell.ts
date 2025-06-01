import { Address, Cell, Dictionary, type DictionaryValue } from '@ton/core';

const jettonsDictionaryValue: DictionaryValue<bigint> = {
  serialize: (src, builder) => {
    builder.storeCoins(src);
  },
  parse: (src) => {
    return src.loadCoins();
  },
};

const parseCell = (cell: string) => {
  const body = Cell.fromBase64(cell);
  const slice = body.beginParse();
  slice.loadUint(32);
  slice.loadUintBig(64);
  const coins = slice.loadCoins();
  return coins;
};

const parseDictionary = (cell: Cell) => {
  const dictionary = Dictionary.load(Dictionary.Keys.Address(), jettonsDictionaryValue, cell);
  const entries: { address: Address; amount: bigint }[] = [];
  for (const key of dictionary.keys()) {
    const amount = dictionary.get(key);
    if (amount !== undefined) {
      entries.push({ address: key, amount });
    }
  }
  return entries;
};

const deepParseCell = (cell: string) => {
  const body = Cell.fromBase64(cell);
  const slice = body.beginParse();
  const op_code = slice.loadUint(32);
  const query_id = slice.loadUintBig(64);
  const jetton_amount = slice.loadCoins();
  const reciver_address = slice.loadAddress();
  slice.loadUint(2);
  slice.loadUint(1);
  const ton_fee_smart = slice.loadCoins();
  slice.loadBit();
  const dict = parseDictionary(slice.loadRef());
  return { op_code, query_id, jetton_amount, reciver_address, ton_fee_smart, dict };
};

export { deepParseCell, parseCell };
