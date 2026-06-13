import type { HTMLAttributes, CSSProperties } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  style?: CSSProperties;
};

/**
 * Standard max-width content wrapper: maxWidth 1200, centered, 0 40px padding.
 * Pass `style` to merge additional styles. Forwards all HTML div attributes
 * including `data-*` and `className`.
 */
export default function Container({
  children,
  style,
  ...rest
}: ContainerProps) {
  return (
    <div
      data-container=""
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 40px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
