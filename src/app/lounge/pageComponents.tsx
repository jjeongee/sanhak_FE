'use client';
import React, { useEffect, useState } from 'react';
import LoungeFilter from './LoungeFilter';
import MiniProfile from './MiniProfile';
import { useRouter } from 'next/navigation';
import { MiniProfileInfo } from '@/models/user';
import { useUserContext } from '@/context/UserContext';

const filterRecord: Record<string, number> = {
  'time': 1,
  'badge': 2,
  'roadmap': 3,
  'card': 4,
  'click': 6,
};

export default function LoungePage() {
  const router = useRouter();
  const { setMypageUserId } = useUserContext();
  const [profileData, setProfileData] = useState<MiniProfileInfo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedFilter') || 'time';
    }
    return 'time';
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedPage = localStorage.getItem('currentPage');
      return storedPage ? Number(storedPage) : 1;
    }
    return 1;
  });

  const handleClickFilter = (filter: string) => {
    setSelectedFilter(filter);
    localStorage.setItem('selectedFilter', filter);
    setCurrentPage(1);
    localStorage.setItem('currentPage', '1');
  };

  const handleProfileClick = (user_id: number) => {
    setMypageUserId(user_id);
    router.push('/userCareer');
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lounge/all/${filterRecord[selectedFilter]}/${currentPage}`,
          {
            method: 'GET',
            credentials: 'include',
          }
      );
      if (response.ok) {
        const data = await response.json();
        const formattedData: MiniProfileInfo[] = data.content.map((profile: any) => ({
          id: profile.id,
          user_id: profile.user_id,
          name: profile.name,
          category: profile.category,
          likes: profile.likes,
          view_cnt: profile.view_cnt,
          badge_cnt: profile.badge_cnt,
          roadmap_cnt: profile.roadmap_cnt,
          card_cnt: profile.card_cnt,
          imageURL: profile.imageURL,
        }));
        setProfileData(formattedData);
      } else {
        throw new Error('라운지 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        const newPage = prev - 1;
        localStorage.setItem('currentPage', newPage.toString());
        return newPage;
      });
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => {
      const newPage = prev + 1;
      localStorage.setItem('currentPage', newPage.toString());
      return newPage;
    });
  };

  useEffect(() => {
    fetchProfileData();
  }, [selectedFilter, currentPage]);

  return (
      <div className='w-full h-full flex flex-col items-center mt-5'>
        <div className='max-w-[1400px] h-full px-4 2xl:w-[1400px] xl:px-20 lg:px-10'>
          <div className='w-full flex flex-col'>
            <div className='font-bold text-2xl mb-1'>커리어라운지</div>
            <div className='font-md text-md mb-4'>다양한 커리어 경험들을 살펴보세요!</div>
            <LoungeFilter selectedFilter={selectedFilter} handleClickFilter={handleClickFilter} />
          </div>
          <div className='w-full h-full flex flex-col pt-10 mb-10'>
            <div className='w-full h-full flex justify-between'>
              <div className='w-full grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4 lg:gap-4 cursor-pointer'>
                {profileData.map((profile) => (
                    <div
                        key={profile.id}
                        className='flex justify-center items-center'
                        onClick={() => handleProfileClick(profile.user_id)}
                    >
                      <MiniProfile profile={profile} />
                    </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center mt-4'>
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className='px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50'
            >
              이전
            </button>
            <span className='px-4 py-2'>{currentPage}</span>
            <button
                onClick={handleNextPage}
                className='px-4 py-2 mx-2 bg-gray-200 rounded'
            >
              다음
            </button>
          </div>
        </div>
      </div>
  );
}