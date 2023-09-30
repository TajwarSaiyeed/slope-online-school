import {IconBadge} from "@/components/icon-badge";
import {LucideIcon} from "lucide-react";

interface InfoCardProps {
    numberOfItems: number
    label: string
    icon: LucideIcon
    variant?: 'default' | 'success'

}
export const InfoCard = ({numberOfItems, label, variant, icon: Icon} : InfoCardProps) => {
    return <div className={'border rounded-md flex items-center gap-x-2 p-3'}>
        <IconBadge
            icon={Icon}
            variant={variant}
        />
        <div>
            <p className={'font-medium'}>
                {label}
            </p>
            <p className={'text-gay-500 text-sm'}>
                {numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
            </p>
        </div>
    </div>
}