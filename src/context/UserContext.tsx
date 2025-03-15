'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Context 초기값 설정
const UserContext = createContext<{
  loggedInUserId: number | null;
  setLoggedInUserId: (id: number) => void;
  mypageUserId: number | null;
  setMypageUserId: (id: number) => void;
} | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // 로그인한 사용자 ID
  const [mypageUserId, setMypageUserId] = useState<number | null>(null); // mypage에서 사용하는 사용자 ID

  return (
    <UserContext.Provider value={{ loggedInUserId, setLoggedInUserId, mypageUserId, setMypageUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
