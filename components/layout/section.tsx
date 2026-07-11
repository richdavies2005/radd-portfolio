import type { CSSProperties, ElementType, ReactNode } from "react";

interface SectionProps {
  /**
   * `grid-template-areas` value applied at the md breakpoint and up, e.g.
   *   `"headline headline . image image image"
   *    "headline headline . image image image"`
   * Below md, content stacks in DOM order (flex column) — DOM order always
   * matches reading order, only the CSS Grid placement at md+ rearranges
   * visually. This keeps tab order sane on broken-grid layouts.
   */
  areasMd: string;
  className?: string;
  as?: ElementType;
  children: ReactNode;
}

/** The one place overlapping/asymmetric section layouts are composed. */
export function Section({
  areasMd,
  className = "",
  as: Tag = "section",
  children,
}: SectionProps) {
  const style = { "--areas-md": areasMd } as CSSProperties;
  return (
    <Tag
      data-areas-md=""
      style={style}
      className={`grid-section flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-3 ${className}`}
    >
      {children}
    </Tag>
  );
}

interface AreaProps {
  name: string;
  className?: string;
  as?: ElementType;
  children: ReactNode;
}

/** A single named slot inside a <Section>. `name` must match a token used in areasMd. */
export function Area({ name, className = "", as: Tag = "div", children }: AreaProps) {
  return (
    <Tag style={{ gridArea: name }} className={className}>
      {children}
    </Tag>
  );
}
