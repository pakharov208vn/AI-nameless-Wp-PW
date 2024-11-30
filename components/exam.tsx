import { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Record } from './record'
import { Timer } from './timer'
import { Button } from './ui/button'

export function Exam() {
  const [recordings, setRecordings] = useState<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string>('')

  const webcamRef = useRef<Webcam | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const startRecording = useCallback(() => {
    if (webcamRef.current) {
      const stream = webcamRef.current.stream
      if (!stream) {
        setError('No webcam stream available')
        return
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' })
        setRecordings((prev) => [...prev, blob])
        chunks.current = []
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError('')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [])

  console.log(error)

  return (
    <div className='flex  flex-1 flex-col gap-4 p-4 pr-1'>
      <div className='min-h-[100vh] relative flex-1 rounded-xl bg-muted/50 md:min-h-min overflow-hidden flex items-center justify-center'>
        <Timer className='z-10' />
        <Record />

        <div className=' w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover'>
          <Webcam
            ref={webcamRef}
            audio={true}
            mirrored={true}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: 'user',
            }}
            className='w-full h-full object-cover'
            onUserMediaError={(err) => {
              if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                  setError('Please allow camera access to record video')
                } else if (err.name === 'NotFoundError') {
                  setError('No camera device found')
                } else {
                  setError('Error accessing camera: ' + err.message)
                }
              }
            }}
          />

          <div className='flex space-x-4 absolute bottom-3 right-3 z-10'>
            {!isRecording ? (
              <Button size='lg' onClick={startRecording} className='' disabled={recordings.length >= 2}>
                Start Recording
              </Button>
            ) : (
              <Button size='lg' onClick={stopRecording}>
                Stop Recording
              </Button>
            )}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 w-full max-w-2xl z-0 absolute bottom-3 left-3 bg-muted/50 p-2 gap-2 rounded-2xl'>
            {recordings.map((recording, index) => (
              <div key={index} className='flex flex-col items-center space-y-2 '>
                <video src={URL.createObjectURL(recording)} controls className='w-full rounded-lg shadow-md' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
