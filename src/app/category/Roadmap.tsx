"use client";
import React, {useEffect, useState} from 'react';
import SkillNode from './SkillNode';
import {RoadmapSkill, SkillDetail} from "@/models/skill";

const ROADMAP_SCALE = 200;
const DRAG_SENSITIVITY = 0.01; // 드래그 이동 감도 값

// 로드맵 스킬노드들을 이어주는 선을 그려주는 함수
const drawPath = (parent: RoadmapSkill, child: RoadmapSkill) => {
  const [x1, y1] = parent.position;
  const [x2, y2] = child.position;

  let pathData; 

  if (y1 === y2) {
    pathData = `
      M ${x1 * ROADMAP_SCALE} ${y1 * ROADMAP_SCALE}              
      L ${x2 * ROADMAP_SCALE} ${y2 * ROADMAP_SCALE}    
    `;
  } else {
    pathData = `
      M ${x1 * ROADMAP_SCALE} ${y1 * ROADMAP_SCALE}              
      L ${x1 * ROADMAP_SCALE} ${(y2 - 0.5) * ROADMAP_SCALE}   
      L ${x2 * ROADMAP_SCALE} ${(y2 - 0.5) * ROADMAP_SCALE}    
      L ${x2 * ROADMAP_SCALE} ${y2 * ROADMAP_SCALE}            
    `;
  }

  return <path d={pathData} stroke="#9E9EA7" strokeWidth={3} fill="none" />;
};

// 스킬들의 좌표를 바탕으로 초기 격자무늬 width, height 설정
const getInitialDimensions = (skills: RoadmapSkill[]) => {
  const padding = 100;
  if (skills.length === 0) return { width: 100, height: 100 };

  const xs = skills.map(skill => skill.position[0]);
  const ys = skills.map(skill => skill.position[1]);

  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  const initialWidth = (maxX - minX + 1) * ROADMAP_SCALE + 2 * padding;
  const initialHeight = (maxY - minY + 1) * ROADMAP_SCALE + 2 * padding;

  return { width: initialWidth, height: initialHeight };
};

type RoadmapProps = {
  isEditMode: boolean;
  roadmapSkills: RoadmapSkill[];
  handleUpdateSkill?: (newRoadmapSkill: RoadmapSkill) => void,
  onSelectDetail?: (id: number) => void,
  detailContent?: SkillDetail,
  style?: string,
  onTriggerAction?: null | 'increase' | 'decrease'; // 단일 상태로 트리거 관리
  onResetAction?: () => void; // 트리거 초기화 함수
};

const Roadmap = ({
  isEditMode,
  roadmapSkills,
  handleUpdateSkill,
  onSelectDetail,
  detailContent,
  style,
  onTriggerAction,
  onResetAction,
}: RoadmapProps) => {
  const [skills, setSkills] = useState(roadmapSkills);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [dimensions, setDimensions] = useState(() => getInitialDimensions(roadmapSkills));
  const [minX, setMinX] = useState(0);
  const [minY, setMinY] = useState(0);
  const [zoom, setZoom] = useState(1); 
  const [dragging, setDragging] = useState(false); 
  const [startDrag, setStartDrag] = useState<{ x: number, y: number } | null>(null);

  // 부모 페이지에서 확대하기 버튼을 클릭할 경우
  useEffect(()=>{
    if (onTriggerAction === 'increase' && onResetAction) {
      increaseSize();
      onResetAction(); // 트리거 초기화
    } else if (onTriggerAction === 'decrease' && onResetAction) {
      decreaseSize();
      onResetAction(); // 트리거 초기화
    }
  }, [onTriggerAction, onResetAction]);
  
  // 편집모드 -> 보기모드 변환할때 로드맵 위치 초기화
  useEffect(() => {
    if(isEditMode === false) {
      setMinX(0);
      setMinY(0);
      setStartDrag({x: 0, y: 0});
    }
  }, [isEditMode]);

  // 노드들의 좌표값에 따라 동적으로 viewBox 크기 설정
  useEffect(() => {
    const { width, height } = getInitialDimensions(roadmapSkills);
    setDimensions({ width, height });
    setSkills(roadmapSkills);
  }, [roadmapSkills]);

  // 노드가 2개째 선택되면 선후관계를 정해줌
  useEffect(() => {
    if (selectedSkillIds.length === 2) {
      const [firstId, secondId] = selectedSkillIds;
      const firstNode = skills.find(skill => skill.id === firstId);
      const secondNode = skills.find(skill => skill.id === secondId);

      if (firstNode && secondNode) {
        const updatedFirstNode = {
          ...firstNode,
          child: [...(firstNode.child || []), secondId],
        };
        const updatedSecondNode = {
          ...secondNode,
          parent: [...(secondNode.parent || []), firstId], 
        };
        handleUpdateSkill?.(updatedFirstNode);
        handleUpdateSkill?.(updatedSecondNode);
      }

      setSelectedSkillIds([]);
    } 
  }, [selectedSkillIds]);
  
  // 스킬 노드을 옮겼을 경우 좌표를 최신화하는 함수
  const handleDrag = (id: number, newPosition: [number, number]) => {
    console.log("handleDrag called for ID:", id, "with newPosition:", newPosition);
    setSkills(prevSkills =>
        prevSkills.map(skill =>
            skill.id === id ? { ...skill, position: newPosition } : skill
        )
    );

    const updatedSkill = skills.find(skill => skill.id === id);
    if (updatedSkill) {
      console.log("Calling handleUpdateSkill for updatedSkill:", updatedSkill);
      handleUpdateSkill?.({ ...updatedSkill, position: newPosition });
    } else {
      console.warn(`Skill with ID ${id} not found in skills array.`);
    }
  };


  // SkillNode 컴포넌트에서 callback 받는 함수 -> [편집모드] : 선후관계 표시
  const handleSelectForPath = (id: number) => {
    setSelectedSkillIds(prevIds => 
      prevIds.includes(id) ? prevIds.filter(skillId => skillId !== id) : [...prevIds, id] 
    );
  };

  // SkillNode 컴포넌트에서 callback 받는 함수 -> [보기모드] : 상세 사이드바 표시
  const handleSelectForDetail = (id: number) => {
    console.log("Node selected for detail:", id);
    onSelectDetail?.(id);
  };

  // 로드맵 바탕 격자무늬를 확장시켜주는 함수
  const increaseSize = () => {
    setDimensions(prevDimensions => ({
      width: prevDimensions.width - ROADMAP_SCALE, 
      height: prevDimensions.height - ROADMAP_SCALE,
    }));
  };

  // 로드맵 바탕 격자무늬를 축소시켜주는 함수
  const decreaseSize = () => {
    setDimensions(prevDimensions => ({
      width: prevDimensions.width + ROADMAP_SCALE, 
      height: prevDimensions.height + ROADMAP_SCALE,
    }));
  };
  
  // 화면 드래그 이동 기능
    // 드래그 시작
  const handleMouseDown = (event: React.MouseEvent<SVGElement>) => {
    setDragging(true);
    setStartDrag({ x: event.clientX, y: event.clientY });
  };
    // 드래그 하는 중
  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    if (!dragging || !startDrag) return;
    const dx = (event.clientX - startDrag.x) * DRAG_SENSITIVITY / zoom;
    const dy = (event.clientY - startDrag.y) * DRAG_SENSITIVITY / zoom;
    setMinX(prevMinX => prevMinX - dx);
    setMinY(prevMinY => prevMinY - dy);
    setStartDrag({ x: event.clientX, y: event.clientY });
  };
    // 드래그 종료
  const handleMouseUp = () => {
    setDragging(false);
    setStartDrag(null);
  };

  return (  
    <div className={`${style ? style : 'w-full'} box-border flex flex-col items-end rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.3)] overflow-auto`}>
      <svg 
        width="100%" 
        height="95%" 
        viewBox={`${minX * ROADMAP_SCALE - 100} ${minY * ROADMAP_SCALE - 100} ${dimensions.width} ${dimensions.height}`} 
        preserveAspectRatio="xMinYMin meet"
        onMouseDown={isEditMode ? handleMouseDown : undefined} 
        onMouseMove={isEditMode ? handleMouseMove : undefined} 
        onMouseUp={isEditMode ? handleMouseUp : undefined} 
        onMouseLeave={isEditMode ? handleMouseUp : undefined} 
      >
        {isEditMode && (
          <>
            <defs>
              <pattern id="grid" width={ROADMAP_SCALE} height={ROADMAP_SCALE} patternUnits="userSpaceOnUse">
                <rect width={ROADMAP_SCALE} height={ROADMAP_SCALE} fill="none" stroke="#CCC" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </>
        )}
        {skills.map((skill) => {
          if (skill.child) {
            return skill.child.map((childId) => {
              const childSkill = skills.find((s) => s.id === childId);
              if (childSkill) {
                return (
                  <g key={`${skill.id}-${childId}`}>{drawPath(skill, childSkill)}</g>
                )
              }
              return null;
            });
          }
          return null;
        })}

        {skills.map((skill) => (
          <g className='cursor-pointer' key={skill.id}>
            <SkillNode 
              key={skill.id} 
              skill={skill} 
              scale={ROADMAP_SCALE} 
              isSelected={selectedSkillIds.includes(skill.id)}
              onSelect={isEditMode ? handleSelectForPath : handleSelectForDetail}
              onDrag={isEditMode ? handleDrag : undefined}
            />
          </g>
          
        ))}
      </svg>
    </div>
  );
}

export default Roadmap;