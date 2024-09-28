import { Variant } from "@prisma/client";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VariantsListProps {
  items: Variant[];
  onDelete: (variantId: string) => void;
}

export const VariantsList = ({ items, onDelete }: VariantsListProps) => {
  const [variants, setVariants] = useState(items);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    setVariants(items);
  }, [items]);

  return (
    <>
      {variants.map((variant, index) => (
        <div
          key={variant.id}
          className={
            "flex items-center gap-x-2 bg-black-100 border-black-200 border text-black-700 rounded-md mb-4 text-sm"
          }
        >
          <div
            className={
              "flex px-3 py-3 border-r border-r-black-200 rounded-l-md transition"
            }
          >
            {alphabet[index]}
          </div>
          {variant.title}
          <div className="ml-auto pr-2 flex items-center gap-x-3">
            <Badge>{variant.isCorrect ? "Correct" : "Incorrect"}</Badge>
            <Trash
              onClick={() => onDelete(variant.id)}
              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
            />
          </div>
        </div>
      ))}
    </>
  );
};
