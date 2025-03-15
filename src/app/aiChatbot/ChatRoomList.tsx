"use client";
import React from 'react';
import {AiCardChatRoom} from "@/models/card";

type ChatRoomListProps = {
  chatRoomMockData: AiCardChatRoom[];
  selectedCardId: number | undefined;
  onSelectCard?: (cardId: number, chatType: String) => void;
  closeSidePanel?: () => void;
};

export default function ChatRoomList({
  chatRoomMockData,
  selectedCardId,
  onSelectCard,
  closeSidePanel
}: ChatRoomListProps) {

  const handleSelecteCard = (cardId: number, chatType:string) =>{
    if(onSelectCard && closeSidePanel){ // 모바일화면에선 사이드창을 닫을 수 있도록 closeSidePanel 추가
      onSelectCard(cardId,chatType);
      closeSidePanel();
    } 
    else if(onSelectCard) {             // 기본 PC 화면
      onSelectCard(cardId,chatType);
    }
  }
  return (
    <div className="w-full h-full text-sm py-4 bg-gray-f8">
      <div className='flex justify-between w-full mb-2 px-4 font-semibold'>
        <div className="">경험카드 목록</div>
        <div
          className='flex lg:hidden' 
          onClick={closeSidePanel}
        ><img src='asset/png/icon_list_close.png'/></div>
      </div>
      {chatRoomMockData.map((card) => (
        <div
          key={card.id}
          className={`${
            card.cardId === selectedCardId && "bg-white rounded-lg border-2 border-gray-99"
          } w-11/12 h-7 bg-white border border-gray-d9 rounded-lg line-clamp-1 mb-2 mx-2 py-1 px-2 cursor-pointer`}
          onClick={() => handleSelecteCard(card.cardId, "AI 면접관")}
        >
          {card.title?.length && card.title?.length > 15
            ? card.title?.substring(0, 15) + "..."
            : card.title}
        </div>
      ))}
    </div>
  );
};
