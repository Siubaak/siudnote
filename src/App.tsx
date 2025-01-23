import { useAccount } from 'wagmi'
import { Connect } from '@/components/Connect'
import { NoteCarousel } from '@/components/NoteCarousel'
import { NoteInput } from '@/components/NoteInput'
import { MagnetLines } from '@/components/ui/magnet-lines'

import { ThemeProvider } from '@/components/ThemeProvider'

export default function App() {
  const { isConnected } = useAccount()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MagnetLines className="absolute inset-0 z-[-1]" lineColor="hsla(var(--border))" containerSize="full"></MagnetLines>
      <div className="flex flex-col h-screen">
        <div className={'flex items-center px-3 sm:px-6 py-3' + (isConnected ? ' justify-between' : ' justify-center h-screen flex-col')}>
          <h1 className={isConnected ? ' text-lg' : ' text-3xl mb-6'}>SiuDNote</h1>
          <Connect />
        </div>
        {isConnected && (
          <>
            <div className="h-full flex justify-center items-center pb-36">
              <NoteCarousel />
            </div>
            <NoteInput />
          </>
        )}
      </div>
    </ThemeProvider>
  )
}
