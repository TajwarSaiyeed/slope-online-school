import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";


const ChapterIdPage = async ({params}: {
    params: {
        courseId: string,
        chapterId: string
    }
}) => {
    const {userId} = auth();
    if (!userId) return redirect('/')

    if (!params.courseId || params.courseId.length !== 24) {
        return redirect('/')
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true
        }
    })

    if (!chapter) {
        return redirect('/')
    }


    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`


    return (
        <div className={'p-6'}>
            <div className={'flex items-center justify-between'}>
                <div className={'w-full'}>
                    <Link
                        href={`/teacher/courses/${params.courseId}`}
                        className={'flex items-center text-sm hover:opacity-75 transition'}
                    >
                        <ArrowLeft className={'h-4 w-4 mr-2'}/> Back to course setup
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChapterIdPage;