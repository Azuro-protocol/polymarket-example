'use client'
import { type MarketOutcome, useSelection, useBaseBetslip } from '@azuro-org/sdk'
import cx from 'clsx';
import { useMemo } from 'react';

import {formatOdds} from '@/helpers/formatOdds';

type OutcomeProps = {
  className?: string
  text: string
  outcome: MarketOutcome
}

export function OutcomeButton(props: OutcomeProps) {
  const { className, text, outcome } = props

  const { items, addItem, removeItem, clear } = useBaseBetslip()
  const { odds, isLocked, isOddsFetching } = useSelection({
    selection: outcome,
    initialOdds: outcome.odds,
    initialStatus: outcome.status,
  })

  const isActive = Boolean(items?.find((item) => {
    const propsKey = `${outcome.coreAddress}-${outcome.lpAddress}-${outcome.gameId}-${outcome.conditionId}-${outcome.outcomeId}`
    const itemKey = `${item.coreAddress}-${item.lpAddress}-${item.game.gameId}-${item.conditionId}-${item.outcomeId}`

    return propsKey === itemKey
  }))

  const formattedOdds = useMemo(() => {
    return odds ? formatOdds(odds) : odds
  }, [ odds ])

  const buttonClassName = cx(`flex justify-between p-2 transition rounded-2xl cursor-pointer w-full disabled:cursor-not-allowed disabled:opacity-50 ${className}`, {
    'bg-slate-300 hover:bg-slate-400': isActive,
    'bg-zinc-50 hover:bg-zinc-100': !isActive,
  })

  const handleClick = () => {
    if (isActive) {
      removeItem(outcome)
    } else {
      clear()
      addItem(outcome)
    }
  }

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      disabled={isLocked}
    >
      <span className="text-zinc-500">{text}</span>
      <span className="font-medium">{isOddsFetching ? '--' : `${formattedOdds.toFixed(2)}¢`}</span>
    </button>
  )
}
