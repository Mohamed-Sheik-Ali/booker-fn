import React from "react";

interface ButtonLoaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    loaderSize?: number;
    loaderColor?: string;
    children: React.ReactNode;
}

const ButtonLoader: React.FC<ButtonLoaderProps> = ({
    isLoading,
    loaderSize = 16,
    loaderColor = "white",
    children,
    disabled,
    ...rest
}) => {
    return (
        <button
            {...rest}
            disabled={isLoading || disabled}
            className={`relative flex items-center justify-center px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
            {isLoading && (
                <div
                    className="absolute"
                    style={{
                        width: loaderSize,
                        height: loaderSize,
                        border: `2px solid ${loaderColor}`,
                        borderRadius: "50%",
                        borderTopColor: "transparent",
                        animation: "spin 1s linear infinite",
                    }}
                ></div>
            )}
            <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>{children}</span>
            <style>
                {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
            </style>
        </button>
    );
};

export default ButtonLoader;
