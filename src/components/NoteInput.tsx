import { useEffect, useState } from 'react'
import dnoteContract from '../contracts/dnote'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

export function NoteInput() {
  const [note, setNote] = useState('');
  const { write, data } = useContractWrite({
    ...dnoteContract,
    functionName: 'write',
  })
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash })

  useEffect(() => {
    isSuccess && (location.reload())
  }, [isSuccess])

  return (
    <div className="flex">
      <input
        disabled={isLoading}
        className="border rounded mr-2 px-2"
        placeholder="Write Note"
        onChange={e => setNote(e.target.value)}
      ></input>
      <button
        className="bg-slate-800 rounded px-2 py-1 text-slate-200"
        disabled={isLoading}
        onClick={() => note && write({ args: [note] })}
      >
        {isLoading ? 'Saving' : 'Save' }
      </button>
    </div>
  )
}
