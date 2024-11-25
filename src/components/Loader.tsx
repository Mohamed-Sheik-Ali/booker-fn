import { Images } from "../helpers/images";

interface LoaderProps {
    isOpen: boolean;
    text: string;
}

const LoaderModal = ({ isOpen, text }: LoaderProps) => {
    const { ticketLoader } = Images
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 border-red-100">
            <div className="w-[50%] h-[50%] flex flex-col items-center justify-center">
                <img src={ticketLoader} alt='loader' className="animate-pulse w-20 h-20" />
                <p className="mt-2 text-lg text-red-100">{text}</p>
            </div>
        </div>
    );
};

export default LoaderModal;
