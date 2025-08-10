import { cn } from "@/lib/utils";

export const Spinner = ({
  className,
  size = "default",
  variant = "default",
  label,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const variantClasses = {
    default: "border-gray-900 dark:border-gray-100",
    white: "border-white",
    primary: "border-black",
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {label && <span>{label}</span>}
    </div>
  );
};
