import { motion } from 'framer-motion';

export const Main = () => {
  return (
    <motion.div
      transition={{ delay: 2, duration: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* <div className="text-center relative w-full flex items-center justify-center h-24"> */}
      {/* <div className="flex items-center absolute top-1/2 -translate-y-1/2 w-full -z-10">
          {new Array(7).fill(null).map((_, i) => (
            <img
              key={i}
              src={`/player${i}.gif`}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 2xl:w-auto 2xl:h-20 mx-auto rounded-xl"
              style={{
                transform: `translateY(${i % 2 === 0 ? -100 : 100}px)`,
              }}
            />
          ))}
        </div> */}

      {/* <AnimatePresence>
          <motion.h1
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="absolute w-fit text-3xl sm:text-5xl md:text-6xl 2xl:text-8xl"
          >
            {text}
          </motion.h1>
        </AnimatePresence> */}
      {/* </div> */}

      {/* <motion.div
        transition={{ delay: 2, duration: 0.75 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-48 w-full flex flex-col items-center justify-center"
      >
        <p className="text-2xl text-center mb-4">Players are ready, Coach.</p>
      </motion.div> */}
    </motion.div>
  );
};
