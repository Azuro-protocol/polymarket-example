import { Selection, useChain } from "@azuro-org/sdk";
import { useMemo } from "react";
import { useConfig, useReadContract } from "wagmi";
import { useQuery } from '@tanstack/react-query'
import { readContract } from '@wagmi/core'
import { formatUnits } from "viem";
import { formatOdds } from "@/helpers/formatOdds";


export const useOrderBook = (selection: Selection) => {
  const { conditionId, outcomeId } = selection

  const { appChain, contracts, betToken } = useChain()
  const config = useConfig()

  const { data: outcomeIndex, isFetching: isOutcomeIndexFetching } = useReadContract({
    address: contracts.prematchCore.address,
    abi: contracts.prematchCore.abi,
    functionName: 'getOutcomeIndex',
    chainId: appChain.id,
    args: [ BigInt(conditionId), BigInt(outcomeId) ],
    query: {
      refetchOnWindowFocus: false,
    }
  })

  const { data: condition, isFetching: isConditionFetching } = useReadContract({
    address: contracts.prematchCore.address,
    abi: contracts.prematchCore.abi,
    functionName: 'getCondition',
    chainId: appChain.id,
    args: [ BigInt(conditionId) ],
    query: {
      refetchOnWindowFocus: false,
    }
  })

  const outcomeLiquidity = useMemo(() => {
    if (typeof outcomeIndex === 'undefined' || typeof condition === 'undefined') {
      return undefined
    }

    return condition.virtualFunds[Number(outcomeIndex)]
  }, [ outcomeIndex, condition ])

  const createOrderBook = async () => {
    const result = []

    for (let step = 1; step <= 4; step++) {
      const rawBetAmount = outcomeLiquidity! / BigInt(step)
      const odds = await readContract(config, {
        address: contracts.prematchCore.address,
        abi: contracts.prematchCore.abi,
        chainId: appChain.id,
        functionName: 'calcOdds',
        args: [ BigInt(conditionId), rawBetAmount, BigInt(outcomeId) ],
      })

      result.push({
        betAmount: formatUnits(rawBetAmount, betToken.decimals),
        odds: formatOdds(formatUnits(odds, 12))
      })
    }

    return result
  }

  const { data, isFetching } = useQuery({
    queryKey: ['order-book', conditionId, outcomeId],
    queryFn: createOrderBook,
    refetchOnWindowFocus: false,
    enabled: Boolean(outcomeLiquidity)
  })

  return {
    data,
    isFetching: isFetching || isOutcomeIndexFetching || isConditionFetching
  }
}