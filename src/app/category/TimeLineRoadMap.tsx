'use client';
import React, {useMemo} from 'react';
import SkillNode from './SkillNode';
import {RoadmapSkill} from '@/models/skill';
import Slider from 'react-slick';

function TimelineRoadmap({ skills, category }: { skills: RoadmapSkill[], category: string }) {
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => skill.tag !== "none");
  }, [skills]);

  // tag별로 그룹화하고, 같은 tag 내에서는 id 순서대로 정렬
  const groupedSkills = useMemo(() => {
    const groups: { [tag: string]: RoadmapSkill[] } = {};

    filteredSkills.forEach(skill => {
      if (!groups[skill.tag]) {
        groups[skill.tag] = [];
      }
      groups[skill.tag].push(skill);
    });


    return groups;
  }, [filteredSkills]);

  // SVG의 가로 위치 계산을 위한 기준값들
  const itemSpacing = 110; // 그룹 내 아이템 간격 (좁게 설정해 tag별로 가깝게 배치)
  const groupSpacing = 150;
  let currentXOffset = 0; // 그룹의 x 위치를 추적하기 위한 변수

  const bg_color = `bg-category-${category}`;

  type CategoryDetails = {
    title: string;
    description: string;
    color: string;
  };

  const categoryInfo: Record<string, CategoryDetails>  = {
    frontend: {
      title: "웹/프론트엔드",
      description: "유저와 가장 가까운 개발자",
      color: "black",
    },
    backend: {
      title: "웹/백엔드",
      description: "서버와 데이터베이스를 다루는 개발자",
      color: "white",
    },
    data: {
      title: "데이터 사이언스",
      description: "유저의 경험을 기반삼아 서비스를 구축하는 개발자",
      color: "black",
    },
    security: {
      title: "보안",
      description: "시스템과 데이터를 보호하는 개발자",
      color: "white",
    },
    application: {
      title: "애플리케이션",
      description: "모바일 및 데스크탑 앱을 개발하는 개발자",
      color: "white",
    }
  };

  const settings = {
    dots: true, 
    infinite: false, 
    speed: 500,
    slidesToShow: 1, 
    slidesToScroll: 1,
    adaptiveHeight: true, 
  };

  return (
    <div className={`box-border justify-between my-4 lg:my-10 flex ${bg_color} rounded-lg`}>
      <div className="w-1/4 bg-dark-light rounded-s-lg flex justify-center items-center p-2 sm:p-4 md:p-8 lg:p-10">
        <img className="w-44 h-40 object-contain" src={`/asset/png/category/${category}_img.png`} alt ={category}></img>
      </div>
      <div className={`w-3/4 flex flex-col justify-center items-start p-4 text-${categoryInfo[category].color}`}>
        <div className="font-bold text-sm sm:text-base">{categoryInfo[category].title}</div>
        <div className="font-light text-sm sm:text-base">{categoryInfo[category].description}</div>
        <div className='hidden lg:flex w-full h-full overflow-x-auto'>
          <div className='h-[200px] flex items-center'>
            <svg
              width="100%"
              height="80%"
              viewBox="-50 -100 2000 300" // xmin, ymin, width, height
              className="flex items-center"
            >
              <line
                x1={-50} // 바의 시작 X 좌표
                y1={50}
                x2={2000} // 바의 끝 X 좌표
                y2={50} // Y 좌표는 0으로 고정
                stroke="#ffffff"
                strokeWidth="5"
              />
              {Object.keys(groupedSkills).map((tag, groupIndex) => {
                const skills = groupedSkills[tag];
                const xOffset = currentXOffset;
                const yOffset = groupIndex % 2 === 0 ? 160 : -60; // 그룹 인덱스에 따라 Y축 오프셋 조정

                // 다음 그룹의 시작 위치를 계산
                currentXOffset += skills.length * itemSpacing + groupSpacing;

                const centerX = (skills.length * itemSpacing) / 2 - 50;

                return (
                  <g key={tag} transform={`translate(${xOffset},${yOffset})`}>
                    {/* 각 스킬을 가로로 일렬로 배치 (itemIndex * itemSpacing 만큼 오른쪽으로 이동) */}
                    {skills.map((skill, itemIndex) => (
                      <g key={skill.id} transform={`translate(${itemIndex * itemSpacing}, 0)`}>
                        <SkillNode
                          skill={skill}
                          scale={0.5}
                          isSelected={false}
                          onSelect={undefined}
                          onDrag={undefined}
                        />
                      </g>
                    ))}
                    <text 
                      x={centerX} 
                      y={groupIndex % 2 === 0 ? -70 : 90} 
                      textAnchor="middle" 
                      fontSize="25" 
                      fontWeight="bold" 
                      fill="#ffffff"
                    >
                      {tag} 
                  </text>
                    <circle cx={centerX} cy={groupIndex % 2 === 0 ? -110 : 110} r={10} fill="#ffffff" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        <div className='lg:hidden w-full h-full flex justify-center items-center'>
        <Slider {...settings} className="w-full mt-4">
          {Object.keys(groupedSkills).map((tag, groupIndex) => {
            const groupWidth = (groupedSkills[tag].length - 1) * 150; // 각 아이템의 간격 (150px)
            const centerX = 500; // circle의 중심 위치
            const groupStartX = centerX - groupWidth / 2; // 그룹 시작 X 위치 계산

            return (
              <div key={tag} className="w-full p-4">
                <div className="relative w-full scale-[2.2] xs:scale-[2.0]">
                  <svg
                    width="100%"
                    height="80px"
                    viewBox="-50 -100 1100 300"
                    className="flex items-center"
                  >
                    <line
                      x1={-100}
                      y1={100}
                      x2={1100}
                      y2={100}
                      stroke="#ffffff"
                      strokeWidth="5"
                    />
                    <g transform={`translate(${groupStartX}, 0)`}>
                      {groupedSkills[tag].map((skill, itemIndex) => (
                        <g
                          key={skill.id}
                          transform={`translate(${itemIndex * 150}, 0)`} // itemSpacing 조정
                        >
                          <SkillNode
                            skill={skill}
                            scale={0.5}
                            isSelected={false}
                            onSelect={undefined}
                            onDrag={undefined}
                          />
                        </g>
                      ))}
                    </g>
                    <text 
                      x={centerX} 
                      y={150} 
                      textAnchor="middle" 
                      fontSize="25" 
                      fontWeight="bold" 
                      fill="#ffffff"
                    >
                      {tag} 
                    </text>
                    <circle cx={centerX} cy={100} r={10} fill="#ffffff" />
                  </svg>
                </div>
              </div>
            );
          })}
        </Slider>
        </div>
      </div>
    </div>
  );
}
export default TimelineRoadmap;

