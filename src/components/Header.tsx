'use client'
import React, { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { SelectAppChain } from '@/components'
import { reconnect } from '@wagmi/core'
import { useConfig } from 'wagmi'
import Link from 'next/link'

export function Header() {
  const config = useConfig()

  useEffect(() => {
    ;(async () => {
      try {
        await reconnect(config)
      }
      catch {}
    })()
  }, [])

  return (
    <header className="flex items-center py-3.5 border-b border-zinc-200">
      <Link href="/" className="text-xl font-semibold">Azuro Betting</Link>
      <div className="ml-auto flex items-center">
        <SelectAppChain />
        <ConnectButton chainStatus="none" />
      </div>
    </header>
  )
}
