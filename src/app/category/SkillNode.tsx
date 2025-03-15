"use client";
import React, {useState} from 'react';
import {RoadmapSkill} from "@/models/skill";

type SkillNodeProps = {
  skill: RoadmapSkill,
  scale: number,
  isSelected: boolean,
  onSelect?: (id: number) => void,
  onDrag?: (id: number, position: [number, number]) => void;
}
const SkillNode = ({
  skill,
  scale,
  isSelected,
  onSelect,
  onDrag
}: SkillNodeProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const image_skill_name = skill.name.toLowerCase().replace(/\s+/g, '').replace(/\./g, '').replace(/#/g, 'sharp'); // 소문자, 공백제거, "."제거, #->sharp
  const image_src = `/asset/png/skill/${image_skill_name}_img.png`;
  
  // 스킬노드를 드래그하여 위치를 옮기는 함수
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    
    const initialX = e.clientX;
    const initialY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - initialX;
      const deltaY = moveEvent.clientY - initialY;
      const newPosition: [number, number] = [
        Math.round(skill.position[0] + deltaX / scale),
        Math.round(skill.position[1] + deltaY / scale),
      ];
      console.log("Dragging node:", skill.id, "New position:", newPosition);
      onDrag?.(skill.id, newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 선후관계를 위하여 스킬노드를 선택하는 함수
  const handleClick = () => {
    console.log("Node clicked:", skill.id);
    onSelect?.(skill.id); 
  };

  return (
    <g
      transform={`translate(${skill.position[0] * scale}, ${skill.position[1] * scale})`} 
      onMouseDown={onDrag ? handleMouseDown : undefined} 
      onClick={onSelect ? handleClick: undefined}
    >
      <rect 
        x={-50} // 테두리의 x 위치
        y={-50} // 테두리의 y 위치
        width={100} // 테두리의 너비
        height={100} // 테두리의 높이
        fill={isDragging || isSelected ? "#3D3D4E" : "#FFFFFF"} // 배경색: 드래그 중이면 어두운 색
        stroke="#343434" // 테두리 색상
        strokeWidth={1} // 테두리 두께
        rx={8} // 수평 반경 (모서리 둥글기)
        ry={8} // 수직 반경 (모서리 둥글기)
      />
      <image 
        href={image_src}
        x={-25} // 이미지의 x 위치
        y={-30} // 이미지의 y 위치
        width={50} // 이미지의 너비
        height={50} // 이미지의 높이
      />
      <text 
        x={0} 
        y={40}
        fill={isDragging || isSelected ? "#FFFFFF" : "#000000"} 
        fontSize='15px'
        textAnchor="middle"
      >
        {skill.name}
      </text>
    </g>
  );
}

export default SkillNode;