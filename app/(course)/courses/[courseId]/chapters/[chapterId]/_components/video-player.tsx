'use client'

import axios from 'axios'
import {useEffect, useState} from 'react'
import {toast} from "react-hot-toast";
import {useRouter} from 'next/navigation'
import {Loader2, Lock} from "lucide-react";

import {cn} from "@/lib/utils";
import {useConfettiStore} from "@/hooks/use-confetti-store";
import Image from "next/image";

interface VideoPlayerProps {
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
    videoUrl: string;
}

export const VideoPlayer = ({
                                courseId,
                                chapterId,
                                nextChapterId,
                                isLocked,
                                completeOnEnd,
                                title,
                                videoUrl
                            }: VideoPlayerProps) => {


    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true)
        }, 1000)
        return () => {
            clearTimeout(timer)
        }
    }, [])

    return <div className={'relative aspect-video'}>
        {!isLocked && !isReady && (
            <div className={'absolute inset-0 flex items-center justify-center bg-slate-800 rounded-md'}>
                <Loader2 className={'h-8 w-8 animate-spin text-secondary'}/>
            </div>
        )}
        {isLocked && (
            <div
                className={'absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'}>
                <Lock className={'h-8 w-8'}/>
                <p className={'text-sm'}>
                    This chapter is locked.
                </p>
            </div>
        )}
        {!isLocked && (
            <div className={'relative aspect-video border border-slate-100 rounded-md'}>
                <iframe
                    onEncrypted={() => {
                        setIsReady(true)

                    }}
                    className={cn('w-full h-full rounded-md', !isReady && 'hidden')}
                    src={videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                >
                </iframe>

                <div className={'absolute top-4 right-4 w-10 h-10'}>
                    <Image src={'/logo.jpg'} alt={'logo'} fill className={'object-cover rounded'}/>
                </div>
            </div>
        )}
    </div>

}
