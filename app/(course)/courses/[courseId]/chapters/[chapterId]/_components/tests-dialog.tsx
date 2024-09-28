"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Test, Variant } from "@prisma/client";
import { TestsForm } from "./tests-form";

interface TestsDialogProps {
  isOpen: boolean;
  closeTests: () => void;
  tests: (Test & { variants: Variant[] })[];
}

export const TestsDialog = ({
  isOpen,
  closeTests,
  tests,
}: TestsDialogProps) => {
  const [currentTest, setCurrentTest] = useState(0);

  const switchToNextTest = () => {
    if (currentTest + 1 < tests.length) {
      setCurrentTest(currentTest + 1);
    } else {
      setCurrentTest(0);
      closeTests();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="z-[100]">
        <DialogHeader>
          <DialogTitle>Self -test task</DialogTitle>
          <DialogDescription>
            Go through all tests ({currentTest + 1}/{tests.length})
          </DialogDescription>
        </DialogHeader>
        <div className="pb-3">
          <TestsForm
            test={tests[currentTest]}
            switchToNextTest={switchToNextTest}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
