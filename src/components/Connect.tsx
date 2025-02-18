import { useAccount, useConnect, useDisconnect } from 'wagmi'
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

export function Connect({ onClear }: any) {
  const { connector, isConnected, address } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { theme, setTheme } = useTheme();
  const shorter = (addr: string | void) => addr && addr.slice(0, 6) + '...' + addr.slice(-4) || ''

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
            <DropdownMenuItem onClick={() => onClear()}>
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
