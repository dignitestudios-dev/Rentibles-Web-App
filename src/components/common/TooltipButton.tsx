import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { ReactNode } from "react";

type TooltipButtonProps = {
  icon?: ReactNode;
  tooltip: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export function TooltipButton({
  icon,
  tooltip,
  onClick,
  className,
  type = "button",
}: TooltipButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type={type}
            onClick={onClick}
            className={`text-white ${className ?? ""}`}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent className="z-[9999]">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
