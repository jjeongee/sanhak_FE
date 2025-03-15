"use client";

import React, {useCallback, useEffect, useRef, useState} from 'react';
import Card from '../card/Card';
import ChatRoomList from './ChatRoomList';
import ChatInterface from './ChatInterface';
import {AiCard, AiCardChat, AiCardChatRoom, ChatRoleOption} from "@/models/card";


const aiRoles: ChatRoleOption[] = [
  { label: "AI 면접관", description: "경험카드를 바탕으로 예상 면접질문 및 답변 생성", guideNotice: "어떤 예상질문을 뽑아드릴까요?" },
  { label: "AI 자소서 도우미", description: "경험카드를 기반으로 자기소개서 문항 생성", guideNotice: "어떤 자기소개서 문항을 작성해드릴까요?" },
  { label: "AI 포지션 질문", description: "포지션을 바탕으로 해당 직무와 언어에 대한 설명 생성", guideNotice: "해당 직무와 언어에 대해 어떤 점이 궁금한가요?" },
];

const AiChatbotPage: React.FC = () => {
  const [cardList, setCardList] = useState<AiCard[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<AiCardChatRoom | null>(null); // 선택된 채팅방 상태
  const [chatRoomData, setChatRoomData] = useState<AiCardChatRoom[]>([]);
  const [chatData, setChatData] = useState<AiCardChat[]>([]);
  const [selectedCard, setSelectedCard] = useState<AiCard | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [roles, setRoles] = useState<ChatRoleOption[]>(aiRoles); // 역할 리스트 설정
  const [selectedRole, setSelectedRole] = useState<ChatRoleOption>(roles[0]); // 선택된 역할 상태 추가
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);
  const [isSideListOpen, setSideListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
  };

  const closeSidePanel = () => {
    setSideListOpen(false);
    setSidePanelOpen(false);
  };

  const fetchChatList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/list`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setChatRoomData(data); // 채팅방 데이터 설정
      } else {
        throw new Error('채팅방 목록을 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  const initializeChat = async (chatId: number, chatRole: string) => {
    const chatType = getChatType(chatRole); // 역할에 따른 chatType 계산
    const updatedChatId = chatId + chatType; // chatId에 chatType을 더함

    console.log("Initializing chat:", { chatId, chatRole, chatType, updatedChatId });

    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/initialize/${updatedChatId}/${chatType}`,
          {
            method: 'GET',
            credentials: 'include',
          }
      );

      if (response.ok) {
        console.log("채팅이 성공적으로 초기화되었습니다.");
      } else {
        console.error("채팅 초기화 실패");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
    }
  };

  const fetchCardList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/card/`, {
        method: 'GET',
        credentials: 'include', // 세션 인증을 위해 필요할 경우 추가
      });

      if (response.ok) {
        const data = await response.json();
        setCardList(data); // cardList 상태를 API 응답 데이터로 설정
      } else {
        console.error('카드 목록을 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('카드 목록 불러오기 오류:', error);
    }
  };
  const fetchChatMessages = async (chatId: number, chatRole: string) => {
    const chatType = getChatType(chatRole); // 역할에 따른 chatType 계산
    const updatedChatId = chatId + chatType; // chatId에 chatType을 더함

    console.log("Fetching chat messages for updated chat ID:", { chatId, chatRole, chatType, updatedChatId });

    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/message/${updatedChatId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedData: AiCardChat[] = data.map((message: any) => ({
          id: message.cmid,
          isUser: message.cmisUser,
          content: message.cmcontent,
        }));
        setChatData(formattedData);
      } else {
        console.error("채팅 메시지 불러오기 실패");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
    }
  };

  const getChatType = (chatRole: string): number => {
    if (chatRole === "AI 포지션 질문") return 2;
    if (chatRole === "AI 자소서 도우미") return 1;
    return 0;
  };

  useEffect(() => {
    fetchChatList(); // 컴포넌트 마운트 시 채팅방 목록 가져오기
    fetchCardList();
  }, []);

  const handleSelect = (cardId : number) => {
    const selected = cardList.find((card) => card.id === cardId);
    if (selected) {
      setSelectedCard(selected);
      const selectedChatRoom = chatRoomData.find((room) => room.cardId === cardId);
      if (selectedChatRoom) {
        setSelectedChatRoom(selectedChatRoom);
        const role = roles.find((role) => role.label === selectedChatRoom.role);
        setSelectedRole(role || roles[0]);
      }
    }
  };

  const handleSelectRole = (role:ChatRoleOption) => {
    console.log("선택한 role:", role);
    setSelectedRole(role);
    if (selectedChatRoom) {
      initializeChat(selectedChatRoom.id, role.label);
      fetchChatMessages(selectedChatRoom.id, role.label);
    }
  };
  const handleChatInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(event.target.value);
  };

  useEffect(() => {
    fetchChatList();
    fetchCardList();
  }, []);

  useEffect(() => {
    if (selectedChatRoom && selectedRole) {
      initializeChat(selectedChatRoom.id, selectedRole.label);
      fetchChatMessages(selectedChatRoom.id, selectedRole.label);
    }
  }, [selectedChatRoom, selectedRole]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || !selectedChatRoom) return;
    setIsLoading(true);
    console.log("Sending chat with selectedRole:", selectedRole); // 디버깅 로그 추가
    const userMessage: AiCardChat = { id: chatData.length + 1, isUser: 1, content: chatInput };
    setChatData((prev) => [...prev, userMessage]);
    setChatInput("");
    const chatId=selectedChatRoom.id;
    const chatRole=selectedRole.label;
    console.log(chatRole);
    const chatType = getChatType(chatRole); // 역할에 따른 chatType 계산
    const updatedChatId = chatId + chatType;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${updatedChatId}/send/${chatType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: chatInput }),
      });
      if (response.ok) {
        const responseData = await response.json();
        const aiMessage: AiCardChat = { id: chatData.length + 2, isUser: 0, content: responseData.response };
        setChatData((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("채팅 전송 실패");
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendChat();
    }
  };

  const handleSideList = () => {
    setSideListOpen(!isSideListOpen);
  }

  useEffect(() => {
    if (chatEndRef.current) {
      if ("scrollIntoView" in chatEndRef.current) {
        chatEndRef.current.scrollIntoView({behavior: 'smooth'});
      }
    }
  }, [chatData]);

  return (
      <div className="w-full h-full flex flex-col items-center">
        <div className='max-w-[1400px] w-full py-0 px-4 2xl:w-[1400px] xl:px-20 lg:px-10 h-[calc(100dvh-5rem)]'>
          <div className='w-full h-full flex'>
            <div className='w-full h-full flex justify-between items-center'>
              <div className='hidden lg:flex w-[250px] h-full justify-between items-center'>
                <ChatRoomList
                  chatRoomMockData={chatRoomData}
                  selectedCardId={selectedCard ? selectedCard.id : 0}
                  onSelectCard={handleSelect}
                />
              </div>
              <div className="lg:hidden fixed top-20 right-0 z-40">
                <button
                  className="w-28 px-3 py-2 text-xs rounded-l-lg bg-primary text-white shadow-lg"
                  onClick={toggleSidePanel}
                >
                  {isSidePanelOpen ? '닫기' : '현재 AI경험카드'}
                </button>
              </div>
              <ChatInterface
                  roles={roles}
                  chatData={chatData}
                  chatInput={chatInput}
                  isLoading={isLoading}
                  selectedCardTitle={selectedCard?.title || ""}
                  onSendChat={handleSendChat}
                  onInputChange={handleChatInputChange}
                  onKeyDown={handleKeyDown}
                  onResetChat={() => setChatData([])}
                  selectedChatId={selectedChatRoom?.id || 0}
                  selectedRole={selectedRole}
                  handleSelectRole={handleSelectRole}
                  initializeChat={initializeChat}
                  fetchChatMessages={fetchChatMessages}
                  handleSideList={handleSideList}
              />
            </div>
            <div className='hidden lg:flex w-1/3 h-full flex-col pl-4 border-l border-gray-d9'>
              <div className='font-semibold py-4'>현재 선택한 경험카드</div>
              {selectedCard && <Card card={selectedCard} />}
            </div>
          </div>
        </div>
        {isSideListOpen && (
          <>
            <div
              className="fixed inset-0 bg-gray-45 bg-opacity-50 z-50"
              onClick={closeSidePanel}
            ></div>
            <div className="fixed top-0 left-0 flex flex-col w-4/5 sm:w-1/2 md:w-5/12 h-full bg-white shadow-lg z-[60] px-6 pt-12">
              <ChatRoomList
                chatRoomMockData={chatRoomData}
                selectedCardId={selectedCard ? selectedCard.id : 0}
                onSelectCard={handleSelect}
                closeSidePanel={closeSidePanel}
              />
            </div>
          </>
        )}
        {isSidePanelOpen && (
          <>
            <div
              className="fixed inset-0 bg-gray-45 bg-opacity-50 z-50"
              onClick={closeSidePanel}
            ></div>
            <div className="fixed top-0 right-0 w-4/5 sm:w-1/2 md:w-5/12 h-full bg-white shadow-lg z-[60] px-6 pt-12">
              <div className='font-bold text-base sm:text-lg mb-3 sm:mb-6'>현재 선택한 AI경험카드</div>
              {selectedCard && <Card card={selectedCard} />}
              <div className='w-full flex justify-end mt-4 '>
                <button
                  className="w-28 p-3 text-xs rounded-lg bg-primary text-white shadow-lg"
                  onClick={closeSidePanel}
                >
                  {isSidePanelOpen ? '닫기' : '카드 보기'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
  );
};

export default AiChatbotPage;