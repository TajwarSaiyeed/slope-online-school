import { Logo } from "@/app/(dashboard)/_components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div
      className={
        "p-6 h-[80px] border-b flex items-center justify-between fixed top-0 left-0 bg-white w-full z-50"
      }
    >
      <Logo />

      <Link href={"/search"}>
        <Button variant={"ghost"} size={"sm"} className={"font-bold text-lg"}>
          My Classes
        </Button>
      </Link>
    </div>
  );
};
