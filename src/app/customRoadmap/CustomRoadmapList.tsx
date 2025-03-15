"use client";
import React from 'react';
import {CustomRoadmapName} from "@/models/roadmap";

type CustomRoadmapListProps = {
  roadmapData: CustomRoadmapName[];
  selectedRoadmapId: number | null;
  onSelectRoadmap?: (id: number) => void;
  handleCreateBtn: () => void;
  closeSidePanel?: () => void;
};

export default function CustomRoadmapList({
  roadmapData,
  selectedRoadmapId,
  onSelectRoadmap,
  handleCreateBtn,
  closeSidePanel
}: CustomRoadmapListProps) {

  const handleSelectedCard = (id: number) =>{
    if(onSelectRoadmap && closeSidePanel){
      onSelectRoadmap(id);
      closeSidePanel();
    }
    else if(onSelectRoadmap) {
      onSelectRoadmap(id);
    }
  }
  return (
    <div className="w-[250px] h-full text-sm py-4 bg-gray-f8">
      <div className='w-full flex justify-between items-center '>
        <div className="w-full mb-2 px-4 font-gmarketsansMedium text-lg">커스텀 로드맵 목록</div>
        <div 
          className='w-[35px] h-[25px] flex items-center justify-center border-2 rounded-2xl mx-4 mb-2 font-black cursor-pointer hover:bg-white'
          onClick={handleCreateBtn}  
        >{'+'}</div>
      </div>
      <div className='w-full h-full overflow-auto scrollbar flex flex-col'>
        {roadmapData.map((roadmap) => (
          <div
            key={roadmap.id}
            className={`${
              roadmap.id === selectedRoadmapId && "bg-white rounded-lg border-2 border-gray-99"
            } w-[220px] h-16 flex justify-start items-center bg-white border border-gray-d9 rounded-lg mb-2 mx-4 py-1 px-2 cursor-pointer`}
            onClick={() => handleSelectedCard(roadmap.id)}
          >
            {roadmap.name?.length && roadmap.name?.length > 12
              ? roadmap.name?.substring(0, 12) + "..."
              : roadmap.name}
          </div>
        ))}
      </div>
      
    </div>
  );
};
