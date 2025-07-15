import { ReactNode } from "react";

declare module "react-date-range" {
  export interface DateRangeProps {
    renderDayContents?: (date: Date) => ReactNode;
  }
}