import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEraser, faPaintbrush, faSquare, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../../board/palette.ts";
import type { Tool } from "../../board/tools.ts";
import "./ToolPalette.css";

const TOOLS: { id: Tool; label: string; icon: IconDefinition }[] = [
  { id: "circle", label: "Circle", icon: faCircle },
  { id: "square", label: "Square", icon: faSquare },
  { id: "brush", label: "Brush", icon: faPaintbrush },
  { id: "eraser", label: "Eraser", icon: faEraser },
];

interface Props {
  activeTool: Tool;
  activeColor: string;
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
}

export default function ToolPalette({ activeTool, activeColor, onToolChange, onColorChange }: Props) {
  return (
    <aside className="tool-palette">
      <div className="palette-card swatches" role="group" aria-label="Color">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className="swatch"
            title={color}
            aria-label={`Color ${color}`}
            aria-pressed={color === activeColor}
            onClick={() => {
              onColorChange(color);
            }}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="9" fill={color} />
            </svg>
          </button>
        ))}
      </div>
      <div className="palette-card tools" role="group" aria-label="Tool">
        {TOOLS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className="tool"
            title={label}
            aria-label={label}
            aria-pressed={id === activeTool}
            onClick={() => {
              onToolChange(id);
            }}
          >
            <FontAwesomeIcon icon={icon} />
          </button>
        ))}
      </div>
    </aside>
  );
}
