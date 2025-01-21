import { useAccount } from 'wagmi'
import { Connect } from './components/Connect'
import { NoteCarousel } from './components/NoteCarousel'
import { NoteInput } from './components/NoteInput'

export default function App() {
  const { isConnected } = useAccount()

  return (
    <div className="flex flex-col h-screen">
      <div className={'flex items-center px-3 sm:px-6 py-3' + (isConnected ? ' justify-between' : ' justify-center h-screen flex-col')}>
        <h1 className={isConnected ? ' text-lg' : ' text-3xl mb-6'}>SiuDNote</h1>
        <Connect />
      </div>
      {isConnected && (
        <div className="m-3 h-full flex flex-col items-center">
          <NoteCarousel />
          <NoteInput />
        </div>
      )}
    </div>
  )
}
