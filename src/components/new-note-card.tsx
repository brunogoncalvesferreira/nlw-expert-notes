import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated } : NewNoteCardProps) {
  const [shouldShowOnboard, setShouldShowOnboard] = useState(true)
  const [ isRecording, setIsRecording ] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnboard(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if(event.target.value === "") {
      setShouldShowOnboard(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if(content === '') {
      return
    }

    onNoteCreated(content)

    setContent('')
    setShouldShowOnboard(true)

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window 

    if(!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação')
      return
    }

    setIsRecording(true)
    setShouldShowOnboard(false)

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition 

    speechRecognition = new SpeechRecognition()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true // somente para de gravar quando eu falar
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = ( event ) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = ( event ) => {
      console.log(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)
    
    if(speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
        <Dialog.Trigger className="flex flex-col gap-3 bg-slate-700 p-5 text-left rounded-md outline-none hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-300">
          {<span className="text-sm font-medium text-slate-200">
            Adicionar nota
          </span>}
          <p className="text-sm leading-6 text-slate-400">
            Grave uma nota em áudio que será convertida para texto automaticamente.
          </p>
        </Dialog.Trigger>

        <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
        <Dialog.Content className='fixed overflow-hidden  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full h-full bg-slate-700 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute bg-slate-800 text-slate-400 top-0 right-0 p-1.5 hover:text-slate-100'>
            <X className='w-6 h-6'/>
          </Dialog.Close>

          <form className='flex-1 flex flex-col'>

            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnboard ? (<p className="text-sm leading-6 text-slate-400">
                Comece 
                  <button type='button' onClick={handleStartRecording} className='ml-1 font-medium text-lime-400 hover:underline'>
                    gravando uma nota
                  </button> em áudio ou se preferir 
                  <button onClick={handleStartEditor} className='ml-1 font-medium text-lime-400 hover:underline'>
                    utilize apenas texto
                  </button>.
              </p>) : (
                  <textarea 
                  autoFocus
                  className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                  onChange={handleContentChange}
                  value={content}
                  />) 
              }

            </div>
            {isRecording ? (
              <button 
                type='button'
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button 
                type='button'
                onClick={handleSaveNote}
                className='w-full bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium hover:bg-lime-500'
              >
                Salvar nota
              </button>
            )}
            
          </form>
        </Dialog.Content>
      </Dialog.Portal> 
    </Dialog.Root>
  )
}