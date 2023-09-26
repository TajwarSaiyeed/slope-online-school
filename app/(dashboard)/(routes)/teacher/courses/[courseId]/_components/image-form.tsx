'use client'

import axios from 'axios';
import * as z from 'zod';
import {useState} from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {Course} from "@prisma/client";
import {useRouter} from "next/navigation";
import {ImageIcon, Pencil, PlusCircle} from "lucide-react";

import {Button} from '@/components/ui/button'
import {FileUpload} from "@/components/file-upload";

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: 'Image URL is required'
    })
})

interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

export const ImageForm = ({initialData, courseId}: ImageFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const toggleEditing = () => setIsEditing(current => !current)
        const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success('Course updated')
            toggleEditing()
            router.refresh()

        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return <div className={'mt-6 border bg-slate-100 rounded-md p-4'}>
        <div className={'font-medium flex items-center justify-between'}>
            Course Image
            <Button onClick={toggleEditing} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing && !initialData.imageUrl && (
                    <>
                        <PlusCircle className={'w-4 h-4 mr-2'}/>
                        Add an image
                    </>
                )}

                {!isEditing && initialData.imageUrl && (
                    <>
                        <Pencil className={'h-4 w-4 mr-2'}/>
                        Edit Image
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            !initialData.imageUrl ? (
                <div className={'flex items-center justify-center h-60 bg-slate-200 rounded-md'}>
                    <ImageIcon className={'w-10 h-10 text-slate-500'}/>
                </div>
            ) : (
                <div className={'relative aspect-video mt-2'}>
                    <Image src={initialData.imageUrl} alt={'upload'} fill className={'object-cover rounded-md'}/>
                </div>
            ))}
        {isEditing && (
            <div>
                <FileUpload
                    onChange={(url) => {
                        if (url) {
                            onSubmit({imageUrl: url})
                        }
                    }}
                    endpoint={'courseImage'}
                />
                <div className={'text-xs text-muted-foreground mt-4'}>
                    16:9 aspect ratio recommended
                </div>
            </div>
        )}
    </div>
}