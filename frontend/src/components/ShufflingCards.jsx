import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ShufflingCards = () => {
  const [positions, setPositions] = useState([
    { id: 0, x: 0, y: 0 },
    { id: 1, x: 150, y: 0 },
    { id: 2, x: 0, y: 150 },
    { id: 3, x: 150, y: 150 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => {
        // Rotate positions clockwise
        return [
          { ...prev[3], x: 0, y: 0 }, // 3 moves to 0
          { ...prev[0], x: 150, y: 0 }, // 0 moves to 1
          { ...prev[1], x: 150, y: 150 }, // 1 moves to 3
          { ...prev[2], x: 0, y: 150 } // 2 moves to 2
        ];
      });
    }, 2000); // Change position every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[300px] w-[300px]">
      {positions.map(card =>
        <motion.div
          key={card.id}
          animate={{ x: card.x, y: card.y }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute bg-black bg-opacity-40 h-[100px] w-[100px] rounded-lg p-4 flex flex-col items-center justify-center text-center"
        >
          <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.5 12.5L12 15.5l3.5-3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold mt-2">
            Card {card.id + 1}
          </h3>
        </motion.div>
      )}
    </div>
  );
};

export default ShufflingCards;
