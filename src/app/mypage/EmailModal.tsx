import React, { useState } from 'react';

type EmailModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSend: (contents: string) => void;
};

const EmailModal = ({ isOpen, onClose, onSend }: EmailModalProps) => {
    const [contents, setContents] = useState('');

    if (!isOpen) return null;

    const handleSend = () => {
        if (contents.trim()) {
            onSend(contents);
            setContents("");
        } else {
            alert("내용은 필수입니다.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-md w-11/12 max-w-md md:max-w-lg lg:max-w-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Send Email</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl font-bold">&times;</span>
                    </button>
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        rows={5}
                        placeholder="Enter your message here..."
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailModal;