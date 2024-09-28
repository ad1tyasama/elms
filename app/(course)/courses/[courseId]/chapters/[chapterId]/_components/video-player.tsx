import axios from "axios";
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  showTests: () => void;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  showTests,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  useEffect(() => {
    const handleEnded = async () => {
      try {
        if (completeOnEnd) {
          await axios.put(
            `/api/courses/${courseId}/chapters/${chapterId}/progress`,
            { isCompleted: true }
          );

          if (!nextChapterId) {
            confetti.onOpen();
            setTimeout(() => showTests(), 3000);
          }

          toast.success("The progress of the course has been updated");
          router.refresh();

          if (nextChapterId) {
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          }
        }
      } catch (error) {
        console.error("Error handling video end:", error);
        toast.error("Trouble! Something went wrong");
      }
    };

    const plyr = document.querySelector(".plyr");

    if (plyr) {
      plyr.addEventListener("ended", handleEnded);
      return () => {
        plyr.removeEventListener("ended", handleEnded);
      };
    }
  }, [completeOnEnd, courseId, chapterId, nextChapterId, confetti, router, showTests]);

  return (
    <div className="relative aspect-video mt-5">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This section is not available</p>
        </div>
      )}
      {!isLocked && (
        <Plyr
          source={{
            title: title,
            type: 'video',
            sources: [{ src: playbackId }],
          }}
        />
      )}
    </div>
  );
};