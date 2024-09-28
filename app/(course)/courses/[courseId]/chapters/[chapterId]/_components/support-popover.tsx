"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, SendHorizonal, Loader2 } from "lucide-react";

interface SupportPopoverProps {
  courseId: string;
  chapterId: string;
  chapterDescription: string;
  courseTitle: string;
  chapterTitle: string;
}

export const SupportPopover = ({
  courseId,
  chapterId,
  chapterDescription,
  courseTitle,
  chapterTitle,
}: SupportPopoverProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const plainTextDescription = chapterDescription.replace(/(<([^>]+)>)/gi, "");
  const shortenedDescription = plainTextDescription
    .split(" ")
    .slice(0, 50)
    .join(" ");

  const askQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/support`,
        {
          question,
          courseTitle: courseTitle,
          chapterTitle: chapterTitle,
          chapterDescription: shortenedDescription,
        }
      );
      setAnswer(response.data?.answer);
    } catch {
      toast.error("Oops! Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <MessageSquare />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mb-2 mr-4 w-[400px]">
        <div className="flex flex-col gap-4 h-[500px]">
          <Card className="h-[450px] px-0 py-3 overflow-scroll">
            <CardContent className="flex justify-center">
              {isLoading ? (
                <div>
                  <Loader2 className=" mt-[190px] h-10 w-10 animate-spin" />
                </div>
              ) : (
                <p className="text-sm">{answer}</p>
              )}
            </CardContent>
          </Card>
          <div className="flex flex-row gap-4">
            <Input
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask any question on the section"
            />
            <Button
              disabled={isLoading || !question.length}
              onClick={askQuestion}
            >
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
