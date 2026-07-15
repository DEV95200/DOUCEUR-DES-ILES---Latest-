import clsx from "clsx";
import type { Product } from "../../types";

export function ProductVisual({
  product,
  className,
  iconClassName,
}: {
  product: Product;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center overflow-hidden bg-gradient-to-br",
        product.gradient,
        className
      )}
    >
      {product.imageDataUrl ? (
        <img
          src={product.imageDataUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={clsx("drop-shadow-sm", iconClassName)}>{product.icon}</span>
      )}
    </div>
  );
}
