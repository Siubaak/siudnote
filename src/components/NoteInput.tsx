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
  const { write: clear, data: clearData } = useContractWrite({
    ...dnoteContract,
    functionName: 'del',
  })
  const { isLoading: isCLearLoading, isSuccess: isClearSuccess } = useWaitForTransaction({ hash: clearData?.hash })

  useEffect(() => {
    (isSuccess || isClearSuccess) && (location.reload())
  }, [isSuccess, isClearSuccess])

  return (
    <div className="flex sm:self-start">
      <input
        disabled={isLoading || isCLearLoading}
        className="border rounded px-2 flex-1"
        placeholder="Write Note"
        onChange={e => setNote(e.target.value)}
      ></input>
      <button
        className="bg-slate-800 rounded ml-2 px-2 py-1 text-slate-100"
        disabled={isLoading || isCLearLoading}
        onClick={() => note && write({ args: [note] })}
      >
        {isLoading ? 'Saving' : 'Save' }
      </button>
      <button
        className="bg-red-800 rounded ml-2 px-2 py-1 text-red-100"
        disabled={isLoading || isCLearLoading}
        onClick={() => clear({ args: [0, true] })}
      >
        {isCLearLoading ? 'Clearing' : 'Clear' }
      </button>
    </div>
  )
}
