import Image from 'next/image'

export const Logo = () => {
    return (
        <div className={'flex items-center gap-x-2 rounded-full'}>
            <Image src={'/logo.jpg'} width={40} height={40} alt={'Logo'} className={'rounded'}/>
            <p className={'font-bold text-[#08499C]'}>
                SlopeOnlineSchool
            </p>
        </div>
    );
}