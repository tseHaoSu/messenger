import Image from "next/image";
import { cn, getAvatarUrl } from "@/lib/utils";

interface AvatarProps {
  name: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  sm: { width: 32, height: 32, className: "h-8 w-8" },
  md: { width: 36, height: 36, className: "h-9 w-9" },
  lg: { width: 40, height: 40, className: "h-10 w-10" },
};

export const Avatar = ({
  name,
  image,
  size = "md",
  className,
  style
}: AvatarProps): React.ReactElement => {
  const { width, height, className: sizeClassName } = sizeMap[size];

  return (
    <Image
      src={getAvatarUrl(name, image)}
      alt={name ?? ""}
      width={width}
      height={height}
      className={cn("rounded-full object-cover", sizeClassName, className)}
      style={style}
    />
  );
};
