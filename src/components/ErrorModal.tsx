type ErrorModalProps = {
    message: string;
    onClose: () => void;
};

const ErrorModal = ({ message, onClose }: ErrorModalProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl text-center">
                <p className="text-gray-800 text-lg md:text-xl">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;