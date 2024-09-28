import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";

import { ChapterPage } from "./_components/chapter-page";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    enrollment,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !enrollment;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="The section is completed" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="Sign up for a course to view this section"
        />
      )}
      <ChapterPage
        enrollment={enrollment}
        userProgress={userProgress}
        chapterId={params.chapterId}
        courseId={params.courseId}
        chapter={chapter}
        tests={course.tests}
        courseTitle={course.title}
        attachments={attachments}
        nextChapter={nextChapter}
        muxData={muxData}
        isLocked={isLocked}
      />
    </div>
  );
};

export default ChapterIdPage;
