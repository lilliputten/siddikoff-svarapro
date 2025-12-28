import { HTMLAttributes } from "react";

import backImage from "@/assets/game/back.png";
import { cn } from "@/utils/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  classNameImage?: string;
}

export function BackCard({ className, classNameImage, ...props }: Props) {
  return (
    <div className={cn(className)} {...props}>
      <img className={cn("h-11 w-8", classNameImage)} src={backImage} alt="Back" />
    </div>
  );
}
