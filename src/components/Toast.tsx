import React, { useState, useEffect } from "react";
import "./toast.css";

interface ToastProps {
    message: string;
    type?: "info" | "success" | "warning" | "error";
    duration?: number;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = "info",
    duration = 3000,
    onClose,
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast ${type} ${visible ? "visible" : "hidden"}`}>
            {message}
        </div>
    );
};

export default Toast;
