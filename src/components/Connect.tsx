import { BaseError } from 'viem'
import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/ThemeProvider'
import { SunMoon, Sun, Moon, Eraser, LogOut } from 'lucide-react';
import dnoteContract from '../contracts/dnote'

export function Connect() {
  const { connector, isConnected, address } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract: clear, error: clearErr, isSuccess: isClearSuccess } = useWriteContract()
  const { theme, setTheme } = useTheme();
  const shorter = (addr: string | void) => addr && addr.slice(0, 6) + '...' + addr.slice(-4) || ''

  useEffect(() => {
    if (isClearSuccess) {
      location.reload()
    } else if (clearErr) {
      alert(clearErr)
    } else if (error) {
      alert(error)
    }
  }, [isClearSuccess, clearErr, error])

  return (
    <div>
      {!isPending && isConnected && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{address?.substring(2, 5)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {shorter(address)}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              if (theme === 'light') {
                setTheme('dark')
              } else if (theme === 'dark') {
                setTheme('system')
              } else {
                setTheme('light')
              }
            }}>
              {
                theme === 'light' ? <><Sun /> Light</> : (
                  theme === 'dark' ? <><Moon /> Dark</> : <><SunMoon /> System</>
                )
              }
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => clear({
              ...dnoteContract,
              functionName: 'del',
              args: [0, true],
            })}>
              <Eraser />
              Clear
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => disconnect()}>
              <LogOut />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

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
