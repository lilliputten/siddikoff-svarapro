import { useState } from "react";

import { ButtonProps } from "@/types/components";

export function RedButton({ children, onClick, ...rest }: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick?.(e);
  };
  return (
    <button
      className={`flex h-[28px] w-[85px] items-center justify-center rounded-[6px] text-white ${isPressed ? "button-press" : ""}`}
      style={{
        ...rest.style,
        backgroundColor: "rgb(255 68 58)",
        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.15)",
      }}
      onClick={handleClick}
    >
      <span className="text-center font-inter text-[13px] font-semibold leading-[20px]">
        {children}
      </span>
    </button>
  );
}
