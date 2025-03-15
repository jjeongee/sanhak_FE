import React, { useState } from "react";
import { ChatRoleOption } from "@/models/card";

type RoleDropdownProps = {
    onResetChat: () => void;
    roles: ChatRoleOption[];
    selectedRole: ChatRoleOption;
    handleSelectRole: (role: ChatRoleOption) => void;
    initializeChat: (chatId: number, chatRole: string) => void;
    fetchChatMessages: (chatId: number, chatRole: string) => void;
    selectedChatId: number | null;
};

export default function RoleDropdown({
                                         onResetChat,
                                         roles,
                                         selectedRole,
                                         handleSelectRole,
                                         initializeChat,
                                         fetchChatMessages,
                                         selectedChatId,
                                     }: RoleDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectRole = (role: ChatRoleOption) => {
        if (role.label !== selectedRole.label) {
            handleSelectRole(role);
            onResetChat();
            if (selectedChatId !== null) {
                initializeChat(selectedChatId, role.label);
                fetchChatMessages(selectedChatId,role.label);
            }
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                className="w-full flex items-center p-4 font-bold text-left"
                onClick={toggleDropdown}
            >
                {selectedRole?.label || "모델 선택"}
                <span className="ml-2"><img className='w-2' src='asset/png/icon/icon_angle_bottom.png'/></span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-[300px] xs:w-[400px] p-4 mt-2 bg-white rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.3)]">
                    <p className="text-sm text-gray-d9 mb-2">모델 선택</p>
                    {roles.map((role) => (
                        <div
                            key={role.label}
                            className="p-2 cursor-pointer"
                            onClick={() => selectRole(role)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{role.label}</span>
                                {selectedRole?.label === role.label && (
                                    <img className="w-4" src="asset/png/icon/icon_check.png" />
                                )}
                            </div>
                            <p className="text-gray-500 text-sm">{role.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}