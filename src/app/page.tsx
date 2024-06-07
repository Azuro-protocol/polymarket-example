'use client'
import { GamesQuery, useGames } from '@azuro-org/sdk'
import dayjs from 'dayjs'
import cx from 'clsx'
import Link from 'next/link'

type GameProps = {
  className?: string
  game: GamesQuery['games'][0]
}

function Game(props: GameProps) {
  const { className, game } = props
  const { gameId, title, startsAt } = game

  return (
    <div className={cx(className, "p-2 bg-zinc-200 rounded-lg flex items-center justify-between mt-2 first-of-type:mt-0")}>
      <div className='max-w-[220px] w-full'>
        <Link
          className="text-sm mb-2 hover:underline block whitespace-nowrap overflow-hidden text-ellipsis w-full" 
          href={`/event/${gameId}`}
        >
          {title}
        </Link>
        <div>{dayjs(+startsAt * 1000).format('DD MMM HH:mm')}</div>
      </div>
      <Link 
        className="text-md p-2 rounded-lg bg-zinc-100 hover:underline" 
        href={`/event/${gameId}`}
      >
        All Markets =&gt;
      </Link>
    </div>
  )
}


export default function GamesPage() {
  const { loading, games = [] } = useGames()

  return (
    <>
      {
        loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {
              games.map((game) => (
                <Game key={game.id} game={game} />
              ))
            }
          </div>
        )
      }
    </>
  )
}
