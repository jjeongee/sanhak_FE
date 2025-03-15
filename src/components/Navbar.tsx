'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useUserContext } from '@/context/UserContext';

const NavigationBar = () =>{
    const { setLoggedInUserId  } = useUserContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/oauth/status`, { credentials: 'include' });
            const data = await response.json();
            setIsAuthenticated(data.authenticated);
            setLoggedInUserId(data.uid);
        };
        fetchAuthStatus();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setIsAuthenticated(false);
                window.location.href = '/';
            } else {
                console.error("로그아웃에 실패했습니다.");
            }
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };
    return (
        <nav className="flex h-[5rem] justify-center items-center py-5 border-b border-gray-d9">
            <div className="w-[1400px] flex justify-between items-center px-4 xl:px-20 lg:px-10">
                <Link href="/main">
                <img src="/asset/png/icon/service_full_logo.png" alt="logo" className="w-40" />
                </Link>

                <ul
                    className={`${
                        menuOpen ? "flex" : "hidden"
                    } lg:flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 xl:space-x-12 items-center absolute lg:static top-16 left-0 right-0 bg-white lg:bg-transparent z-50 shadow-lg lg:shadow-none p-5 lg:p-0`}
                >
                    <li onClick={toggleMenu}>
                        <Link href="/category" className="hover:underline text-[0.7rem] font-gmarketsansBold lg:text-sm font-gmarketsansMedium">
                        직무별로드맵
                        </Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <Link href="/lounge" className="hover:underline text-[0.7rem] font-gmarketsansBold lg:text-sm font-gmarketsansMedium">
                        커리어라운지
                        </Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <Link href={isAuthenticated ? "/card" : "/signin"} className="hover:underline text-[0.7rem] font-gmarketsansBold lg:text-sm font-gmarketsansMedium">
                        AI경험카드
                        </Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <Link href={isAuthenticated ? "/aiChatbot" : "/signin"} className="hover:underline text-[0.7rem] font-gmarketsansBold lg:text-sm font-gmarketsansMedium">
                        AI경험Chat
                        </Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <Link href={isAuthenticated ? "/customRoadmap" : "/signin"} className="hover:underline text-[0.7rem] font-gmarketsansBold lg:text-sm font-gmarketsansMedium">
                        커스텀로드맵
                        </Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <Link href={isAuthenticated ? "/mypage" : "/signin"} className="hover:underline text-[0.7rem] font-gmarketsansBold lg:text-sm font-gmarketsansMedium">
                        마이페이지
                        </Link>
                    </li>
                </ul>
                <div className="flex">
                    <div className="flex items-center border-2 border-primary text-[0.7rem] font-gmarketsansBold xl:text-sm font-gmarketsansMedium px-3 pb-1 pt-2 rounded-xl cursor-pointer hover:bg-gray-ec">
                        {isAuthenticated ? (
                            <button onClick={handleLogout}>로그아웃</button>
                        ) : (
                            <Link href="/signin">회원가입/로그인</Link>
                        )}
                    </div>
                    <button onClick={toggleMenu} className="text-gray-700 ml-6 focus:outline-none lg:hidden">
                        <img src="/asset/png/icon_side_menu.png" alt="menu" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default NavigationBar;