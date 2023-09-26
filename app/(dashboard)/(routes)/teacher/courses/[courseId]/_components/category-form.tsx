'use client'

import axios from 'axios';
import * as z from 'zod';
import {useState} from "react";
import {Pencil} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormMessage, FormItem, FormField} from '@/components/ui/form'
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {Course} from "@prisma/client";
import {Combobox} from "@/components/ui/combobox";

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string; value: string }[]
}

const formSchema = z.object({
    categoryId: z.string().min(1)
})

export const CategoryForm = ({initialData, courseId, options}: CategoryFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const toggleEditing = () => setIsEditing(current => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        }
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

    const selectedOption = options.find((option) => option.value === initialData.categoryId)

    return <div className={'mt-6 border bg-slate-100 rounded-md p-4'}>
        <div className={'font-medium flex items-center justify-between'}>
            Course category
            <Button onClick={toggleEditing} variant={'ghost'}>
                {isEditing ? (
                    <>Cancel</>
                ) : (
                    <>
                        <Pencil className={'h-4 w-4 mr-2'}/>
                        Edit category
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className={cn('text-sm mt-2', !initialData.categoryId && "text-slate-500 italic")}>
                {selectedOption?.label || 'No Category'}
            </p>
        )}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'space-y-8 mt-8'}
                >
                    <FormField render={({field}) => (<FormItem>
                        <FormControl>
                            <Combobox options={...options} onChange={field.onChange} value={field.value}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)} name={'categoryId'} control={form.control}/>
                    <div className={'flex items-center gap-x-2'}>
                        <Button type={'submit'} disabled={!isValid || isSubmitting}>Save</Button>
                    </div>
                </form>
            </Form>
        )}
    </div>
}