import { decode } from '../utils/encoder'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import dnoteContract from '../contracts/dnote'

const urlMatReg = /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g

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

export function Notebook() {
  const { address } = useAccount()
  const { data, isLoading } = useContractRead({
    ...dnoteContract,
    account: address,
    functionName: 'read',
  })
  const { write: del, data: delData, error: delErr } = useContractWrite({
    ...dnoteContract,
    functionName: 'del',
  })
  const {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
  } = useWaitForTransaction({ hash: delData?.hash })

  useEffect(() => {
    if (isDelSuccess) {
      location.reload()
    } else if (delErr) {
      alert(delErr)
    }
  }, [isDelSuccess, delErr])

  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <div className="flex flex-wrap overflow-y-scroll no-scrollbar self-center sm:self-start">
      {isLoading ? <div className="text-slate-400 my-2 sm:mx-2">Loading</div> : (
        (data as string[]).length ? (data as string[]).map((n, i) => (
          <div
            className={
              'bg-slate-100 rounded px-3 py-2 text-slate-800 my-2 relative break-all sm:mx-2'
              + (activeIdx === i ? ' bg-slate-200' : '')
            }
            key={i}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(-1)}
          >
            <NoteContent n={decode(n)}></NoteContent>
            <div
              className={
                'absolute right-0 bottom-0 text-red-800 bg-red-100 w-6 h-6 pl-1 rounded-tl-xl flex justify-center items-center cursor-pointer'
                + (activeIdx === i ? '' : ' hidden')
              }
              onClick={() => {
                if (isDelLoading) return
                del({ args: [i, false] })
              }}
            >
              <span>X</span>
            </div>
          </div>
        )) : <div className="text-slate-400 my-2 sm:mx-2">Empty</div>
      )}
    </div>
  )
}
