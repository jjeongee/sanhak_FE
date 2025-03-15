'use client';
import React, { useEffect } from 'react';

type MyPageFilterProps = {
  selectedFilter: string;
  handleClickFilter: (filter: string) => void
};

export default function MyPageFilter({
  selectedFilter,
  handleClickFilter
}: MyPageFilterProps) {
    useEffect(()=>{console.log(selectedFilter)},[selectedFilter]);
  return (
    <div className='flex gap-4 mb-5'>
      <button
        className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${selectedFilter === "roadmap" ? "bg-primary text-white" : "bg-white"}`}
        onClick={()=>handleClickFilter('roadmap')}
      >
        <img className='w-4' src='asset/png/icon_filter_roadmap.png' alt='커스텀로드맵' />
        커스텀 로드맵
      </button>
      <button
        className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${selectedFilter === "card" ? "bg-primary text-white" : "bg-white"}`}
        onClick={()=>handleClickFilter('card')}
      >
        <img className='w-4' src='asset/png/icon_filter_card.png' alt='경험카드' />
        경험 카드
      </button>
      <button
        className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${selectedFilter === "company" ? "bg-primary text-white" : "bg-white"}`}
        onClick={()=>handleClickFilter('company')}
      >
        <img className='w-4' src='asset/png/icon_filter_card.png' alt='AI추천기업' />
        AI 추천 기업
      </button>
    </div>
  );
}