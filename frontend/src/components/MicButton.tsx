import { Mic, MicOff, Volume2 } from "lucide-react";

interface MicButtonProps {
  isListening: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function MicButton({ isListening, onToggle, size = "md", className = "" }: MicButtonProps) {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };
  const iconSize = { sm: 18, md: 24, lg: 32 };

  return (
    <button
      onClick={onToggle}
      className={`${sizeMap[size]} rounded-full flex items-center justify-center transition-all duration-200
        ${isListening
          ? "bg-destructive text-destructive-foreground animate-pulse-ring shadow-lg"
          : "bg-accent text-accent-foreground hover:shadow-lg hover:scale-105 active:scale-95"
        } ${className}`}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <MicOff size={iconSize[size]} />
      ) : (
        <Mic size={iconSize[size]} />
      )}
    </button>
  );
}
