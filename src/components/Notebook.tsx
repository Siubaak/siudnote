import { useEffect } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import dnoteContract from '../contracts/dnote'

export function Notebook() {
  const { address } = useAccount()
  const { data, isLoading } = useContractRead({
    ...dnoteContract,
    account: address,
    functionName: 'read',
  })
  const { write: del, data: delData } = useContractWrite({
    ...dnoteContract,
    functionName: 'del',
  })
  const {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
  } = useWaitForTransaction({ hash: delData?.hash })

  useEffect(() => {
    isDelSuccess && (location.reload())
  }, [isDelSuccess])

  return (
    <div className="flex flex-wrap self-start">
      {isLoading ? <div className="text-slate-400">Loading</div> : (
        (data as string[]).length ? (data as string[]).map((n, i) => (
          <div
            className="bg-slate-100 rounded px-2 py-1 text-slate-800 mr-2 mb-2"
            key={i}
            onClick={() => {
              if (isDelLoading) return
              del({ args: [i] })
            }}
          >{n}</div>
        )) : <div className="text-slate-400">Empty</div>
      )}
    </div>
  )
}
