import { useState } from "react";

const LiquidText = () => {
  const [activeIndices, setActiveIndices] = useState(new Set());
  const text = "Hover Me!";

  const handleMouseEnter = (index: number) => {
    setActiveIndices((prev) => new Set([...prev, index]));

    // Reset after animation
    setTimeout(() => {
      setActiveIndices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 1000);
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="flex space-x-1 text-6xl font-bold">
        {text.split("").map((char, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onMouseEnter={() => handleMouseEnter(index)}
          >
            {/* Original character */}
            <span
              className={`transition-all duration-300 inline-block
                ${
                  activeIndices.has(index)
                    ? "opacity-0 scale-150"
                    : "opacity-100 scale-100"
                }
              `}
            >
              {char}
            </span>

            {/* Liquid drop effect */}
            {activeIndices.has(index) && (
              <>
                {/* Main drop */}
                <span
                  className="absolute top-0 left-0 text-blue-500 animate-bounce"
                  style={{
                    animation:
                      "drop 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
                  }}
                >
                  {char}
                </span>

                {/* Small splash particles */}
                <span className="absolute top-full left-1/2 w-2 h-2 bg-blue-300 rounded-full animate-ping" />
                <span className="absolute top-full left-1/4 w-1 h-1 bg-blue-200 rounded-full animate-ping delay-75" />
                <span className="absolute top-full right-1/4 w-1 h-1 bg-blue-200 rounded-full animate-ping delay-150" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Custom animation keyframes */}
      <style>{`
        @keyframes drop {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(50px) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LiquidText;
