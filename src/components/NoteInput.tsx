import { encode } from '../utils/encoder'
import { useEffect, useState } from 'react'
import { useWriteContract } from 'wagmi'
import dnoteContract from '../contracts/dnote'

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

export function NoteInput() {
  const [note, setNote] = useState('');
  const { writeContract: write, error, isPending: isLoading, isSuccess } = useWriteContract()

  useEffect(() => {
    if (isSuccess) {
      location.reload()
    } else if (error) {
      alert(error)
    }
  }, [isSuccess, error])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-full mx-3 my-6 max-w-md">
          <PencilRuler />
          Create
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>What's in your mind?</DrawerTitle>
          <DrawerDescription>
            <Input
              disabled={isLoading}
              onChange={e => setNote(e.target.value)}
            ></Input>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='flex'>
          <Button disabled={isLoading} onClick={() => note && write({
            ...dnoteContract,
            functionName: 'write',
            args: [encode(note)]
          })}>
            <Save />
            {isLoading ? 'Saving' : 'Save'}
          </Button>
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
