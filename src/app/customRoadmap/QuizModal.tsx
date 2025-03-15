import React from "react";
import {ExitIcon} from "@/components/icon";

type QuizModalProps = {
    quiz: {
        question: string;
        options: string[];
        answer: number;
    };
    onSubmit: (selectedAnswer: number) => void;
    onClose: () => void;
};

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onSubmit, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-5 w-1/3 rounded shadow-lg">
                <h3 className="text-lg font-bold mb-3">{quiz.question}</h3>
                <ul>
                    {quiz.options.map((option, idx) => (
                        <li key={idx}>
                            <button
                                className="block p-2 mb-2 bg-primary text-white rounded w-full"
                                onClick={() => onSubmit(idx + 1)}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    className="mt-3 px-4 py-2 bg-gray-500 text-white rounded w-full flex justify-center"
                    onClick={onClose}
                >
                    <ExitIcon/>
                </button>
            </div>
        </div>
    );
};

export default QuizModal;