"use client";

import { useState } from "react";
import { File } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CourseEnrollButton } from "./course-enroll-button";
import { CourseProgressButton } from "./course-progress-button";
import { VideoPlayer } from "./video-player";
import { Preview } from "@/components/preview";
import { TestsDialog } from "./tests-dialog";

import {
  Attachment,
  Chapter,
  Enrollment,
  MuxData,
  Test,
  UserProgress,
  Variant,
} from "@prisma/client";
import { SupportPopover } from "./support-popover";

interface ChapterPageProps {
  enrollment: Enrollment | null;
  userProgress: UserProgress | null;
  chapterId: string;
  courseId: string;
  chapter: Chapter;
  tests: (Test & { variants: Variant[] })[];
  attachments: Attachment[];
  nextChapter: Chapter | null;
  muxData: MuxData | null;
  isLocked: boolean;
  courseTitle: string;
}

export const ChapterPage = ({
  enrollment,
  userProgress,
  chapterId,
  courseId,
  chapter,
  tests,
  attachments,
  nextChapter,
  muxData,
  isLocked,
  courseTitle,
}: ChapterPageProps) => {
  const completeOnEnd = !!enrollment && !userProgress?.isCompleted;
  const [isTestVisible, setIsTestVisible] = useState(false);

  const showTests = () => {
    setIsTestVisible(true);
  };

  const closeTests = () => {
    setIsTestVisible(false);
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto pb-20">
      <div className="p-4">
        <VideoPlayer
          chapterId={chapterId}
          title={chapter.title}
          courseId={courseId}
          nextChapterId={nextChapter?.id}
          playbackId={chapter.videoUrl ?? ''}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
          showTests={showTests}
        />
      </div>
      <div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {enrollment ? (
            <CourseProgressButton
              chapterId={chapterId}
              courseId={courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
              showTests={showTests}
            />
          ) : (
            <CourseEnrollButton courseId={courseId} />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description!} />
        </div>
        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-black-200 border text-black-700 rounded-md hover:underline"
                >
                  <File />
                  <p className="ml-2 line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
        <TestsDialog
          tests={tests}
          isOpen={isTestVisible}
          closeTests={closeTests}
        />
        <div className="fixed bottom-5 right-5">
          {enrollment && (
            <SupportPopover
              courseId={courseId}
              chapterId={chapterId}
              chapterDescription={chapter.description!}
              courseTitle={courseTitle}
              chapterTitle={chapter.title}
            />
          )}
        </div>
      </div>
    </div>
  );
};
