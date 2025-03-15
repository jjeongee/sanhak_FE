import React, { useEffect, useState } from 'react';
import SkillBadge from './SkillBadge';
import { UpdateUserProfile, User, UserSkill } from "@/models/user";
import EmailModal from "@/app/mypage/EmailModal";
import {useRouter} from "next/navigation";

type UserProfileProps = {
  userInfo?: User;
  badgeInfo?: UserSkill[];
  isOwnUser: boolean;
  onSave: (updateProfileBody: UpdateUserProfile) => void;
  userId: number| null;
};

const categoryLabels: Record<string, string> = {
  frontend: '웹/프론트엔드',
  backend: '웹/백엔드',
  data: '데이터사이언스',
  security: '보안',
  application: '어플리케이션',
  default: '예비',
};

export default function UserProfile({
                                      userInfo,
                                      badgeInfo,
                                      isOwnUser,
                                      onSave,
                                      userId,
                                    }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userInfo?.name || '');
  const [selectedCategory, setSelectedCategory] = useState(userInfo?.desirePosition || '');
  const [profileImg, setProfileImg] = useState(userInfo?.profileImgURL || '/asset/png/profile_default_img.png');
  const [profileImgBlob, setProfileImgBlob] = useState<File | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const categories = Object.values(categoryLabels);
  console.log("userId"+userId);
  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
      setProfileImgBlob(file);
    }
  };

  const saveProfile = () => {
    const categoryKey = Object.keys(categoryLabels).find((key) => categoryLabels[key] === selectedCategory);

    if (!categoryKey) {
      console.error('Invalid category selected');
      return;
    }

    const profileData: User = {
      ...userInfo!,
      name: editedName,
      profileImgURL: profileImg,
      desirePosition: categoryKey,
    };

    const updateProfileBody: UpdateUserProfile = {
      profile: profileData,
      image: profileImgBlob,
    };

    onSave(updateProfileBody);
    setIsEditing(false);
  };

  useEffect(() => {
    if (userInfo) {
      setEditedName(userInfo.name);
      setSelectedCategory(categoryLabels[userInfo.desirePosition] || '예비');
      setProfileImg(userInfo.profileImgURL === 'default' ? '/asset/png/profile_default_img.png' : userInfo.profileImgURL);
    }
  }, [userInfo]);

  const handleSendEmail = async (contents: string) => {
    try {
      const recipient = userInfo?.email || "";
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lounge/send/?recipient=${encodeURIComponent(recipient)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: contents, // 내용만 본문으로 전송
            credentials: 'include', // 세션 쿠키 포함
          }
      );
      if (response.ok) {
        alert("메일이 성공적으로 전송되었습니다."); // 성공 메시지
        setModalOpen(false); // 모달 닫기
      } else {
        alert("메일 전송에 실패했습니다."); // 실패 메시지
      }
    } catch (error) {
      alert("오류가 발생했습니다. 다시 시도해주세요."); // 에러 메시지
      console.error("Error while sending email:", error);
    }
  };

  return (
      <div className="w-full h-fit min-h-64 flex flex-col lg:flex-row justify-between border-b border-gray-cc pb-5 lg:px-8">
        <div className="w-full lg:w-[55%] flex flex-row items-center justify-between">
          <div className="w-5/6 flex items-center">
            <div className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-xl border border-gray-cc">
              {isEditing ? (
                  <label htmlFor="profileImageInput">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="profileImageInput"
                    />
                    <img
                        className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-xl cursor-pointer transition-all hover:filter hover:blur-sm"
                        src={profileImg}
                        alt="Profile"
                    />
                  </label>
              ) : (
                  <img className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-xl" src={profileImg} alt="Profile" />
              )}
            </div>
            <div className="ml-4">
              <div className="text-xl md:text-3xl font-gmarketsansBold">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedName}
                        onChange={handleNameChange}
                        className="w-36 h-8 md:w-60 md:h-10 border border-gray-cc rounded px-2 text-lg"
                    />
                ) : (
                    editedName
                )}
              </div>
              <div className="text-medium md:text-2xl font-gmarketsansMedium mt-1">
                {isEditing ? (
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="w-36 md:w-40 border border-gray-cc rounded px-2 py-1"
                    >
                      {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                      ))}
                    </select>
                ) : (
                    `${selectedCategory} 개발자`
                )}
              </div>
              <div className="text-xs md:text-medium font-gmarketsansBold mt-1">
                {userInfo?.email}
              </div>
              <div className='flex mt-2'>
                <div className='flex items-center gap-2 mr-6'>
                  <img className='w-4 h-4 md:w-6 md:h-6' src='asset/png/icon_filter_badge.png' />
                  <div>{userInfo?.badge_cnt}</div>
                </div>
                <div className='flex items-center gap-2 mr-6'>
                  <img className='w-4 h-4 md:w-6 md:h-6' src='asset/png/icon_filter_roadmap.png' />
                  <div>{userInfo?.roadmap_cnt}</div>
                </div>
                <div className='flex items-center gap-2 mr-6'>
                  <img className='w-4 h-4 md:w-6 md:h-6' src='asset/png/icon_filter_card.png' />
                  <div>{userInfo?.card_cnt}</div>
                </div>
              </div>
            </div>
          </div>
          {!userId && !isOwnUser ? (
              <div
                  className="w-1/12 h-1/12 flex justify-center items-center border-2 border-primary rounded-xl p-2 cursor-pointer"
                  onClick={() => router.push('/signin')}
              >
                <img src="/asset/png/icon_lock.png" alt="login" />
              </div>
          ) : isOwnUser ? (
              <div
                  className="w-1/12 h-1/12 flex justify-center items-center border-2 border-primary rounded-xl p-2 cursor-pointer"
                  onClick={isEditing ? saveProfile : toggleEditMode}
              >
                <img src="/asset/png/icon_modify_profile.png" alt="Modify Profile" />
              </div>
          ) : (
              <div
                  className="w-1/12 h-1/12 flex justify-center items-center border-2 border-primary rounded-xl p-2 cursor-pointer"
                  onClick={() => setModalOpen(true)}
              >
                <img src="/asset/png/icon_email.png" alt="Send Email" />
              </div>
          )}
        </div>
        <div
            className="w-full lg:w-2/5 xl:w-1/2 min-h-[100px] max-h-[256px] bg-primary rounded-xl flex flex-wrap content-start p-4 lg:ml-4 overflow-y-auto">
          {badgeInfo?.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
          ))}
        </div>
        <EmailModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSend={handleSendEmail}
        />
      </div>
  );
}