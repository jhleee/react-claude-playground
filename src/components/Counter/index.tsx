import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleDecrease = () => {
    setCount(count - 1);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex gap-2">
        <button
          className="w-8 h-8 rounded-md bg-blue-300 border-gray-900"
          onClick={handleIncrease}
        >
          +
        </button>
        <div>{count}</div>
        <button
          className="w-8 h-8 rounded-md bg-blue-300 border-gray-900"
          onClick={handleDecrease}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Counter;
