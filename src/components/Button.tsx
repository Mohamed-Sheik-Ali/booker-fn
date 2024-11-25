interface ButtonProps {
  text: string;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  style: string;
  isLoading?: boolean;
  loaderSize?: number;
  loaderColor?: string;
  key?: string | number;
}

const Button = ({
  text,
  type,
  onClick,
  style,
  isLoading = false,
  loaderSize = 16,
  loaderColor = "white",
  key,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${style} relative flex items-center justify-center`}
      onClick={onClick}
      disabled={isLoading}
      key={key}
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
      <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>{text}</span>
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

export default Button;
