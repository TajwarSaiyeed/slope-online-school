'use client'

import * as z from 'zod'
import axios from 'axios'
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormLabel, FormControl, FormDescription, FormMessage, FormItem, FormField} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required'
    })
})

const CreatePage = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const {isValid, isSubmitting} = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post('/api/courses', values)
            router.push(`/teacher/courses/${response.data.id}`)
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className={'max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'}>
            <div>
                <h1 className={'text-2xl'}>Name your course</h1>
                <p className={'text-sm text-slate-600'}>What would you like to name your course? Don&apos;t worry, you
                    can change this later</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className={'space-y-8 mt-8'}
                    >
                        <FormField render={({field}) => (<FormItem>
                            <FormLabel htmlFor={'title'}>Course Title</FormLabel>
                            <FormControl>
                                <Input {...field} id={'title'} placeholder={"e.g. 'HSC Physics Chapter 1'"}/>
                            </FormControl>
                            <FormDescription>
                                What will you teach in this course?
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>)} name={'title'} control={form.control}/>
                        <div className={'flex items-center gap-x-2'}>
                            <Link href={'/'}>
                                <Button variant={'ghost'} type={'button'}>Cancel</Button>
                            </Link>
                            <Button type={'submit'} disabled={!isValid || isSubmitting}>Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreatePage;























