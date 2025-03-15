'use client';
import React, { useEffect, useState } from 'react';
import MypagePage from '../mypage/pageComponents';
import { useUserContext } from '@/context/UserContext';

export default function UserCareerPage() {
    const { loggedInUserId, mypageUserId } = useUserContext();
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('user_id');
            if (mypageUserId && mypageUserId !== Number(storedUserId)) {
                setUserId(mypageUserId);
                localStorage.setItem('user_id', String(mypageUserId));
            }
            else if (storedUserId) {
                setUserId(Number(storedUserId));
            }
            else if (loggedInUserId) {
                setUserId(loggedInUserId);
                localStorage.setItem('user_id', String(loggedInUserId));
            }
        }
    }, [mypageUserId, loggedInUserId]);

    return (
        <>
            {userId !== null ? <MypagePage user_id={userId} logged={loggedInUserId} /> : <p>Loading...</p>}
        </>
    );
}