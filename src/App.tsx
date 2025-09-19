import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  const gridSize = 10;
  const cellSize = 50;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (squareRef.current && gridRef.current) {
      const rect = squareRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      setDragOffset({ x: offsetX, y: offsetY });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && gridRef.current) {
      e.preventDefault();
      const rect = gridRef.current.getBoundingClientRect();
      let newX = e.clientX - rect.left - dragOffset.x;
      let newY = e.clientY - rect.top - dragOffset.y;

      // Snap to grid
      newX = Math.max(0, Math.round(newX / cellSize) * cellSize);
      newY = Math.max(0, Math.round(newY / cellSize) * cellSize);

      // Bound to grid
      newX = Math.min(newX, (gridSize - 1) * cellSize);
      newY = Math.min(newY, (gridSize - 1) * cellSize);

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <main className="container">
      <h1>2D Grid Environment</h1>
      <p>Drag the square around the grid.</p>
      <div
        ref={gridRef}
        className="grid"
        style={{ width: gridSize * cellSize, height: gridSize * cellSize }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div key={i} className="cell" />
        ))}
        <div
          ref={squareRef}
          className="square"
          style={{
            left: position.x,
            top: position.y,
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </main>
  );
}

export default App;
