'use client'
import { useOrderBook } from '@/hooks';
import { Selection } from '@azuro-org/sdk';
import cx from 'clsx'
import React from 'react';

type Props = {
  selection: Selection
}

const OrderBook: React.FC<Props> = ({ selection }) => {
  const { data, isFetching } = useOrderBook(selection)

  if (isFetching) {
    return 'Loading...'
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="">Price</div>
        <div className="">Total</div>
      </div>
      {
        data?.map(({ betAmount, odds }, index) => (
          <div key={betAmount} className={cx("flex items-center justify-between p-1 rounded-lg mt-1", {
            'bg-slate-200': index % 2 === 0
          })}>
            <div className="">{`${odds.toFixed(2)}¢`}</div>
            <div className="">${betAmount}</div>
          </div>
        ))
      }
    </div>
  );
};

export default OrderBook;
