// p5 core plus only the modules the board uses, registered the way p5's own app entry does.
// The full "p5" entry also bundles WebGL, typography, images and sound-free extras.
import p5 from "p5/core";
import color from "p5/color";
import events from "p5/events";
import shape from "p5/shape";

shape(p5);
color(p5);
events(p5);

export default p5;
