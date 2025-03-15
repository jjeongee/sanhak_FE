'use client';
import React, {useEffect, useState} from 'react';
import CustomRoadmapList from './CustomRoadmapList';
import Roadmap from '../category/Roadmap';
import {AllKindOfSkills, RoadmapSkill, SkillDetail} from '@/models/skill';
import CustomSkillList from './CustomSkillList';
import {ChangeRoadmapDTO, CustomRoadmapDetail, CustomRoadmapName} from "@/models/roadmap";
import SkillDetailModal from './SkillDetailModal';

// TODO 1: API 연결 -> 유저의 커스텀 로드맵 리스트
const fetchCustomRoadmapList = async (): Promise<CustomRoadmapName[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/roadmap/list`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로드맵 목록 데이터를 가져오는 데 실패했습니다.');
  }
  return response.json();
};

// TODO 2: API 연결 -> 위에서 선택된 로드맵에 해당하는 디테일한 데이터
const fetchRoadmapDetail = async (roadmapId: number): Promise<CustomRoadmapDetail> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/roadmap/${roadmapId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로드맵 데이터를 가져오는 데 실패했습니다.');
  }
  return response.json();
};

// TODO 3: API 연결
const fetchSkills = async (): Promise<AllKindOfSkills[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/skills`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('스킬 데이터를 가져오는 데 실패했습니다.');
  }

  return response.json();
};

const updateRoadmapState = async (roadmapId: number, state: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/roadmap/state/${roadmapId}/${state}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('로드맵 상태 변경 실패');
    }
    console.log(`로드맵 상태가 ${state}로 변경되었습니다.`);
  } catch (error) {
    console.error('로드맵 상태 변경 중 오류 발생:', error);
  }
};

export default function CustomRoadmapPage() {
  const [customRoadmapList, setCustomRoadmapList] = useState<CustomRoadmapName[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<CustomRoadmapDetail>({
    id: null,
    name: '',
    skills: [],
  });
  const [triggerAction, setTriggerAction] = useState<null | 'increase' | 'decrease'>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedSkills, setSelectedSkills] = useState<(RoadmapSkill | null)[]>([null, null]);
  const [relationBuffer, setRelationBuffer] = useState<[string, string][]>([]);
  const [selectedSkillPng, setSelectedSkillPng] = useState<string>("");
  const [skillDetailData, setSkillDetailData] = useState<SkillDetail | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<number>(0);
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);
  const [allCategorySkills, setAllCategorySkills] = useState<AllKindOfSkills[]>([]);
  
  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
  };

  const closeSidePanel = () => {
    setSidePanelOpen(false);
  };

  useEffect(() => {
    const allCategorySkills = async () => {
      try {
        const data = await fetchSkills();
        console.log('Skills:', data);
        setAllCategorySkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    allCategorySkills();
  }, []);

  // 로드맵 리스트 불러오기
  useEffect(() => {
    const loadRoadmapList = async () => {
      try {
        const roadmapList = await fetchCustomRoadmapList();
        setCustomRoadmapList(roadmapList);

        // 기본 선택 로드맵 설정
        if (roadmapList.length > 0) {
          const firstRoadmap = roadmapList[0];
          onSelectRoadmap(firstRoadmap.id);
          setSelectedState(firstRoadmap.state || 0);
        }
      } catch (error) {
        console.error('로드맵 리스트 로드 실패:', error);
      }
    };
    loadRoadmapList();
  }, []);

  // 로드맵 선택 시 호출
  const onSelectRoadmap = async (roadmapId: number) => {
    try {
      const roadmapData = await fetchRoadmapDetail(roadmapId);
      console.log(roadmapData);
      setSelectedRoadmap(roadmapData);
      const selected = customRoadmapList.find((roadmap) => roadmap.id === roadmapId);
      if (selected) {
        setSelectedState(selected.state || 0);
      }
    } catch (error) {
      console.error('로드맵 선택 실패:', error);
    }
  };

  // TODO 5: 로드맵 저장 API 호출
  const updateRoadmap = async () => {
    try {
      const roadmapUpdatePayload = {
        name: selectedRoadmap.name,
        updates: [
          // 신규 노드 연결 정보 (relationBuffer)
          ...relationBuffer.map(([parent, child]) => ({
            actionType: 'add_line',
            mapping: [parent, child],
          })),

          // 기존 노드 연결 정보 (selectedRoadmap.skills 기반)
          ...selectedRoadmap.skills.flatMap(skill => {
            const updates: ChangeRoadmapDTO[] = [];
            if (skill.tag == null) {
              if (skill.child && skill.child.length > 0) {
                skill.child.forEach(childId => {
                  const childSkill = selectedRoadmap.skills.find(s => s.id === childId);
                  if (childSkill) {
                    // 부모-자식 관계 추가
                    updates.push({
                      actionType: 'add_line',
                      mapping: [
                        skill.tag ? skill.tag : skill.id?.toString() || skill.name,
                        childSkill.tag ? childSkill.tag : childSkill.id?.toString() || childSkill.name,
                      ],
                    });
                  }
                });
              }
            }
            return updates;
          }),

          // 노드 추가 및 위치 업데이트
          ...selectedRoadmap.skills.map(skill => {
            if (skill.tag != null) {
              // 신규 노드 추가
              return {
                actionType: 'add_node',
                id: null,
                name: skill.name,
                position: skill.position,
                csId: skill.tag,
              };
            } else {
              // 기존 노드 위치 이동
              return {
                actionType: 'move_node',
                id: skill.id,
                name: skill.name,
                position: skill.position,
              };
            }
          }),
        ],
      };
      console.log("현재 relationBuffer 상태:", relationBuffer);
      console.log('처리 중인 요청 데이터:', roadmapUpdatePayload);

      // API 호출
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/roadmap/update/${selectedRoadmap.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(roadmapUpdatePayload),
      });

      if (!response.ok) {
        throw new Error('로드맵 저장 실패');
      }

      console.log('로드맵 저장 성공');
      setRelationBuffer([]);
      setIsEditMode(false);
      if (selectedRoadmap.id != null) {
        onSelectRoadmap(selectedRoadmap.id);
      }
    } catch (error) {
      console.error('로드맵 저장 중 오류 발생:', error);
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
  
  // (+) 버튼을 눌러서 로드맵을 새로 추가하려고 할때
  const handleCreateBtn = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/roadmap/add`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('로드맵 추가 실패');
      }

      const newRoadmap = await response.json();

      setCustomRoadmapList((prevList) => {
        return [...prevList, newRoadmap]; // 업데이트된 리스트 반환
      });
      onSelectRoadmap(newRoadmap.id);
    } catch (error) {
      console.error('로드맵 추가 중 오류 발생:', error);
    }
  };

  // 편집모드일때 로드맵 이름 onChange 이벤트
  const handlerRoadmapNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setSelectedRoadmap({
      ...selectedRoadmap,
      name: event.target.value
    })
  }

  // 스킬을 새로 추가하거나, 선후관계를 설정할때
  // 1) 스킬을 새로 추가
  const onSelectSkill = (skillName: string) => {
    const skill = allCategorySkills.flatMap(category => category.skills)
        .find(skill => skill.name === skillName);

    if (!skill) {
      console.error(`스킬 이름 '${skillName}'에 해당하는 ID를 찾을 수 없습니다.`);
      return;
    }

    const skillId = skill.id;

    // 중복 불가
    const isDuplicateName = selectedRoadmap.skills.some(s => s.name === skillName);
    if (isDuplicateName) {
      console.error(`이미 존재하는 스킬 이름: ${skillName}`);
      return;
    }

    const maxX = Math.max(...selectedRoadmap.skills.map(skill => skill.position[0]), 0);
    const maxY = Math.max(...selectedRoadmap.skills.map(skill => skill.position[1]), 0);
    let newPosition;

    const generateUniquePosition = () => {
      // 자연스러운 position 추가를 위해 랜덤값 활용
      const getRandomOffset = () => Math.floor(Math.random() * 2) - 1;
      let x = Math.max(0, maxX + getRandomOffset());
      let y = Math.max(0, maxY + getRandomOffset());
      newPosition = [x, y];
      
      // 겹치는 스킬 있는지 확인
      while (selectedRoadmap.skills.some(skill => skill.position[0] === x && skill.position[1] === y)) {
        x += 1;
        y += 1;
        newPosition = [x, y];
      }
    };
    generateUniquePosition();

    if(newPosition) {
      const maxId = Math.max(...selectedRoadmap.skills.map(skill => skill.id), 0);
      const newId = maxId + 1;
      const newSkill: RoadmapSkill = {
        // "저장하기" 버튼을 눌러 API콜을 하기 전까지, frontend에서 임시로 ID를 생성하여 사용
        id: newId,
        name: skillName,
        child: [],
        position: newPosition,
        tag: skillId.toString(),
      };
      console.log(newSkill);
      setSelectedRoadmap({
        ...selectedRoadmap,
        skills: [...selectedRoadmap.skills, newSkill]
      });

      setSelectedSkills(prev => {
        if (!prev[0]) {
          return [newSkill, null];
        } else if (!prev[1]) {
          const firstSkill = prev[0];
          const secondSkill = newSkill;
          const a = firstSkill
              ? (firstSkill.tag ? firstSkill.name : firstSkill.id?.toString() || '')
              : '';
          const b = secondSkill.tag ? secondSkill.name : secondSkill.id?.toString() || '';
          setRelationBuffer(prevBuffer => [...prevBuffer, [a, b]]);
          return [null, null];
        }
        return prev;
      });
    }
  };
  // 2) 노드 2개를 선택해서 선후관계가 정해질 때
  const handleUpdateSkill = (newSkill: RoadmapSkill) => {
    console.log("handleUpdateSkill updating skill:", newSkill);
    setSelectedRoadmap((roadmap: CustomRoadmapDetail) => {
      const skillExists = roadmap.skills.some(skill => skill.id === newSkill.id);
      console.log("Skill exists:", skillExists);
      if (skillExists) {
        return {
          ...roadmap,
          skills: roadmap.skills.map(skill =>
              skill.id === newSkill.id ? newSkill : skill
          ),
        };
      }
      return roadmap;
    });
  };

  const getNameById = (id: number, skills: { id: number; name: string }[]): string | null => {
    const skill = skills.find((skill) => skill.id === id);
    return skill ? skill.name : null;
  };

  const onSelectDetail = async (id: number) => {
    try {
      console.log("Fetching details for node ID:", id);
      const skillName = getNameById(id, selectedRoadmap.skills);
      if (!skillName) {
        console.error(`No skill found with id ${id}`);
        return; // skillName이 null이면 API 호출 중단
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/mastery?name=${encodeURIComponent(skillName)}`, {
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

  const handleStateChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = Number(event.target.value);
    setSelectedState(newState);

    if (selectedRoadmap.id != null) {
      await updateRoadmapState(selectedRoadmap.id, newState);
      setCustomRoadmapList((prevList) =>
          prevList.map((roadmap) =>
              roadmap.id === selectedRoadmap.id ? { ...roadmap, state: newState } : roadmap
          )
      );
    }
  };

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className='max-w-[1400px] w-full py-0 px-4 2xl:w-[1400px] xl:px-20 lg:px-10 h-[calc(100dvh-5rem)]'>
        <div className='w-full h-full flex justify-between'>
          <div className='hidden lg:flex w-[250px] h-full justify-between items-center'>
            {isEditMode ? (
              <CustomSkillList 
              skillData={allCategorySkills}
              selectedSkills={selectedRoadmap.skills}
              onSelectSkill={onSelectSkill}
              />
            ) : (
              <CustomRoadmapList 
                roadmapData={customRoadmapList}
                selectedRoadmapId={selectedRoadmap.id ? selectedRoadmap.id : null}
                onSelectRoadmap={onSelectRoadmap}
                handleCreateBtn={handleCreateBtn}
              />
            )}
          </div>
          <div className='w-full lg:w-4/5 flex flex-col pt-4 px-0 lg:px-8'>
            <div className='flex w-full h-[3rem] items-center mb-2'>
              <div 
                className='lg:hidden flex mr-2'
                onClick={toggleSidePanel}
              >
                <img src='asset/png/icon_list_open.png'/>
              </div>
              <div className='font-gmarketsansMedium text-2xl'>나의 커스텀 로드맵</div>
            </div>
            <div className='w-full flex items-center justify-between mb-2'>
              {isEditMode ? (
                <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center'>
                  <input 
                    className='w-full md:w-1/2 rounded-xl border-gray-d9 focus:outline-0 font-gmarketsansBold text-lg mb-2 md:mb-0' 
                    value={selectedRoadmap.name}
                    onChange={handlerRoadmapNameInput}
                  />
                  <div className='grid grid-cols-3 gap-4 flex justify-between'>
                    <div
                      onClick={handleDecreaseSize}
                      className="bg-primary text-white px-4 py-2 rounded-xl cursor-pointer text-sm sm:text-base"
                    >
                      {'축소(-)'}
                    </div>
                    <div
                      onClick={handleIncreaseSize}
                      className="bg-primary text-white px-4 py-2 rounded-xl cursor-pointer text-sm sm:text-base"
                    >
                      {'확대(+)'}
                    </div>
                    <div   
                      className='flex justify-center items-center px-3 py-1 rounded-xl border-2 border-primary cursor-pointer hover:bg-gray-ec text-sm sm:text-base'
                      onClick={()=>updateRoadmap()}
                    >저장</div>
                  </div>
                </div>
              ) : (
                  <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center'>
                    <div className='font-gmarketsansBold text-lg mb-2 md:mb-0'>{selectedRoadmap.name}</div>
                    <div className='flex items-center gap-4'>
                      <select
                          className='border rounded-xl px-2 py-1 w-24'
                          value={selectedState}
                          onChange={handleStateChange}
                      >
                        <option value={0}>제작중</option>
                        <option value={1}>공개중</option>
                        <option value={2}>미공개</option>
                      </select>
                      <div
                          className='px-3 py-1 rounded-xl border-2 border-primary cursor-pointer hover:bg-gray-ec'
                          onClick={() => setIsEditMode(true)}
                      >
                        수정하기
                      </div>
                    </div>
                  </div>
              )}
            </div>
            <Roadmap
                isEditMode={isEditMode}
                roadmapSkills={selectedRoadmap.skills}
                style={'h-[75dvh] max-h-[600px] mb-4'}
                onTriggerAction={triggerAction}
                onSelectDetail={onSelectDetail}
                handleUpdateSkill={handleUpdateSkill}
                onResetAction={resetAction}
            />
          </div>
        </div>
      </div>
      {isDetailVisible && (
        <SkillDetailModal
          style={'w-full sm:w-1/2 border-none'}
          skillDetail={skillDetailData as SkillDetail}
          selectedSkillPng={selectedSkillPng}
          fromPage={'customRoadmap'}
          onClose={() => setIsDetailVisible(false)}
        />
      )}
      {isSidePanelOpen && (
          <>
            <div
              className="fixed inset-0 bg-gray-45 bg-opacity-50 z-50"
              onClick={closeSidePanel}
            ></div>
            <div className="fixed top-0 left-0 flex flex-col w-4/5 sm:w-1/2 md:w-5/12 h-full bg-white shadow-lg z-[60] px-6 pt-12">
              {isEditMode ? (
                <CustomSkillList 
                skillData={allCategorySkills}
                selectedSkills={selectedRoadmap.skills}
                onSelectSkill={onSelectSkill}
                />
              ) : (
                <CustomRoadmapList 
                  roadmapData={customRoadmapList}
                  selectedRoadmapId={selectedRoadmap.id ? selectedRoadmap.id : null}
                  onSelectRoadmap={onSelectRoadmap}
                  handleCreateBtn={handleCreateBtn}
                  closeSidePanel={closeSidePanel}
                />
              )}
            </div>
          </>
        )}
    </div>
  );
}