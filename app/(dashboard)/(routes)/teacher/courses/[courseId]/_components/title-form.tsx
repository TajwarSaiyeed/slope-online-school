'use client'

import axios from 'axios';
import * as z from 'zod';
import {useState} from "react";
import {Pencil} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Form, FormLabel, FormControl, FormDescription, FormMessage, FormItem, FormField} from '@/components/ui/form'
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

interface TitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
}


const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required'
    })
})



export const TitleForm = ({initialData, courseId}: TitleFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const toggleEditing = () => setIsEditing(current => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const {isValid, isSubmitting} = form.formState

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
            Course title
            <Button onClick={toggleEditing} variant={'ghost'}>
                {isEditing ? (
                    <>Cancel</>
                ) : (
                    <>
                        <Pencil className={'h-4 w-4 mr-2'}/>
                        Edit title
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className={'text-sm mt-2'}>
                {initialData.title}
            </p>
        )}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'space-y-8 mt-8'}
                >
                    <FormField render={({field}) => (<FormItem>
                        <FormControl>
                            <Input
                                disabled={isSubmitting}
                                {...field} id={'title'} placeholder={"e.g. 'HSC Physics Chapter 1'"}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)} name={'title'} control={form.control}/>
                    <div className={'flex items-center gap-x-2'}>
                        <Button type={'submit'} disabled={!isValid || isSubmitting}>Save</Button>
                    </div>
                </form>
            </Form>
        )}
    </div>
}