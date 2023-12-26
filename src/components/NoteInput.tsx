import { encode } from '../utils/encoder';
import { useEffect, useState } from 'react'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import dnoteContract from '../contracts/dnote'

export function NoteInput() {
  const [note, setNote] = useState('');
  const { write, data, error } = useContractWrite({
    ...dnoteContract,
    functionName: 'write',
  })
  const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash })
  const { write: clear, data: clearData, error: clearErr } = useContractWrite({
    ...dnoteContract,
    functionName: 'del',
  })
  const { isLoading: isCLearLoading, isSuccess: isClearSuccess } = useWaitForTransaction({ hash: clearData?.hash })

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
    <div className="flex sm:self-start pt-2 sm:mr-3">
      <input
        disabled={isLoading || isCLearLoading}
        className="border rounded px-2 flex-1"
        placeholder="Write Note"
        onChange={e => setNote(e.target.value)}
      ></input>
      <button
        className="bg-slate-800 rounded ml-2 px-2 py-1 text-slate-100"
        disabled={isLoading || isCLearLoading}
        onClick={() => note && write({ args: [encode(note)] })}
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
