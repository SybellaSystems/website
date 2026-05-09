import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
  xl: "h-16 w-16 border-4",
};

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "spinner",
  text,
  fullScreen = false,
  className = "",
}) => {
  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return (
          <div
            className={`${sizeClasses[size]} border-indigo-500 border-t-transparent rounded-full animate-spin ${className}`}
          />
        );
      case "dots":
        return (
          <div className={`flex gap-2 ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size].split(" ")[0]} bg-indigo-500 rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div
            className={`${sizeClasses[size].split(" ")[0]} bg-indigo-500 rounded-full animate-pulse ${className}`}
          />
        );
      default:
        return null;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderLoader()}
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;

