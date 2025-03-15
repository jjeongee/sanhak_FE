'use client';
import React, { useState } from 'react';
import {MiniProfileInfo} from "@/models/user";

type MiniProfileProps = {
  profile: MiniProfileInfo
};

const categoryLabels: Record<string, string> = {
  frontend: '웹/프론트엔드',
  backend: '웹/백엔드',
  data: '데이터사이언스',
  security: '보안',
  application: '어플리케이션',
  default: '예비' // null인 경우
};

export default function MiniProfile({
  profile
}: MiniProfileProps) {
  const [profileImg, setProfileImg] = useState(
      !profile.imageURL || profile.imageURL === 'default'
          ? '/asset/png/profile_default_image.png'
          : profile.imageURL
  );
  const [category, setCategory] = useState(profile.category ? categoryLabels[profile.category] : "예비");
  return (
    <div className='w-44 h-72 xs:w-56 xs:h-80 2xl:w-64 2xl:h-96 transform transition-transform duration-300 hover:scale-105'>
      <img className='w-44 h-44 xs:w-56 xs:h-56 2xl:w-64 2xl:h-64 object-cover rounded-xl border border-gray-cc' src={profileImg} />
      <div className='text-medium xs:text-lg sm:text-xl font-semibold mt-1'>{category} 개발자</div>
      <div className='text-md mt-1'>{profile.name}</div>
      <div className='flex mt-1'>
        <div className='flex gap-2 mr-4 flex items-center'>
          <img className='w-4 h-4 xs:w-6 xs:h-6' src='asset/png/icon_filter_badge.png' />
          <div>{profile.badge_cnt}</div>
        </div>
        <div className='flex gap-2 mr-4 flex items-center'>
          <img className='w-4 h-4 xs:w-6 xs:h-6' src='asset/png/icon_filter_roadmap.png' />
          <div>{profile.roadmap_cnt}</div>
        </div>
        <div className='flex gap-2 mr-4 flex items-center'>
          <img className='w-4 h-4 xs:w-6 xs:h-6' src='asset/png/icon_filter_card.png' />
          <div>{profile.card_cnt}</div>
        </div>
      </div>
    </div>
  );
}