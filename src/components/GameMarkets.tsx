'use client'
import { type GameMarkets } from '@azuro-org/sdk'
import { OutcomeButton } from '@/components'


type GameMarketsProps = {
  markets: GameMarkets
}

export function GameMarkets(props: GameMarketsProps) {
  const { markets } = props

  return (
    <div className="max-w-[800px] mx-auto mt-12 space-y-6">
      {
        markets.map(({ name, outcomeRows }) => {
          return outcomeRows.map((outcomes) => (
            <div key={`${name}-${outcomes[0].selectionName}`} className="p-2 bg-slate-200 rounded-lg mt-2 first-of-type:mt-0 text-lg font-semibold flex items-center justify-between">
              <div className="">{name} {outcomes[0].selectionName}</div>
              <div className="flex w-full max-w-[50%] space-x-1">
              {
                outcomes.map((outcome, index) => (
                  <OutcomeButton
                    key={outcome.outcomeId}
                    text={index % 2 ? 'No' : 'Yes'}
                    outcome={outcome}
                  />
                ))
              }
              </div>
            </div>
          ))
        })
      }
    </div>
  )
}
