'use client'

import axios from 'axios';
import * as z from 'zod';
import {useState} from "react";
import {Pencil} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Chapter} from "@prisma/client";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

import {cn} from "@/lib/utils";
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Editor} from "@/components/editor";
import {Form, FormControl, FormMessage, FormItem, FormField, FormDescription} from '@/components/ui/form'
import {Preview} from "@/components/preview";


interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string
}

const formSchema = z.object({
    isFree: z.boolean().default(false)
})


export const ChapterAccessForm = ({initialData, courseId, chapterId}: ChapterAccessFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const toggleEditing = () => setIsEditing(current => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree
        }
    })

    const {isValid, isSubmitting} = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success('Chapter updated')
            toggleEditing()
            router.refresh()

        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return <div className={'mt-6 border bg-slate-100 rounded-md p-4'}>
        <div className={'font-medium flex items-center justify-between'}>
            Chapter access
            <Button onClick={toggleEditing} variant={'ghost'}>
                {isEditing ? (
                    <>Cancel</>
                ) : (
                    <>
                        <Pencil className={'h-4 w-4 mr-2'}/>
                        Edit access
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className={cn('text-sm mt-2', !initialData.isFree && "text-slate-500 italic")}>
                {initialData.isFree ? (<>
                    This Chapter is free for preview
                </>) : <>
                    This Chapter is not free.
                </>}
            </p>
        )}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'space-y-8 mt-8'}
                >
                    <FormField render={({field}) => (
                        <FormItem className={'flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'}>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className={'space-y-1 leading-none'}>
                                <FormDescription>
                                    Check this box if you want to make this chapter free for preview.
                                </FormDescription>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )} name={'isFree'} control={form.control}/>
                    <div className={'flex items-center gap-x-2'}>
                        <Button type={'submit'} disabled={!isValid || isSubmitting}>Save</Button>
                    </div>
                </form>
            </Form>
        )}
    </div>
}