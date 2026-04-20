import { cn } from "@/lib/utils";
import favicon from "/favicon.png?url";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { className?: string };

/**
 * CarLogo — drop-in replacement for the lucide `<Car />` icon.
 * Renders the brand car logo (favicon.png). Accepts the same className
 * sizing/color utilities so it slots into existing layouts.
 * Note: color utilities (text-*) won't recolor the raster image.
 */
const CarLogo = ({ className, alt = "UNiVale car logo", ...rest }: Props) => (
  <img
    src={favicon}
    alt={alt}
    loading="lazy"
    className={cn("inline-block object-contain", className)}
    {...rest}
  />
);

export default CarLogo;
