import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { PencilRuler, Save, Trash2 } from 'lucide-react'

export function NoteInput({ onSave }: any) {
  const [note, setNote] = useState('');

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="absolute rounded-full right-3 sm:right-6 bottom-6">
          <PencilRuler />
          Create
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>What's in your mind right now?</DrawerTitle>
          <DrawerDescription>
            <Input onChange={e => setNote(e.target.value)}></Input>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='flex'>
          <DrawerClose asChild>
            <Button onClick={() => note && onSave(note)}>
              <Save />
              Save
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              <Trash2 />
              Discard
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
