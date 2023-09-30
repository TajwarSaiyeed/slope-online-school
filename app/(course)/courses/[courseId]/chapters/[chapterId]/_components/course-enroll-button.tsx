'use client'

import {Button} from "@/components/ui/button";
import {formatPrice} from "@/lib/format";
import axios from "axios";
import {useState} from "react";
import {toast} from "react-hot-toast";


interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({price, courseId}: CourseEnrollButtonProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const onCheckout = async () => {
        try {
            setIsLoading(true)
            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(response.data.url)
        } catch (e) {
            toast.success("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    };
    return (
        <Button disabled={isLoading} onClick={onCheckout} size={'sm'} className={'w-full md:w-auto'}>
            Enroll for {formatPrice(price)}
        </Button>
    )
}