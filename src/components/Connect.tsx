import { BaseError } from 'viem'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function Connect() {
  const { connector, isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  const shorter = (addr: string | void) => addr && addr.slice(0, 8) + '...' + addr.slice(-6) || ''

  return (
    <div>
      {error && <span className="pr-2 text-red-800">{(error as BaseError).shortMessage}</span>}

      {isConnected && (<>
        <span title={address} className="pr-2 text-slate-200">{shorter(address)}</span>
        <button className="bg-red-100 rounded px-2 py-1 text-red-800" onClick={() => disconnect()}>
          Disconnect
        </button>
      </>)}

      {connectors
        .filter((x) => x.name === 'MetaMask' && x.ready && x.id !== connector?.id)
        .map((x) => (
          <button className="bg-slate-100 rounded px-2 py-1 text-slate-800" key={x.id} onClick={() => connect({ connector: x })}>
            {isLoading && x.id === pendingConnector?.id ? 'Connecting' : x.name}
          </button>
        ))}
    </div>
  )
}
