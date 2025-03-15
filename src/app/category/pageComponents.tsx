'use client';

import React, {useEffect, useState} from 'react';
import Roadmap from './Roadmap';
import {RoadmapSkill, SkillDetail} from "@/models/skill";
import TimelineRoadmap from "@/app/category/TimeLineRoadMap";
import CategoryButton from '@/app/category/CategoryButton';
import SkillDetailModal from "@/app/customRoadmap/SkillDetailModal";

const mockRoadmapSkills: RoadmapSkill[] = [
  { id: 1, name: 'HTML', child: [27, 28, 29], position: [0, 0], tag:'basic'},
  { id: 2, name: 'CSS', child: [5, 6], position: [1, 0]  ,tag:'basic'},
  { id: 3, name: 'JavaScript', child: [4, 7, 8, 9], position: [3, 0] ,tag:'basic'},
  { id: 4, name: 'TypeScript', parent:[3], child: [7, 8, 9], position: [4, 0] ,tag:'basic'},

  { id: 5, name: 'Tailwind', parent: [2], child:[10], position: [1, 1] ,tag:'framework'},
  { id: 6, name: 'Bootstrap', parent: [2], position: [2, 1] ,tag:'none'},
  { id: 7, name: 'React', parent: [3], child:[11, 12, 13], position: [3, 1],tag:'framework' },
  { id: 8, name: 'Angular', parent: [3], child:[14], position: [6, 1] ,tag:'framework'},
  { id: 9, name: 'Vue.js', parent: [3], child:[15, 16, 17], position: [7, 1] ,tag:'framework'},

  { id: 10, name: 'SASS', parent: [5], child:[18], position: [1, 2],tag:'framework' },
  { id: 11, name: 'React Hooks', parent: [7],  child:[19, 20, 21], position: [3, 2],tag:'none' },
  { id: 12, name: 'Redux', parent: [7], child:[19, 20, 21], position: [4, 2] ,tag:'none'},
  { id: 13, name: 'Recoil', parent: [7], child:[19, 20, 21], position: [5, 2] ,tag:'none'},
  { id: 14, name: 'RxJS', parent: [8], child:[19, 20, 21], position: [6, 2] ,tag:'none'},
  { id: 15, name: 'VueX', parent: [9], child:[19, 20, 21], position: [7, 2] ,tag:'none'},
  { id: 16, name: 'Pinia', parent: [9], child:[19, 20, 21], position: [8, 2] ,tag:'none'},
  { id: 17, name: 'Vite', parent: [9], child:[19, 20, 21], position: [9, 2] ,tag:'none'},

  { id: 18, name: 'PostCSS', parent: [10], child:[27, 28, 29], position: [1, 3] ,tag:'none'},
  { id: 19, name: 'Axios', parent: [11, 12, 13, 14, 15, 16, 17], child:[22, 23], position: [3, 3] ,tag:'connection'},
  { id: 20, name: 'Web Socket', parent: [11, 12, 13, 14, 15, 16, 17], child:[22, 23], position: [4, 3] ,tag:'none'},
  { id: 21, name: 'ESLint', parent: [11, 12, 13, 14, 15, 16, 17], child:[22, 23], position: [5, 3],tag:'none' },

  { id: 22, name: 'Webpack', parent: [19, 20, 21], child:[24, 25, 26], position: [3, 4] ,tag:'none'},
  { id: 23, name: 'GraphQL', parent: [19, 20, 21], child:[24, 25, 26], position: [4, 4] ,tag:'connection'},

  { id: 24, name: 'Cypress', parent: [22, 23], child:[27, 28, 29], position: [3, 5] ,tag:'test'},
  { id: 25, name: 'Jest', parent: [22, 23], child:[27, 28, 29], position: [4, 5] ,tag:'test'},
  { id: 26, name: 'MobX', parent: [22, 23], child:[27, 28, 29], position: [5, 5] ,tag:'none'},

  { id: 27, name: 'Vercel', parent: [1, 18, 24, 25, 26], position: [1, 6] ,tag:'none'},
  { id: 28, name: 'AWS S3', parent: [1, 18, 24, 25, 26], position: [2, 6] ,tag:'none'},
  { id: 29, name: 'Netlify', parent: [1, 18, 24, 25, 26], position: [3, 6] ,tag:'none'},
];

const categories = ['frontend', 'backend', 'data', 'security', 'application'];
const categoryLabels: Record<string, string> = {
  frontend: 'Web/Frontend',
  backend: 'Web/Backend',
  data: 'Data Science',
  security: 'Security',
  application: 'Application'
};
export default function CategoryPage() {
  const [category, setCategory] = useState<string>('frontend');
  const [roadmapSkills, setRoadmapSkills] = useState<RoadmapSkill[]>([]);
  const categoryName = categoryLabels[category];
  const [selectedSkillPng, setSelectedSkillPng] = useState<string>("");
  const [skillDetailData, setSkillDetailData] = useState<SkillDetail | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
  const [triggerAction, setTriggerAction] = useState<null | 'increase' | 'decrease'>(null);
  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${category}`, {
          credentials: 'omit',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            parent: item.parent,
            child: item.child,
            position: [item.position[0], item.position[1]] as [number, number],
            tag:item.tag,
        }));
        setRoadmapSkills(formattedData);
      } catch (error) {
        console.error('Error fetching cards:', error);
        setRoadmapSkills(mockRoadmapSkills);
      }
    };

    fetchData();
  }, [category]);

  const selectCategory = (category: string) => {
    setCategory(category);
  };

  const onSelectDetail = async (id: number) => {
    try {
      console.log("Fetching details for node ID:", id);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/mastery/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to fetch mastery details");
      }
      const data : SkillDetail = await response.json();
      const skillDetail: SkillDetail = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        list: data.list.map((topic) => ({
          id: topic.id,
          title: topic.title,
          subtitle: topic.subtitle,
          status: topic.status ? 'completed' : 'not-started',
        })),
      };
      setSkillDetailData(skillDetail);
      setSelectedSkillPng(`/asset/png/skill/${data.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/\./g, '')
          .replace(/#/g, 'sharp')}_img.png`);
      setIsDetailVisible(true);
    } catch (error) {
      console.error("Error fetching mastery details:", error);
    }
  };

  // 로드맵 크기 관련 트리거 
  // 1) 로드맵 확장 트리거
  const handleIncreaseSize = () => {
    setTriggerAction('increase'); 
  };
  // 2) 로드맵 축소 트리거
  const handleDecreaseSize = () => {
    setTriggerAction('decrease'); 
  };
  // 3) 초기화 트리거
  const resetAction = () => {
    setTriggerAction(null);
  };
  
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className='w-full h-40 flex flex-row items-center justify-center border-b border-gray-d9'>
        <div className='max-w-[1400px] w-full h-full py-2 sm:py-0 px-4 2xl:w-[1400px] xl:px-20 lg:px-10 h-full grid grid-cols-3 sm:grid-cols-5 flex flex-row items-center justify-between'>
          {categories.map(c => (
            <div key={c} onClick={()=>selectCategory(c)} className='cursor-pointer'>
              <CategoryButton key={c} category={c} />
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1400px] w-full h-full px-4 2xl:w-[1400px] xl:px-20 lg:px-10 flex flex-col items-center mb-10">
        <div className='w-full'>
          <TimelineRoadmap category={category} skills={roadmapSkills}/>
        </div>
        <div className='w-full flex flex-col pb-10'>
          <div className="flex flex-col">
            <div className="font-bold">RoadMap</div>
            <div className={`font-semibold text-category-${category} mb-2`}>{categoryName}</div>
          </div>
          <div className='w-40 sm:w-56 lg:w-60 flex justify-between mb-2 '>
            <div
              onClick={handleDecreaseSize}
              className="bg-primary text-white text-xs sm:text-sm lg:text-base px-2 sm:px-4 py-2 rounded-xl cursor-pointer"
            >
              {'축소하기(-)'}
            </div>
            <div
              onClick={handleIncreaseSize}
              className="bg-primary text-white text-xs sm:text-sm lg:text-base px-2 sm:px-4 py-2 rounded-xl cursor-pointer"
            >
              {'확대하기(+)'}
            </div>
          </div>
          <Roadmap 
            style={'h-[40dvh] sm:h-[70dvh] md:h-dvh'}
            isEditMode={false} 
            roadmapSkills={roadmapSkills} 
            onTriggerAction={triggerAction}
            onSelectDetail={onSelectDetail}
            onResetAction={resetAction}
          />
        </div>
      </div>
      {isDetailVisible && (
        <SkillDetailModal
          style={'w-full sm:w-1/2 border-none'}
          skillDetail={skillDetailData as SkillDetail}
          selectedSkillPng={selectedSkillPng}
          fromPage={'category'}
          onClose={() => setIsDetailVisible(false)}
        />
      )}
    </div>
  );
}