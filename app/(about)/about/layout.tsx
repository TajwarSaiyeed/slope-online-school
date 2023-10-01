import {Navbar} from "./_components/navbar";

const AboutLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className={'max-w-[1440px] mx-auto'}>
            <Navbar />
            {children}
        </div>
    );
};

export default AboutLayout;