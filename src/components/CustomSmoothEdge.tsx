import type { EdgeProps } from "@xyflow/react";
import { getSmoothStepPath, Position } from "@xyflow/react";

const CustomSmoothEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 50,
  });

  return (
    <g className="react-flow__edge">
      <path id={id} className="react-flow__edge-path" d={edgePath} />
    </g>
  );
};

export default CustomSmoothEdge;
