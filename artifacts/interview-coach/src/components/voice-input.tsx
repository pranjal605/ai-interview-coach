import React, { useEffect, useRef } from "react";
import { useVoice } from "@/hooks/use-voice";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  onAppend: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onAppend, disabled }: VoiceInputProps) {
  const { isListening, startListening, stopListening, transcript, resetTranscript, supported } = useVoice();
  const prevTranscriptRef = useRef("");

  useEffect(() => {
    // When transcript changes, append the new part
    if (transcript && transcript !== prevTranscriptRef.current) {
      const newPart = transcript.substring(prevTranscriptRef.current.length);
      if (newPart.trim()) {
        onAppend(newPart);
      }
      prevTranscriptRef.current = transcript;
    }
  }, [transcript, onAppend]);

  useEffect(() => {
    if (!isListening) {
      resetTranscript();
      prevTranscriptRef.current = "";
    }
  }, [isListening, resetTranscript]);

  if (!supported) {
    return null; // Don't render if not supported
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "secondary"}
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={isListening ? "animate-pulse" : ""}
      title={isListening ? "Stop listening" : "Start voice input"}
      data-testid={isListening ? "button-mic-stop" : "button-mic-start"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}
