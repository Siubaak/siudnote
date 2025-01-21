import { decode } from '../utils/encoder'
import { useEffect, ReactElement } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import dnoteContract from '../contracts/dnote'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

const urlMatReg = /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g

export function NoteMenu({ index, children }: { index: number, children: ReactElement }) {
  const { writeContract, error, isPending, isSuccess } = useWriteContract()

  const handleClick = () => {
    if (isPending) return
    writeContract({
      ...dnoteContract,
      functionName: 'del',
      args: [index, false],
    })
  }

  useEffect(() => {
    if (isSuccess) {
      location.reload()
    } else if (error) {
      alert(error)
    }
  }, [isSuccess, error])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleClick}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}


function NoteContent({ n }: { n: string }) {
  const ts: string[] = n.split(urlMatReg) || [n]
  const us: string[] = n.match(urlMatReg) || []
  const c = ts.reduce<JSX.Element[]>(
    (c, v, i) => c.concat(us[i]
      ? [
          <span key={i}>{v}</span>,
          <a
            className="text-slate-500"
            key={`a${i}`}
            href={us[i]}
            target="_blank"
            onClick={e => e.stopPropagation()}
          >{us[i]}</a>
        ]
      : [<span key={i}>{v}</span>]
  ), [])
  return <>{c}</>
}

export function NoteCarousel() {
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    ...dnoteContract,
    account: address,
    functionName: 'read',
  })

  if (isLoading) {
    return <div className="w-full max-w-md aspect-square flex justify-center items-center">Loading</div>
  }

  if (!(data as string[]).length) {
    return <div className="w-full max-w-md aspect-square flex justify-center items-center">Empty</div>
  }

  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {(data as string[]).map((n, i) => (
          <CarouselItem key={i}>
            <NoteMenu index={i}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <NoteContent n={decode(n)}></NoteContent>
                </CardContent>
              </Card>
            </NoteMenu>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  )
}