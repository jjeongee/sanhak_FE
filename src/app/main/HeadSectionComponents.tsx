"use client";
import '../../app/globals.css';
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const StartButton = dynamic(() => import("./StartbuttonComponents"), { ssr: false });

interface AutoTextSliderProps {
    texts: string[];
}

const AutoTextSlider: React.FC<AutoTextSliderProps> = ({ texts }) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const interval = setInterval(() => {
            if (sliderRef.current) {
                const { scrollHeight, clientHeight, scrollTop } = sliderRef.current;

                if (scrollTop + clientHeight >= scrollHeight) {
                    sliderRef.current.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    sliderRef.current.scrollBy({
                        top: clientHeight,
                        behavior: "smooth",
                    });
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={sliderRef}
            className="overflow-hidden h-20"
            style={{ height: "5rem" }}
        >
            <div className="flex flex-col">
                {texts.map((text, index) => (
                    <div key={index} className="flex items-center justify-center h-20 font-gmarketsansBold">
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function HeadSectionComponents() {
    const texts = ["FRONTEND", "BACKEND", "DATA", "SECURITY", "APPLICATION"];

    return (
        <div
            className="relative w-full h-screen bg-cover bg-center"
            style={{backgroundImage: "url(/asset/png/mainpage/web-main.png)"}}
        >
            <div
                className="relative w-full h-screen bg-cover bg-center block sm:hidden"
                style={{backgroundImage: "url(/asset/png/mainpage/mobile-main.png)"}}
            ></div>
            <div
                className="absolute sm:top-1/2 sm:left-[35%] sm:text-6xl transform -translate-x-1/2 -translate-y-1/2 text-white text-center top-[30%] left-[50%] text-4xl">
                <AutoTextSlider texts={texts}/>
            </div>
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 py-4 px-8 bg-blue-500 text-white rounded">
                <StartButton/>
            </div>
        </div>
    )
        ;
}