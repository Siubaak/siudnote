import { Connect } from './components/Connect'
import { Notebook } from './components/Notebook'
import { NoteInput } from './components/NoteInput'

export function App() {
  return (
    <>
      <div className="flex justify-between items-center bg-slate-500 px-6 py-3">
        <h1 className="text-slate-200 text-lg">SiuDNote</h1>
        <Connect />
      </div>
      <div className="px-6 py-3">
        <NoteInput />
        <Notebook />
      </div>
    </>
  )
}
