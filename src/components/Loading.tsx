import React, { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";


const Loading: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/card/`);
                setData(response.ok);
                console.log("데이터 로딩 성공");
            } catch (error) {
                console.error("데이터를 가져오는데 실패했습니다", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="contentWrap">
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%,",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <BeatLoader color="#000000" margin={2} />
                </div>
            </div>
        );
    }

    return (
        <div className="contentWrap">
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <BeatLoader color="#000000" />
                <p>로딩중...</p>
            </div>
        </div>
    );
};

export default Loading;