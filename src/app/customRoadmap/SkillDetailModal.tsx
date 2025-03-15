import React, { useState } from "react";
import { quiz, SkillDetail } from "@/models/skill";
import { ExitIcon } from "@/components/icon";
import QuizModal from "./QuizModal";
import Loading from "@/components/Loading";


type SkillDetailModalProps = {
    style?: string;
    skillDetail: SkillDetail;
    selectedSkillPng: string;
    fromPage: string;
    onClose: () => void;
};

const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
                                                                style,
                                                               skillDetail,
                                                               selectedSkillPng,
                                                               fromPage,
                                                               onClose,
                                                           }) => {
    const [quiz, setQuiz] = useState<quiz | null>(null);
    const [currentTopicId, setCurrentTopicId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchQuiz = async (ms_id: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/mypage/mastery/test/${ms_id}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            if (!response.ok) throw new Error("Failed to fetch quiz.");
            const data: quiz = await response.json();
            setQuiz(data);
            setCurrentTopicId(ms_id);
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
        setLoading(false);
    };

    const submitQuiz = async (selectedAnswer: number) => {
        if (!quiz || currentTopicId === null) return;

        if (selectedAnswer === quiz.answer) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/mypage/mastery/test/ok/${currentTopicId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                if (!response.ok) throw new Error("Failed to complete skill mastery.");

                alert("정답입니다! 스킬을 익혔습니다.");
                setQuiz(null);
                setCurrentTopicId(null);
                onClose();
            } catch (error) {
                console.error("Error submitting mastery:", error);
            }
        } else {
            alert("오답입니다. 다시 시도하세요.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-end items-center z-50">
            <div className={`bg-white p-5 ${style ? style : "w-1/3"} h-full overflow-y-auto scrollbar`}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center pl-5">
                        <img className="w-12 h-auto" src={selectedSkillPng} alt={skillDetail.name} />
                        <h2 className="text-2xl font-bold">{skillDetail.name}</h2>
                    </div>
                    <button onClick={onClose}>
                        <ExitIcon />
                    </button>
                </div>
                <p className="mb-10 px-5">{skillDetail.description}</p>
                <ul className="px-5 relative">
                    {skillDetail.list.map((topic) => (
                        <li key={topic.id} className="pb-5 relative flex items-start">
                            <div className="absolute left-0 top-0 h-full w-2 border-r border-primary"></div>
                            <div
                                className={`relative z-10 w-4 h-4 mr-3 rounded-full border ${
                                    topic.status === "completed" ? "bg-primary" : "bg-white"
                                } border-black`}
                            ></div>
                            <div>
                                <div className="flex">
                                    <div className="font-bold">{topic.title}</div>
                                    {topic.status !== "completed" && fromPage == "customRoadmap" && (
                                        <button
                                            className="w-24 h-8 text-white bg-primary rounded-xl px-5 ml-2 w-fit"
                                            onClick={() => fetchQuiz(topic.id)}
                                        >
                                            {'테스트'}
                                        </button>
                                    )}
                                </div>
                                <ul className="pl-4 mt-2">
                                    {topic.subtitle.map((sub, subIndex) => (
                                        <li key={subIndex} className="mb-2 text-sm">
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>

                {loading && (
                    <div className="flex justify-center items-center mt-10">
                        <Loading />
                    </div>
                )}

                {quiz && (
                    <QuizModal
                        quiz={quiz}
                        onSubmit={submitQuiz}
                        onClose={() => {
                            setQuiz(null);
                            setCurrentTopicId(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SkillDetailModal;
