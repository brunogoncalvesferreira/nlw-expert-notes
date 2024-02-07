import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale' 
import { X } from 'lucide-react'
interface NoteCardProps {
  note: {
    date: Date
    content: string
  }
}

export function NoteCard({note}: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-slate-800 rounded-md text-left p-5 flex flex-col gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-300">
        <span className="text-sm font-medium text-slate-300">
          {note.date.toLocaleDateString()}
        </span>
        <p className="text-sm leading-6 text-slate-400">
          {note.content}
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
        <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] h-[60vh] w-full bg-slate-700 rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute bg-slate-800 text-slate-400 top-0 right-0 p-1.5 hover:text-slate-100'>
            <X className='w-6 h-6'/>
          </Dialog.Close>

          <div className='flex flex-1 flex-col gap-3 p-5'>
            <span className="text-sm font-medium text-slate-300">
            {formatDistanceToNow(note.date, {addSuffix: true, locale: ptBR})}
            </span>
            <p className="text-sm leading-6 text-slate-400">
            {note.content}
            </p>
          </div>

          <button 
            type='button'
            className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group'
          >
            Deseja <span className='text-red-500 group-hover:underline'>apagar esta nota</span>?
          </button>
        </Dialog.Content>
      </Dialog.Portal> 
    </Dialog.Root>
  )
}