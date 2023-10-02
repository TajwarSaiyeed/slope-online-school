"use client";

import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});
export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={"mt-6 border bg-slate-100 rounded-md p-4"}>
      <div className={"font-medium flex items-center justify-between"}>
        Course Video
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className={"w-4 h-4 mr-2"} />
              Add an video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className={"h-4 w-4 mr-2"} />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div
            className={
              "flex items-center justify-center h-60 bg-slate-200 rounded-md"
            }
          >
            <VideoIcon className={"w-10 h-10 text-slate-500"} />
          </div>
        ) : (
          <div className={"relative aspect-video mt-2"}>
            <iframe
              allowFullScreen={true}
              className={"w-full h-full rounded-md"}
              src={initialData.videoUrl}
            ></iframe>
            <div className={"absolute top-3 right-3 w-10 h-10"}>
              <Image
                src={"/logo.jpg"}
                alt={"logo"}
                fill
                className={"object-cover rounded"}
              />
            </div>
          </div>
        ))}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"space-y-8 mt-8"}
          >
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      {...field}
                      id={"videoUrl"}
                      placeholder={"e.g. 'Enter the video url...'"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name={"videoUrl"}
              control={form.control}
            />
            <div className={"flex items-center gap-x-2"}>
              <Button type={"submit"} disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className={"text-xs text-muted-foreground mt-2"}>
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      )}
    </div>
  );
};
