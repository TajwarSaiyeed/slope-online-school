'use client'

import axios from 'axios';
import * as z from 'zod';
import {useState} from "react";
import {PlusCircle} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormMessage, FormItem, FormField} from '@/components/ui/form'
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Chapter, Course} from "@prisma/client";
import {Input} from "@/components/ui/input";
import {ChaptersList} from "./chapters-list";


interface ChaptersFormProps {
    initialData: Course & {
        chapters: Chapter[]
    }
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1)
})


export const ChaptersForm = ({initialData, courseId}: ChaptersFormProps) => {

    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const router = useRouter()
    const toggleCreating = () => setIsCreating(current => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const {isValid, isSubmitting} = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success('Chapter created')
            toggleCreating()
            router.refresh()

        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return <div className={'mt-6 border bg-slate-100 rounded-md p-4'}>
        <div className={'font-medium flex items-center justify-between'}>
            Course chapters
            <Button onClick={toggleCreating} variant={'ghost'}>
                {isCreating ? (
                    <>Cancel</>
                ) : (
                    <>
                        <PlusCircle className={'h-4 w-4 mr-2'}/>
                        Add a chapter
                    </>
                )}
            </Button>
        </div>
        {isCreating && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'space-y-8 mt-8'}
                >
                    <FormField render={({field}) => (<FormItem>
                        <FormControl>
                            <Input
                                disabled={isSubmitting}
                                placeholder={"e.g. 'Introduction to the course'"}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)} name={'title'} control={form.control}/>
                    <Button type={'submit'} disabled={!isValid || isSubmitting}>Create</Button>
                </form>
            </Form>
        )}
        {
            !isCreating && <div className={cn('text-sm mt-2', !initialData.chapters.length && "italic text-slate-500")}>
                {!initialData.chapters.length && "No chapters yet!"}
                <ChaptersList
                    onEdit={() => {
                    }}
                    onReorder={() => {
                    }}
                    items={initialData.chapters || []}
                />
            </div>
        }
        {
            !isCreating && (
                <p className={'text-xs text-muted-foreground mt-4'}>
                    Drag and drop to reorder the chapters
                </p>
            )
        }

    </div>
}