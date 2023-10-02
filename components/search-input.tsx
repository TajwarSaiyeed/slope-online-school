"use client";

import qs from "query-string";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchInput = () => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );
    router.push(url);
  }, [currentCategoryId, debouncedValue, pathName, router]);

  return (
    <div className={"relative"}>
      <Search
        className={"absolute top-3 left-3 transform h-4 w-4 text-slate-600"}
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={
          "w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        }
        placeholder={"Search for a course"}
      />
    </div>
  );
};
