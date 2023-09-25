import {Logo} from "./logo";
import {SidebarRoutes} from "@/app/(dashboard)/_components/sidebar-routes";

const Sidebar = () => {
    return (
        <div className={'h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'}>
            <div className="p-5 border-b">
                <Logo />
            </div>
            <div className={'flex flex-col w-full'}>
                <SidebarRoutes/>
            </div>
        </div>
    );
};

export default Sidebar;