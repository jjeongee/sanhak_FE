import React, {useEffect, useState} from 'react';
import Roadmap from '../category/Roadmap';
import {ExitIcon} from '@/components/icon';
import {AllKindOfRoadmapSkills, RoadmapSkill, SkillDetail, SkillSelectUnion} from "@/models/skill";
import {CustomRoadmapName} from "@/models/roadmap";

type RoadmapCustomizeProps = {
  customRoadmapList: CustomRoadmapName[];
  allCategorySkills: AllKindOfRoadmapSkills[];
  skills: RoadmapSkill[];
  handleUpdateRoadmap: (newSkill: RoadmapSkill) => void, 
  onSaveRoadmap: () => void,
  getSelectDetail: (id: number) => void,
  skillDetailData: SkillDetail,
  defaultTag: SkillSelectUnion
};

const categoryList = [
  { label: '웹/프론트엔드', value: 'frontend' },
  { label: '웹/백엔드', value: 'backend' },
  { label: '데이터 사이언스', value: 'data' },
  { label: '보안', value: 'security' },
  { label: '어플리케이션', value: 'application' },
];

const RoadmapCustomize = ({ 
  customRoadmapList,
  allCategorySkills,
  skills, 
  handleUpdateRoadmap, 
  onSaveRoadmap,
  getSelectDetail,
  skillDetailData,
    defaultTag
}: RoadmapCustomizeProps) => {
  let newPosition: [number, number] | null = null;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [roadmapSkills, setRoadmapSkills] = useState<RoadmapSkill[]>(skills);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>(customRoadmapList[0].name);
  const [selectedSkillPng, SetSelectedSkillPng] = useState<string>('');
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false); 

  // 상위 컴포넌트인 pageComponent에서 선택한 로드맵에 속한 스킬 리스트로 SET
  useEffect(() => {
    setRoadmapSkills(skills);
  }, [skills]);
  
  // 카테고리 선택하는 함수
  const getSkillsByCategory = (category: string): string[] => {
    const categorySkills = allCategorySkills.find(cat => cat.category === category.toLowerCase());
    if (categorySkills) {
      const skills = categorySkills.skills;
      return skills.map(skill => skill.name);
    }
    return [];
  };

  // 사이드바에서 새로운 스킬노드를 로드맵에 추가시킬 때, 위치를 지정해주는 함수
  const handleAddSkill = (skillName: string) => {
    const maxX = Math.max(...roadmapSkills.map(skill => skill.position[0]), 0);
    const maxY = Math.max(...roadmapSkills.map(skill => skill.position[1]), 0);
  
    const generateUniquePosition = () => {
      // 자연스러운 position 추가를 위해 랜덤값 활용
      const getRandomOffset = () => Math.floor(Math.random() * 3) - 1; 
      let x = maxX + getRandomOffset(); 
      let y = maxY + getRandomOffset(); 
      newPosition = [x, y];
      
      // 겹치는 스킬 있는지 확인
      while (roadmapSkills.some(skill => skill.position[0] === x && skill.position[1] === y)) {
        x += 1;
        y += 1;
        newPosition = [x, y];
      }
    };
    generateUniquePosition();
  
    if(newPosition) {
      const maxId = Math.max(...roadmapSkills.map(skill => skill.id), 0);
      const newId = maxId + 1;
      const newSkill: RoadmapSkill = {
        // "저장하기" 버튼을 눌러 API콜을 하기 전까지, frontend에서 임시로 ID를 생성하여 사용
        id: newId, 
        name: skillName,
        child: [],
        position: newPosition,
        tag:defaultTag
      };
      handleUpdateRoadmap(newSkill);
    }
  };

  // 상위 컴포넌트의 로드맵 업데이트 callback 함수 호출 -> API호출은 아님
  const handleUpdateSkill = (newRoadmapSkill: RoadmapSkill) => {
    handleUpdateRoadmap(newRoadmapSkill);
  };


  // 최종적으로 편집이 완료된 로드맵을 바탕으로 "저장하기" 버튼을 누름 -> 상위 컴포넌트의 callback 함수 호출
  const handleSaveRoadmap = () => {
    setIsEditMode((prev) => !prev);
    onSaveRoadmap();
  }

  // 스킬을 선택한 id 정보를 상위 컵포넌트인 pageComponent로 넘겨 데이터를 받아옴 -> API호출을 위하여
  const onSelectDetail = (id: number) => {
    console.log("Fetching details for node ID:", id);
    getSelectDetail(id);
    setIsDetailVisible(true);
    SetSelectedSkillPng(`/asset/png/skill/${skillDetailData.name.
    toLowerCase()
        .replace(/\s+/g, '')
        .replace(/\./g, '')
        .replace(/#/g, 'sharp')}_img.png`)
  }

  return (
    <div className="flex w-full h-full border rounded-xl">

      {/* 보기모드, 편집모드에 따른 로드맵 측면 사이드창*/}
      {isEditMode ? (
        <div className="w-1/4 h-auto bg-primary border-r border-gray-300 rounded-l-xl">
          <div className="w-full p-5 bg-white font-bold rounded-l-xl flex items-center justify-between">
            <span className="w-2/3 flex-1 mr-2 overflow-hidden whitespace-normal text-ellipsis">
              {selectedRoadmap}
            </span>
            <button 
              onClick={() => handleSaveRoadmap()}
              className="bg-primary rounded-lg font-normal text-sm p-2 text-white">
              {"저장하기"}
            </button>
          </div>
          <ul className="w-full p-5 bg-primary space-y-2 font-bold text-white">
            {categoryList.map(category => (
              <React.Fragment key={category.value}>
                <li
                  onClick={() => setSelectedCategory(category.value === selectedCategory ? null : category.value)}
                  className={`cursor-pointer py-2 hover:text-black rounded ${category.value === selectedCategory && 'text-black'}`}
                >
                  {category.label}  
                </li>

                {selectedCategory === category.value && (
                  <ul className="ml-4 space-y-1 font-normal">
                    {getSkillsByCategory(category.value).map((skill, index) => (
                      <li 
                        onClick={() => handleAddSkill(skill)}
                        key={index} className="cursor-pointer text-sm text-gray-600 hover:text-black">
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      ) : (
        <div className="w-1/4 h-auto border-r border-gray-300 rounded-l-xl">
          <ul className="w-full h-full bg-primary space-y-2 font-bold text-white rounded-l-xl">
            {customRoadmapList.map(roadmap => (
              <React.Fragment key={roadmap.id}>
                <li
                  onClick={() => setSelectedRoadmap(roadmap.name)}
                  className={`flex items-center justify-between cursor-pointer p-5 hover:text-black rounded-l-xl ${roadmap.name === selectedRoadmap && 'bg-white text-black'}`}
                >
                  <span className="w-2/3 flex-1 mr-2 overflow-hidden whitespace-normal text-ellipsis">
                    {roadmap.name}
                  </span>
                  {roadmap.name === selectedRoadmap && (
                    <button 
                      onClick={() => setIsEditMode((prev) => !prev)}
                      className="bg-primary rounded-lg font-normal text-sm p-2 text-white">
                      {"편집하기"}
                    </button>
                  )}  
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      {/* 로드맵 화면 */}
      <div className="w-3/4 h-full p-5">
        <div className="w-full h-full">
          <div className="flex flex-col">
          </div>
          <Roadmap
              isEditMode={isEditMode}
              roadmapSkills={roadmapSkills}
              handleUpdateSkill={handleUpdateSkill}
              onSelectDetail={onSelectDetail}/>
        </div>
      </div>

    {/* 스킬 상세설명 전체 사이드창 */}
      {isDetailVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-end items-center z-50">
          <div className="bg-white p-5 w-1/3 h-full overflow-y-auto">
            <div className='flex justify-between items-center mb-2'>
              <div className='flex items-center pl-5'>
                <img className="w-12 h-auto" src={selectedSkillPng} />
                <h2 className="text-xl font-bold">{skillDetailData.name}</h2>
              </div>
              <button onClick={() => setIsDetailVisible(false)} >
                <ExitIcon />
              </button>
            </div>
            <p className="mb-10 px-5">{skillDetailData.description}</p>

            <div className="relative mb-8 flex items-center justify-start">
              <hr className="w-full border-t border-primary" />
              <div className="absolute bg-white border border-color-primary rounded-xl ml-5 px-5 py-1 font-semibold">
                목차
              </div>
            </div>
            
            <ul className='px-5 relative'>
              {skillDetailData.list.map((topic, index) => (
                  <li key={index} className="pb-5 relative flex items-start">
                    <div className="absolute left-0 top-0 h-full w-2 border-r border-primary"></div>
                    <div
                        className={`relative z-10 w-4 h-4 mr-3 rounded-full border ${
                            topic.status === "completed" ? "bg-primary" : "bg-white"
                        } border-black`}
                    ></div>
                    <div>
                      <div className='flex'>
                        <div className="font-bold">{topic.title}</div>
                        <div className='text-white bg-primary rounded-xl px-5 ml-2 w-fit'>{topic.status}</div>
                      </div>
                      <ul className="pl-4 mt-2">
                        {topic.subtitle.map((sub, subIndex) => (
                            <li key={subIndex} className="mb-2 text-sm">{sub}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}

export default RoadmapCustomize;
