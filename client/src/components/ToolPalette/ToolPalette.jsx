import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEraser, faPaintbrush, faSquare } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../../palette";
import "./ToolPalette.css";

const TOOLS = [
  { id: "CIRCLE", label: "Circle", icon: faCircle },
  { id: "SQUARE", label: "Square", icon: faSquare },
  { id: "BRUSH", label: "Brush", icon: faPaintbrush },
  { id: "ERASE", label: "Eraser", icon: faEraser },
];

export default function ToolPalette({ activeTool, activeColor, onToolChange, onColorChange }) {
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
            onClick={() => onColorChange(color)}
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
            onClick={() => onToolChange(id)}
          >
            <FontAwesomeIcon icon={icon} />
          </button>
        ))}
      </div>
    </aside>
  );
}
