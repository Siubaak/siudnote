import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';

function CardRotate({ children, onSendToBack, sensitivity }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: any, info: any) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export function Stack({ cardsData = [] }: any) {
  const [cards, setCards] = useState(cardsData);
  const size = 300;

  const sendToBack = (id: number) => {
    setCards((prev: any) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  return (
    <div
      className="relative"
      style={{
        height: size,
        width: size,
        perspective: 600,
      }}
    >
      {cards.map((card: any, index: number) => {
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={200}
          >
            <motion.div
              className="absolute w-full h-full rounded-lg overflow-hidden"
              onClick={() => sendToBack(card.id)}
              animate={{
                rotateZ: (cards.length - index - 1) * 4,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              style={{
                height: size,
                width: size,
              }}
            >
              {card.children}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}