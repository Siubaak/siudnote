import { BaseError } from 'viem'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export function Connect() {
  const { connector, isConnected, address } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const shorter = (addr: string | void) => addr && addr.slice(0, 6) + '...' + addr.slice(-4) || ''

  return (
    <div>
      {error && <span className="pr-2 text-red-800">{(error as BaseError).shortMessage}</span>}

      {!isPending && isConnected && (<>
        <span title={address} className="pr-2 hidden min-[360px]:inline">{shorter(address)}</span>
        <Button onClick={() => disconnect()}>
          Disconnect
        </Button>
      </>)}

      {connectors
        .filter((x) => x.name === 'MetaMask' && x.id !== connector?.id)
        .map((x) => (
          <Button key={x.id} onClick={() => connect({ connector: x })}>
            {isPending ? 'Connecting' : x.name}
          </Button>
        ))}
    </div>
  )
}
