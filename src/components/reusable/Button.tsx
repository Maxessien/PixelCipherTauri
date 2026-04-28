import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface ButtonType {
  size?: "small" | "medium" | "large";
  usePredefinedSize?: boolean;
  color?: "primary" | "secondary" | "tertiary";
  usePredefinedcolor?: boolean;
  className?: string;
  width?: string;
  rounded?: string;
  attrs?: ButtonHTMLAttributes<HTMLButtonElement> &
    Omit<HTMLAttributes<HTMLButtonElement>, "className">;
  children?: ReactNode;
}

const interfaces = {
  primary:
    "text-(--text-primary-light) bg-(--main-secondary-light) hover:bg-(--main-secondary)",
  secondary:
    "bg-(--main-primary) shadow-[0px_0.4px_10px_-7px_black] text-(--text-primary-light) hover:bg-(--main-primary-light)",
  tertiary:
    "bg-transparent text-(--main-primary) border-[2px] border-(--main-primary)",
};

const sizes = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

const defaults =
  "cursor-pointer disabled:opacity-65 transition-all duration-[200ms] inline-flex justify-center items-center font-semibold gap-2";

const Button = ({
  size = "medium",
  usePredefinedcolor = true,
  usePredefinedSize = true,
  color = "primary",
  children = <>Button</>,
  className = "",
  rounded = "rounded-full",
  width = "w-max",
  attrs,
}: ButtonType) => {
  const completeClassNames = `${usePredefinedSize ? sizes[size] : ""} ${usePredefinedcolor ? interfaces[color] : ""} ${rounded} ${width} ${defaults} ${className}`;
  return (
    <button type="button" {...attrs} className={completeClassNames.trimStart().trimEnd()}>
      {children}
    </button>
  );
};

export default Button