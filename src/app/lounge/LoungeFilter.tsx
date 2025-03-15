'use client';
import React, { useEffect, useState } from 'react';

type LoungeFilterProps = {
    selectedFilter: string;
    handleClickFilter: (filter: string) => void;
};

export default function LoungeFilter({ handleClickFilter }: LoungeFilterProps) {
    const [selectedFilter, setSelectedFilter] = useState<string>(('time'));
useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedFilter = localStorage.getItem('selectedFilter');
        if (storedFilter) {
            setSelectedFilter(storedFilter);
        }
    }
}, []);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedFilter', selectedFilter);
        }
    }, [selectedFilter]);

    const handleButtonClick = (filter: string) => {
        setSelectedFilter(filter);
        handleClickFilter(filter);
    };

    return (
        <div className="flex flex-wrap gap-4">
            <button
                className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${
                    selectedFilter === 'time' ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => handleButtonClick('time')}
            >
                <img className="w-4" src="asset/png/icon_filter_time.png" alt="최신순" />
                최신순
            </button>
            <button
                className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${
                    selectedFilter === 'click' ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => handleButtonClick('click')}
            >
                <img className="w-4" src="asset/png/icon_filter_click.png" alt="조회순" />
                조회순
            </button>
            <button
                className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${
                    selectedFilter === 'badge' ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => handleButtonClick('badge')}
            >
                <img className="w-4" src="asset/png/icon_filter_badge.png" alt="스킬뱃지 순" />
                스킬뱃지 순
            </button>
            <button
                className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${
                    selectedFilter === 'roadmap' ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => handleButtonClick('roadmap')}
            >
                <img className="w-4" src="asset/png/icon_filter_roadmap.png" alt="커스텀로드맵 순" />
                커스텀로드맵 순
            </button>
            <button
                className={`flex items-center gap-2 px-2 py-1 border rounded-xl hover:bg-gray-d9 ${
                    selectedFilter === 'card' ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => handleButtonClick('card')}
            >
                <img className="w-4" src="asset/png/icon_filter_card.png" alt="경험카드 순" />
                경험카드 순
            </button>
        </div>
    );
}