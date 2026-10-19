// p5 publishes types for its full entry only; these describe the modular entries it also exports.
declare module "p5/core" {
  import p5 from "p5";
  export default p5;
}

declare module "p5/color" {
  import type p5 from "p5";
  export default function addon(core: typeof p5): void;
}

declare module "p5/events" {
  import type p5 from "p5";
  export default function addon(core: typeof p5): void;
}

declare module "p5/shape" {
  import type p5 from "p5";
  export default function addon(core: typeof p5): void;
}
