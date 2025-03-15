"use client";
import React, { useState, useEffect } from "react";
import HeadSectionComponents from "@/app/main/HeadSectionComponents";
import BodySectionComponents from "@/app/main/BodySectionComponents";

export default function MainPage() {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pages: number = 4;
    const [scrolling, setScrolling] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (scrolling) return;
            setScrolling(true);
            if (event.deltaY > 0 && currentPage < pages - 1) {
                setCurrentPage((prev) => prev + 1);
            } else if (event.deltaY < 0 && currentPage > 0) {
                setCurrentPage((prev) => prev - 1);
            }
            setTimeout(() => {
                setScrolling(false);
            }, 500);
        };
        window.addEventListener("wheel", handleScroll, { passive: false });
        return () => {
            window.removeEventListener("wheel", handleScroll);
        };
    }, [currentPage, scrolling]);

    useEffect(() => {
        window.scrollTo({
            top: currentPage * window.innerHeight,
            behavior: "smooth",
        });
    }, [currentPage]);

    return (
        <main>
            <HeadSectionComponents/>
            <BodySectionComponents currentPage={currentPage} />
        </main>
    );
}
