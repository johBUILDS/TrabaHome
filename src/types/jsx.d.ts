import type { ComponentType } from "react";

declare module "*.jsx" {
  const Component: ComponentType<Record<string, unknown>>;
  export default Component;
}
