"use client";

import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Attachment, Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});
export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteingId, setDeleteingId] = useState<string | null>(null);

  const router = useRouter();
  const toggleEditing = () => setIsEditing((current) => !current);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeleteingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeleteingId(null);
    }
  };

  return (
    <div className={"mt-6 border bg-slate-100 rounded-md p-4"}>
      <div className={"font-medium flex items-center justify-between"}>
        Course attachments
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className={"w-4 h-4 mr-2"} />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className={"text-sm mt-2 text-slate-500 italic"}>
              No attachments yet!
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className={"space-y-2"}>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={
                    "flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  }
                >
                  <File className={"h-4 w-4 mr-2 flex-shrink-0"} />
                  <p className={"text-xs line-clamp-1"}>{attachment.name}</p>
                  {deleteingId === attachment.id && (
                    <div className={"ml-auto"}>
                      <Loader2 className={"h-4 w-4 animate-spin"} />
                    </div>
                  )}
                  {deleteingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className={"hover:opacity-75 transition ml-auto"}
                    >
                      <X className={"h-4 w-4"} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
            endpoint={"courseAttachment"}
          />
          <div className={"text-xs text-muted-foreground mt-4"}>
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
