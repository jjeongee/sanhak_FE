'use client';

import React, {useEffect, useState} from 'react';
import Card from './Card';
import Slider from 'react-slick';
import {AiCard, AiCardWithNew} from "@/models/card";

type CardRetrieveProps = {
  onChangePage?: (card: AiCardWithNew | null) => void;
};

// 카드를 관리하는 컴포넌트
export default function CardRetrieve({ onChangePage }: CardRetrieveProps) {
  const [cardInfos, setCardInfos] = useState<AiCard[]>([]);

  const cardSlideSettings = {
    dots: true, // 슬라이더 하단에 점 표시
    infinite: false, // 무한 반복
    speed: 500, // 슬라이딩 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 스크롤할 슬라이드 개수
    arrows: true, // 좌우 화살표 표시
  };

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    const fetchCards = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/card/`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        console.log("data: ", data);
        setCardInfos(data); // 카드 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  const handleCardClick = (card: AiCardWithNew | null) => {
    if (onChangePage) {
      onChangePage(card);
    }
  };

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='w-full flex flex-col mb-4 ml-14 xs:ml-20 sm:ml-0'>
        <div className='w-full text-2xl font-bold mb-1'>AI경험카드 관리</div>
        <div className='font-md text-md'>프로젝트를 카드에 담아 관리해보세요!</div>
      </div>
      <div className="hidden sm:grid w-full h-full justify-center items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardInfos.map((card, index) => (
          <div
            className="flex justify-center cursor-pointer"
            key={index}
            onClick={() => handleCardClick(card)}
          >
            <Card card={card} />
          </div>
        ))}
        <div
          className="w-full h-[75dvh] max-h-[600px] cursor-pointer flex justify-center items-center mb-4 rounded-xl border-2 border-dashed border-gray-d9"
          onClick={() => handleCardClick(null)}
        >
          <div className="text-3xl font-bold text-gray-d9">+</div>
        </div>
      </div>
      <div className="sm:hidden w-full h-full flex items-center justify-center">
        <Slider {...cardSlideSettings} className="w-11/12 mx-2">
          {cardInfos.map((card, index) => (
            <div
              key={index}
              className="w-full h-full flex justify-center items-center px-4"
              onClick={() => handleCardClick(card)}
            >
              <Card card={card} />
            </div>
          ))}
          <div
            className="w-full h-[75dvh] max-h-[600px] cursor-pointer flex justify-center items-center mb-4 px-4"
            onClick={() => handleCardClick(null)}
          >
            <div className="w-full h-full flex justify-center items-center rounded-xl border-2 border-dashed border-gray-d9 text-3xl font-bold text-gray-d9">+</div>
          </div>
        </Slider>
      </div>
    </div>
  );
}
