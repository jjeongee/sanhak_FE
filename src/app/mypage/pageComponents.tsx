"use client";
import React, {useEffect, useState} from 'react';
import UserProfile from './UserProfile';
import Roadmap from '../category/Roadmap';
import Slider from 'react-slick';
import Card from '../card/Card';
import { AiCard } from '@/models/card';
import RecommendCompany from './RecommendCompany';
import {CustomRoadmapDetail} from "@/models/roadmap";
import {UpdateUserProfile, User, UserRecommendCompany, UserSkill} from '@/models/user';
import { useUserContext } from '@/context/UserContext';

type MypagePageProps = {
  user_id?: number;
  logged: number| null;
};

export default function MypagePage({
                                     user_id,
                                     logged,
                                   }: MypagePageProps) {
  const { loggedInUserId, mypageUserId  } = useUserContext();
  const [pageUserId, setPageUserId] = useState<number>();
  const [isOwnUser, setIsOwnUser] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>();
  const [badgeInfo, setBadgeInfo] = useState<UserSkill[]>([]);
  const [cardInfos, setCardInfos] = useState<AiCard[]>([]);
  const [roadmapInfos, setRoadmapInfos]=useState<CustomRoadmapDetail[]>([]);
  const [currentRoadmap, setCurrentRoadmap] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [recommendCompanyList, setRecommendCompanyList] = useState<UserRecommendCompany[]>([]);
  const roadmapSlideSettings = {
    dots: true, // 슬라이더 하단에 점 표시
    infinite: false, // 무한 반복
    speed: 500, // 슬라이딩 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 스크롤할 슬라이드 개수
    arrows: true, // 좌우 화살표 표시
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentRoadmap(newIndex); // 슬라이드 변경 시 현재 인덱스 업데이트
    },
  };

  const cardSlideSettings = {
    dots: true, // 슬라이더 하단에 점 표시
    infinite: false, // 무한 반복
    speed: 500, // 슬라이딩 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 스크롤할 슬라이드 개수
    arrows: true, // 좌우 화살표 표시
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentCard(newIndex); // 슬라이드 변경 시 현재 인덱스 업데이트
    },
  };

  useEffect(()=>{
    if(user_id) {
      setPageUserId(user_id);
      setIsOwnUser(false);
    }
    else if(loggedInUserId) {
      setPageUserId(loggedInUserId);
      setIsOwnUser(true);
    }
  },[user_id, loggedInUserId]);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/main/profile/${pageUserId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    const fetchCards = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/card/${pageUserId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        setCardInfos(data); // 카드 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    const fetchBadges = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/badge/${pageUserId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        console.log("data: ", data);
        setBadgeInfo(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    const fetchRoadmaps = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/roadmap/all/${pageUserId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch roadmaps');
        }
        const data = await response.json();
        setRoadmapInfos(data);
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      }
    };

    const fetchRecommendCompanies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/recommend/${pageUserId}`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch recommended companies');
        setRecommendCompanyList(await response.json());
      } catch (error) {
        console.error('Error fetching recommended companies:', error);
      }
    };
    if(pageUserId){
      fetchProfileInfo();
      fetchCards();
      fetchBadges();
      fetchRoadmaps();
      fetchRecommendCompanies();
    }
  }, [pageUserId]);

  const onSaveProfile = async(data: UpdateUserProfile) => {
    try {
      const formData = new FormData();
      formData.append('profile', new Blob([JSON.stringify(data.profile)], { type: 'application/json' }));
      if (data.image) {
        formData.append('image', data.image);
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/main/profile/update`, {
        method: 'POST',
        body: formData as any,
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error("프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
    } finally {
    }
  };

  useEffect(()=>{console.log(userInfo)},[userInfo])

  return (
      <div className="w-full h-full flex flex-col items-center mt-5">
        <div className='max-w-[1400px] w-full h-full px-4 2xl:w-[1400px] xl:px-20 lg:px-10'>
          <div className='w-full flex flex-col pb-5'>
            <UserProfile userInfo={userInfo} badgeInfo={badgeInfo} isOwnUser={isOwnUser} onSave={onSaveProfile} userId={logged}/>
          </div>
          <div className='w-full flex flex-col lg:flex-row justify-between mb-10 border-b border-gray-cc pb-10'>
            <div className='w-full lg:w-3/5 flex flex-col justify-start'>
              <div className='flex flex-col'>
                <div className='flex items-center text-center text-lg md:text-2xl font-gmarketsansMedium'><img className='w-4 h-4 md:w-6 md:h-6 mb-1 mr-1' src='asset/png/icon_filter_roadmap.png' alt='커스텀로드맵' />커스텀 로드맵</div>
                <div className='text-xl font-gmarketsansMedium'>{roadmapInfos[currentRoadmap]?.name || '-'}</div>
              </div>
              {roadmapInfos.length > 0 ? (
                  <Slider {...roadmapSlideSettings} className="w-full mx-auto">
                    {roadmapInfos.map((roadmap, index) => (
                        <div key={index} className="w-full h-full flex justify-center items-center p-5">
                          <Roadmap isEditMode={false} roadmapSkills={roadmap.skills} style={'h-[75dvh] max-h-[600px] mb-4'} />
                        </div>
                    ))}
                  </Slider>
              ) : (
                  <div className="w-full h-full flex justify-center items-center p-5">
                    <div className='w-full h-[75dvh] max-h-[600px] mb-4 box-border flex flex-col items-center justify-center rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.3)] font-gmarketsansMedium'>빈 커스텀 로드맵</div>
                  </div>
              )}
            </div>
            <div className='w-full lg:w-[36%] flex flex-col'>
              <div className='flex flex-col'>
                <div className='flex items-center text-center text-lg md:text-2xl font-gmarketsansMedium'><img className='w-4 h-4 md:w-6 md:h-6 mb-1 mr-1' src='asset/png/icon_filter_card.png' alt='AI경험카드' />AI경험카드</div>
                <div className='text-xl font-gmarketsansMedium'>{cardInfos[currentCard]?.title || '-'}</div>
              </div>
              {cardInfos.length > 0 ? (
                  <Slider {...cardSlideSettings} className="w-11/12 xs:w-4/5 sm:w-3/5 lg:w-5/6 mx-auto">
                    {cardInfos.map((card, index) => (
                        <div key={index} className="w-full  h-full flex justify-center items-center p-5">
                          <Card card={card} />
                        </div>
                    ))}
                  </Slider>
              ) : (
                  <div className="w-full h-full flex justify-center items-center p-5">
                    <div className='w-full h-[65dvh] xs:w-[400px] xs:h-[75dvh] max-h-[600px] flex items-center justify-center relative mb-4 font-gmarketsansMedium bg-white rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.3)]'>빈 AI경험카드</div>
                  </div>
              )}
            </div>
          </div>
          <div className='mb-8'>
            <div className='flex items-center text-center text-lg md:text-2xl font-gmarketsansMedium'><img className='w-4 h-4 md:w-6 md:h-6 mb-1 mr-1' src='asset/png/icon_company.png' alt='AI추천기업' />AI추천기업</div>
            <div className='flex text-sm md:text-lg mb-2'>
              <div className='font-gmarketsansMedium'><strong className='w-fit font-gmarketsansBold'>{userInfo?.name}</strong>님의 커리어를 바탕으로 AI가 추천하는 맞춤형기업 TOP4</div>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {recommendCompanyList.map((company, index) => (
                  <div key={index} className='flex justify-center items-center'>
                    <RecommendCompany company={company} />
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}