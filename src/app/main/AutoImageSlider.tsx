"use client";

import React, { useEffect, useRef } from "react";

const AutoImageSlider = () => {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const images = [
        '/asset/png/mainpage/timelineroadmap_frontend.png',
        '/asset/png/mainpage/timelineroadmap_backend.png',
        '/asset/png/mainpage/timelineroadmap_datascience.png',
        '/asset/png/mainpage/timelineroadmap_security.png',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderRef.current) {
                const { scrollWidth, clientWidth, scrollLeft } = sliderRef.current;

                if (Math.abs(scrollLeft + clientWidth - scrollWidth) < 1) {
                    if ("scrollTo" in sliderRef.current) {
                        sliderRef.current.scrollTo({left: 0, behavior: "smooth"});
                    }
                } else {
                    if ("scrollBy" in sliderRef.current) {
                        sliderRef.current.scrollBy({left: clientWidth, behavior: "smooth"});
                    }
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex overflow-x-auto w-full space-x-4 scrollbar-hide" ref={sliderRef}>
            {images.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`slide-${index}`}
                    className="w-auto h-1/2 object-cover flex-shrink-0 sm:w-full"
                />
            ))}
        </div>
    );
};

export default AutoImageSlider;