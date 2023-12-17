import { useAccount } from 'wagmi'
import { Connect } from './components/Connect'
import { Notebook } from './components/Notebook'
import { NoteInput } from './components/NoteInput'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <div className={'flex items-center bg-slate-800 px-6 py-3' + (isConnected ? ' justify-between' : ' justify-center h-screen flex-col')}>
        <h1 className={'text-slate-200' + (isConnected ? ' text-lg' : ' text-3xl mb-6')}>SiuDNote</h1>
        <Connect />
      </div>
      {isConnected && (
        <div className="px-6 py-3">
          <NoteInput />
          <Notebook />
        </div>
      )}
    </>
  )
}
