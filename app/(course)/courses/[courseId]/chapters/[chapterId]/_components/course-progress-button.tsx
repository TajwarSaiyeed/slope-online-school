'use client'

import {Button} from "@/components/ui/button";
import {CheckCircle, XCircle} from "lucide-react";
import {useRouter} from "next/navigation";
import {useConfettiStore} from "@/hooks/use-confetti-store";
import {useState} from "react";
import {toast} from "react-hot-toast";
import axios from "axios";

interface CourseProgressButtonProps {
    chapterId: string
    courseId: string
    nextChapterId?: string
    isCompleted?: boolean
}

export const CourseProgressButton = ({chapterId, courseId, nextChapterId, isCompleted}: CourseProgressButtonProps) => {
    const router = useRouter()
    const confetti = useConfettiStore()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            })

            if(!isCompleted && !nextChapterId) {
                confetti.onOpen()
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
            toast.success("Progress updated")
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const Icon = isCompleted ? XCircle : CheckCircle;

    return <Button onClick={onClick} disabled={isLoading} type={'button'} variant={isCompleted ? "outline" : "success"} className={'w-full md:w-auto'}>
        {isCompleted ? 'Not Completed' : 'Mark as completed'}
        <Icon className={'ml-2 h-4 w-4'}/>
    </Button>
}