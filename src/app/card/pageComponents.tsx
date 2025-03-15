"use client";
import React, {useState} from 'react';
import CardRetrieve from './CardRetrieve';
import CardEditor from './CardEditor';
import {AiCard} from "@/models/card";
import Loading from '@/components/Loading';
import ErrorModal from "@/components/ErrorModal";

export default function CardPage() {
  const [isCreatePage, setIsCreatePage] = useState<Boolean>(false);
  const [selectedCard, setSelectedCard] = useState<AiCard | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false); // 로딩
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSelectCard = (card: AiCard | null) => {
    console.log("onSelectCard: ", card);
    setIsCreatePage(true);
    setSelectedCard(card);
  }

  const onCancel = () => {
    console.log("카드 취소");
    setIsCreatePage(false);
  }

  const onCreate = async (card: AiCard) => {
    console.log("카드 생성: ", card);
    const formData = new FormData();
    formData.append("cardInfo", new Blob([JSON.stringify(card)], { type: "application/json" }));
    if (card?.imageFile) {
      formData.append("image", card?.imageFile);
    }
    if (card?.pdfFile) {
      formData.append("pdfFile", card?.pdfFile);
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/card/create`, {
        method: "POST",
        body: formData as any,
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setIsCreatePage(false);
        }
      } else if (response.status === 500) {
        setErrorModalMessage(
            "현재 사용자가 제공해주신 파일의 경우는 이미지의 갯수가 너무 많습니다! 이미지 갯수가 적은 파일을 업로드 하거나 유료 모델을 구독해주세요."
        );
        setIsModalOpen(true);
      } else {
        console.error("카드 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setErrorModalMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    } finally {
      setIsCreatePage(false);
      setIsLoading(false);
    }
  }

  const onModify = async (card: AiCard) => {
    console.log("카드 수정: ", card);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("cardInfo", new Blob([JSON.stringify(card)], {type: "application/json"}))
    if (card?.imageFile) {
      formData.append("image", card?.imageFile);
    }
    if (card?.pdfFile) {
      formData.append("pdfFile", card?.pdfFile);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/card/update/${card?.id}`, {
        method: 'POST',
        body: formData as any,
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setIsCreatePage(false);
        }
      }else if (response.status === 500) {
        setErrorModalMessage(
            "현재 사용자가 제공해주신 파일의 경우는 이미지의 갯수가 너무 많습니다! 이미지 갯수가 적은 파일을 업로드 하거나 유료 모델을 구독해주세요."
        );
        setIsModalOpen(true);
      } else {
        console.error("카드 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
    } finally {
      setIsCreatePage(false);
      setIsLoading(false);
    }
  }
  if (isLoading) {
    return <Loading/>;
  }

  return (
      <div className="w-full h-full flex flex-col items-center mt-5 relative">
        {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p className="text-lg font-semibold">Loading...</p>
              </div>
            </div>
        )}
        {isModalOpen && errorModalMessage && (
            <ErrorModal
                message={errorModalMessage}
                onClose={() => setIsModalOpen(false)}
            />
        )}
        <div className="max-w-[1400px] w-full h-full px-4 2xl:w-[1400px] xl:px-20 lg:px-10">
          {isCreatePage ? (
              <CardEditor selectedCard={selectedCard} onCancel={onCancel} onCreate={onCreate} onModify={onModify}/>
          ) : (
              <CardRetrieve onChangePage={onSelectCard}/>
          )}
        </div>
      </div>
  );
}