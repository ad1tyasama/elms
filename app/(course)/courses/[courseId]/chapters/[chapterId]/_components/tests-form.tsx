"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Test, Variant } from "@prisma/client";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface TestsFormProps {
  test: Test & { variants: Variant[] };
  switchToNextTest: () => void;
}

const formSchema = z.object({
  variants: z.array(z.string()).refine((value) => value.some((item) => item)),
});

export const TestsForm = ({ test, switchToNextTest }: TestsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variants: [],
    },
  });

  const answers = test.variants
    .filter((variant) => variant.isCorrect === true)
    .map((variant) => variant.id);
  const { isValid } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const isChoiceCorrect = values.variants.toString() === answers.toString();
    if (isChoiceCorrect) {
      toast.success("Hooray! The answer is correct");
      switchToNextTest();
      form.reset();
    } else {
      toast.error("Oops! The answer is wrong");
    }
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {test.title}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {test.variants.map((variant) => (
            <FormField
              key={variant.id}
              control={form.control}
              name="variants"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(variant.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, variant.id])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== variant.id
                              )
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{variant.title}</FormLabel>
                </FormItem>
              )}
            />
          ))}
          <div className="flex gap-x-4">
            <Button disabled={!isValid} type="submit">
              To hand over
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
