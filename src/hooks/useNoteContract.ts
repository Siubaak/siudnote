import { useConfig, useAccount, useReadContract, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { encode } from '@/utils/encoder'
import { useState } from 'react'
import dnoteContract from '../contracts/dnote'

export function useNoteContract() {
  const config = useConfig()
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    ...dnoteContract,
    account: address,
    functionName: 'read',
  })
  const { writeContract, isPending } = useWriteContract()
  const [isWaiting, setWaiting] = useState(false)
  return {
    notes: data,
    isLoading: isLoading || isPending || isWaiting,
    write(note: string) {
      setWaiting(true)
      writeContract({
        ...dnoteContract,
        functionName: 'write',
        args: [encode(note)]
      }, {
        async onSuccess(hash) {
          try {
            await waitForTransactionReceipt(config, { hash })
            location.reload()
          } catch (error: any) {
            alert(error.shortMessage)
            setWaiting(false)
          }
        },
        onError(error) {
          alert(error.shortMessage)
          setWaiting(false)
        },
      })
    },
    del(index: number | true) {
      setWaiting(true)
      writeContract({
        ...dnoteContract,
        functionName: 'del',
        args: index === true ? [0, index] : [index, false],
      }, {
        async onSuccess(hash) {
          try {
            await waitForTransactionReceipt(config, { hash })
            location.reload()
          } catch (error: any) {
            alert(error.shortMessage)
            setWaiting(false)
          }
        },
        onError(error) {
          alert(error.shortMessage)
          setWaiting(false)
        },
      })
    }
  }
}
