import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default twMerge(
  clsx(
    "w-auto min-h-0 flex center pl-3 pr-7 py-3 rounded-3xl space-x-3 group transition-all duration-200",
    "shadow-[0_0_56px_-6px] shadow-[#FF6536]/80 hover:shadow-[0_0_64px_0] hover:shadow-[#FF6536]/80 bg-[#FF6536]",
    "text-sand-12 text-2xl font-semibold",
    "active:scale-[0.99] disabled:pointer-events-none disabled:select-none disabled:opacity-50"
  )
);
