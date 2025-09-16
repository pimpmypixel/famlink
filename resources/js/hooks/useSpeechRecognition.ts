// Declare SpeechRecognition for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

import { useState, useRef, useCallback } from 'react'

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxRetries = 3

  const startSpeechRecognition = useCallback(async () => {
    console.log('Starting speech recognition...')
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition is not supported in this browser.')
      alert('Speech recognition is not supported in this browser.')
      return
    }

    try {
      // Request microphone permission (fallback for older browsers)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('Requesting microphone permission...')
        await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log('Microphone permission granted')
      } else {
        console.log('getUserMedia not available, proceeding without explicit permission check')
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'da-DK' // Danish language

      // Add a timeout to automatically stop after 30 seconds of silence
      const resetSilenceTimeout = () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = setTimeout(() => {
          console.log('Silence timeout reached, stopping recognition')
          if (recognitionRef.current) {
            recognitionRef.current.stop()
          }
        }, 30000) // 30 seconds
      }

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started')
        setIsRecording(true)
        resetSilenceTimeout() // Start the silence timeout
      }

      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result:', event)
        resetSilenceTimeout() // Reset timeout when speech is detected

        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }

        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript)
          setTranscript(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event.message)

        // Handle network errors with retry logic
        if (event.error === 'network' && retryCount < maxRetries) {
          console.log(`Network error, retrying... (${retryCount + 1}/${maxRetries})`)
          setRetryCount(prev => prev + 1)
          setError(`Network error - retrying (${retryCount + 1}/${maxRetries})...`)

          setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start()
              } catch (retryError) {
                console.error('Error during retry:', retryError)
                setError('network')
                setIsRecording(false)
                setRetryCount(0)
              }
            }
          }, 2000) // Wait 2 seconds before retry
          return
        }

        // If we've exhausted retries or it's a different error, set the error and stop
        setError(event.error)
        setIsRecording(false)
        setRetryCount(0)

        switch (event.error) {
          case 'not-allowed':
            alert('Microphone access denied. Please allow microphone access to use speech recognition.')
            break
          case 'network':
            alert('Network error occurred. Please check your internet connection and try again.')
            break
          case 'no-speech':
            alert('No speech was detected. Please try speaking louder or closer to the microphone.')
            break
          case 'aborted':
            console.log('Speech recognition was aborted')
            break
          case 'audio-capture':
            alert('Audio capture failed. Please check your microphone and try again.')
            break
          case 'service-not-allowed':
            alert('Speech recognition service is not allowed. Please check your browser settings.')
            break
          default:
            alert(`Speech recognition error: ${event.error}. Please try again.`)
        }
      }

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended')
        setIsRecording(false)
        setError(null)
        setRetryCount(0)
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current)
          silenceTimeoutRef.current = null
        }
      }

      recognitionRef.current.start()
      console.log('Speech recognition start() called')
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      alert('Error starting speech recognition: ' + error)
      setIsRecording(false)
    }
  }, [])

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
  }, [])

  const toggleSpeechRecognition = useCallback(() => {
    console.log('Toggle speech recognition called, current state:', isRecording)
    if (isRecording) {
      stopSpeechRecognition()
    } else {
      startSpeechRecognition()
    }
  }, [isRecording, startSpeechRecognition, stopSpeechRecognition])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
    setRetryCount(0)
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
  }, [])

  return {
    isRecording,
    transcript,
    error,
    retryCount,
    toggleSpeechRecognition,
    clearTranscript
  }
}