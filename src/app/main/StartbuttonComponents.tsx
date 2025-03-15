import React, { useEffect, useState } from "react";


const StartButton: React.FC = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // 클라이언트 렌더링 여부 설정
    }, []);

    const handleClick = () => {
        if (isClient) {
            console.log("Button clicked");
            window.location.href = '../signin'
        }
    };

    return (
        <button
            onClick={handleClick}
            className="bg-black text-white rounded-full px-8 py-4 text-lg font-medium shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
            start with pathfinder
        </button>
    );
};

export default StartButton;
