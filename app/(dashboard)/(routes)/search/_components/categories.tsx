"use client";

import { Category } from "@prisma/client";
import {
  BiBookAlt,
  BiBookBookmark,
  BiBookReader,
  BiPlusMedical,
} from "react-icons/bi";
import { FcEngineering } from "react-icons/fc";
import { FaUniversity } from "react-icons/fa";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  JSC: BiBookReader,
  SSC: BiBookAlt,
  HSC: BiBookBookmark,
  "Admission Test": FaUniversity,
  Engineering: FcEngineering,
  Medical: BiPlusMedical,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className={"flex items-center gap-x-2 overflow-x-auto mr-2"}>
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
