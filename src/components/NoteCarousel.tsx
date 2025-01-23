import { decode } from '../utils/encoder'
import { ReactElement } from 'react'

import { Stack } from '@/components/ui/stack'
import { Card, CardContent } from '@/components/ui/card'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { BookDashed } from 'lucide-react'

const urlMatReg = /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g

export function NoteMenu({ children, onDelete }: any) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function NoteContent({ n }: { n: string }) {
  const ts: string[] = n.split(urlMatReg) || [n]
  const us: string[] = n.match(urlMatReg) || []
  const c = ts.reduce<ReactElement[]>(
    (c, v, i) => c.concat(us[i]
      ? [
          <span key={i}>{v}</span>,
          <a
            className="underline text-[hsl(var(--input))]"
            key={`a${i}`}
            href={us[i]}
            target="_blank"
            onClick={e => e.stopPropagation()}
          >{us[i]}</a>
        ]
      : [<span key={i}>{v}</span>]
  ), [])
  return <div className="break-all">{c}</div>
}

export function NoteCarousel({ notes, onDelete }: any) {
  if (!(notes as string[])?.length) {
    return <div className="w-[300px] h-[300px] aspect-square flex justify-center items-center">
      <BookDashed size={56} />
    </div>
  }

  const bgMap = [
    'bg-[hsl(var(--primary))]',
    'bg-[hsl(var(--chart-2))]',
    'bg-[hsl(var(--chart-3))]',
    'bg-[hsl(var(--chart-4))]',
    'bg-[hsl(var(--chart-5))]',
  ]

  return (
    <Stack
      sendToBackOnClick
      cardsData={(notes as string[]).map((n, i) => ({
        id: i,
        children: (
          <NoteMenu index={i} onDelete={() => onDelete(i)}>
            <Card className="border-0">
              <CardContent className={'flex aspect-square items-center justify-center p-6 select-none text-lg text-primary-foreground ' + bgMap[i % 5]}>
                <NoteContent n={decode(n)}></NoteContent>
              </CardContent>
            </Card>
          </NoteMenu>
        )
      }))}
    ></Stack>
  )
}