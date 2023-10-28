export interface CarbonIconProps
  extends Omit<
    React.SVGProps<React.ReactSVGElement>,
    "ref" | "tabIndex" | "aria-hidden"
  > {
  /** @default 16 */
  size?: 16 | 20 | 24 | 32 | "16" | "20" | "24" | "32" | "glyph" | undefined;
  /** @default "http://www.w3.org/2000/svg" */
  xmlns?: string | undefined;
  /** @default "xMidYMid meet" */
  preserveAspectRatio?: string | undefined;
  "aria-hidden"?: string | undefined;
  "aria-label"?: string | undefined;
  "aria-labelledby"?: string | undefined;
  tabIndex?: string | undefined;
  title?: string | undefined;
  viewBox?: string | undefined;
}

export type CarbonIconType = React.ForwardRefExoticComponent<
  CarbonIconProps & React.RefAttributes<SVGSVGElement>
>;
