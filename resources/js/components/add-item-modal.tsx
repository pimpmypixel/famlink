import type React from "react"

import { useState } from "react"
import type { TimelineItem, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Mic } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: Omit<TimelineItem, "id" | "timestamp">) => void
  currentUser: User
}

export function AddItemModal({ isOpen, onClose, onAdd, currentUser }: AddItemModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<TimelineItem["category"]>("parenting")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const { isRecording, transcript, error, retryCount, toggleSpeechRecognition, clearTranscript } = useSpeechRecognition()

  console.log('Speech recognition hook state:', { isRecording, transcript: transcript.length, error, retryCount })

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) return

    const newItem: Omit<TimelineItem, "id" | "timestamp"> = {
      user: {
        id: parseInt(currentUser.id),
        name: currentUser.name,
        email: "", // We'll need to get this from somewhere or make it optional
        role: currentUser.role,
      },
      title: title.trim(),
      content: content.trim(),
      date: date,
      category,
      tags,
    }

    onAdd(newItem)

    // Reset form
    setTitle("")
    setContent("")
    setCategory("parenting")
    setDate(new Date().toISOString().split("T")[0])
    setTime(new Date().toTimeString().slice(0, 5))
    setTags([])
    setNewTag("")
    clearTranscript()

    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tilføj nyt tidslinjeelement</DialogTitle>
          <DialogDescription>
            Opret en ny post som {currentUser.name} ({currentUser.role})
            <br />
            <span className="text-xs text-muted-foreground mt-1 block">
              💡 Brug mikrofon-knappen til at diktere tekst direkte i feltet nedenfor
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Beskrivende titel"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TimelineItem["category"])}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="parenting">Forældre</option>
                <option value="logistics">Logistik</option>
                <option value="consultation">Konsultation</option>
                <option value="other">Andet</option>
              </select>
            </div>

            <div>
              <Label htmlFor="date">Dato</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Indhold *</Label>
            <div className="flex gap-2 items-start">
              <Textarea
                id="content"
                value={content + (transcript ? ' ' + transcript : '')}
                onChange={(e) => {
                  // If user is editing while speech recognition is active,
                  // we need to handle this carefully
                  if (isRecording && transcript) {
                    const newValue = e.target.value
                    const transcriptStart = content.length + 1 // +1 for the space
                    if (newValue.length >= transcriptStart) {
                      // User is editing within or after the transcript
                      const userEditedPart = newValue.slice(transcriptStart)
                      setContent(content + userEditedPart)
                    } else {
                      // User is editing the original content
                      setContent(newValue)
                    }
                  } else {
                    setContent(e.target.value)
                  }
                }}
                placeholder="Beskriv detaljerne for dette tidslinjeelement..."
                rows={4}
                required
                className="flex-1 w-4/5"
              />
              <div className="flex flex-col items-center gap-1">
                <Button
                  type="button"
                  variant={
                    error && typeof error === 'string' && !error.includes('retrying')
                      ? "destructive"
                      : isRecording
                        ? "destructive"
                        : "outline"
                  }
                  size="lg"
                  onClick={() => {
                    console.log('Button clicked, isRecording:', isRecording, 'error:', error)
                    toggleSpeechRecognition()
                  }}
                  className="h-10 w-10 p-0 flex-shrink-0"
                  title={
                    error && typeof error === 'string' && !error.includes('retrying')
                      ? `Error: ${error}. Click to retry`
                      : isRecording
                        ? "Stop optagelse"
                        : "Start tale-til-tekst"
                  }
                  disabled={error && typeof error === 'string' && error.includes('retrying')}
                >
                  <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''} ${error && typeof error === 'string' && !error.includes('retrying') ? 'text-white' : ''}`} />
                  {isRecording && <span className="sr-only">Lytter...</span>}
                </Button>
                {isRecording && (
                  <span className="text-xs text-red-500 font-medium">
                    🎤 Lytter{retryCount > 0 ? ` (Retry ${retryCount})` : ''}
                  </span>
                )}
                {error && typeof error === 'string' && error.includes('retrying') && (
                  <span className="text-xs text-orange-500 font-medium">
                    🔄 {error}
                  </span>
                )}
                {error && typeof error === 'string' && !error.includes('retrying') && (
                  <span className="text-xs text-red-600 font-medium">
                    ❌ Error: {error}
                  </span>
                )}
                {transcript && !error && (
                  <span className="text-xs text-green-600">
                    📝 {transcript.length} tegn
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tilføj en tag og tryk Enter"
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={!newTag.trim()}>
                  Tilføj
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}