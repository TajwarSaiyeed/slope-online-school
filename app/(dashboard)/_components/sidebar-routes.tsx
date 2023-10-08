"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import {MdOutlineLeaderboard} from "react-icons/md";
import {LuFileEdit} from "react-icons/lu";
import {FiMail} from "react-icons/fi";

const guestRoutes = [
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: MdOutlineLeaderboard,
    label: "Leaderboard",
    href: "/leaderboard",
  },
  {
    icon: LuFileEdit,
    label: "Quiz",
    href: "/quiz",
  },
  {
    icon: FiMail,
    label: "Newsletter",
    href: "/newsletter",
  }
];
const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathName = usePathname();
  const isTeacherPage = pathName?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className={"flex flex-col w-full"}>
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
