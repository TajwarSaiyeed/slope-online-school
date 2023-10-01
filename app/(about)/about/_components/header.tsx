import Image from "next/image";

export const Header = () => {
    return (
        <div
            className={'bg-emerald-200 h-full mt-[80px] p-10 flex flex-col md:flex-row  gap-x-2 justify-between items-center '}
            style={{
                background: "rgba(88,60,234,.03137254901960784)"
            }}
        >
            <div className={'w-full flex flex-col gap-5 p-2 md:p-10 md:w-1/2'}>
                <h1 className={'text-3xl md:text-5xl text-[#141414] font-bold leading-tight '}>
                    Build Your <br/>
                    Foundation with <br/>
                    <span style={{
                        background: "linear-gradient(90deg,#970061 15.94%,#085bdb 89.53%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Slope Online School
                    </span>
                </h1>
                <p className={'text-neutral-500 text-base md:text-md'}>
                    Learn and basics of PHYSICS, CHEMISTRY, BIOLOGY and MATHS <br/> with highly qualified teachers and build your foundation for higher studies.

                </p>
            </div>
            <div className={'w-full md:w-1/2 flex justify-center items-center'}>
                <div className={''}>
                    <Image width={500} height={500} src={'/headerImage.png'} alt={'header-image'}
                           className={'object-cover object-center'}/>
                </div>
            </div>
        </div>
    );
};

