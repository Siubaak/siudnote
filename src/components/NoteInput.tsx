import { encode } from '../utils/encoder';
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
} from "@/components/ui/drawer"

export function NoteInput() {
  const [note, setNote] = useState('');
  const { writeContract: write, error, isPending: isLoading, isSuccess } = useWriteContract()
  const { writeContract: clear, error: clearErr, isPending: isCLearLoading, isSuccess: isClearSuccess } = useWriteContract()

  useEffect(() => {
    if (isSuccess || isClearSuccess) {
      location.reload()
    } else if (error) {
      alert(error)
    } else if (clearErr) {
      alert(clearErr)
    }
  }, [isSuccess, error, isClearSuccess, clearErr])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-full mx-3 my-6 max-w-md">Add</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>What's in your mind?</DrawerTitle>
          <DrawerDescription>
            <Input
              disabled={isLoading || isCLearLoading}
              onChange={e => setNote(e.target.value)}
            ></Input>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='flex'>
          <Button disabled={isLoading || isCLearLoading} onClick={() => note && write({
            ...dnoteContract,
            functionName: 'write',
            args: [encode(note)]
          })}>{isLoading ? 'Saving' : 'Save'}</Button>
          <Button disabled={isLoading || isCLearLoading} onClick={() => note && clear({
            ...dnoteContract,
            functionName: 'del',
            args: [0, true],
          })}>{isCLearLoading ? 'Clearing' : 'Clear'}</Button>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
