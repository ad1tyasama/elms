"use client";

import { Category } from "@prisma/client";
import {
  FcGlobe,
  FcLock,
  FcIphone,
  FcAssistant,
  FcElectronics,
  FcSearch,
  FcFolder,
} from "react-icons/fc";
import { IconType } from "react-icons";

import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Web development": FcGlobe,
  "Cybersecurity": FcLock,
  "Mobile development": FcIphone,
  "QA": FcSearch,
  "Big data": FcFolder,
  "Machine learning": FcElectronics,
  "Tech support": FcAssistant,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
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
