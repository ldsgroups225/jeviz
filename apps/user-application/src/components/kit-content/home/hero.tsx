import { motion } from "framer-motion";

const techLogos = [
  { name: "TanStack", src: "/tanstack.png", angle: 0 },
  { name: "Cloudflare", src: "/cloudflare.png", angle: 60 },
  { name: "ShadCN", src: "/shadcn.png", angle: 120 },
  { name: "Polar", src: "/polar.png", angle: 180 },
  { name: "PNPM", src: "/pnpm.webp", angle: 240 },
  { name: "Better Auth", src: "/better-auth.png", angle: 300 },
];

function CarouselLogos() {
  // Add enough logos to fill screen width + extra for seamless loop
  const manyLogos = Array(20).fill(techLogos).flat(); // 20 sets of logos
  const logoWidth = 64; // w-16
  const gapWidth = 32; // gap-8
  const totalItemWidth = logoWidth + gapWidth;

  return (
    <div className="max-w-2xl overflow-hidden mb-8">
      <motion.div
        className="flex gap-8 p-1"
        animate={{
          x: [0, -(techLogos.length * totalItemWidth)], // Move exactly one set
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {manyLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="w-16 h-16 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-full h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <img
                src={logo.src}
                alt={logo.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen pt-20 relative overflow-hidden">
      <motion.div
        className="text-center space-y-8 px-4 z-10 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Carousel above title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CarouselLogos />
        </motion.div>

        <div className="space-y-6">
          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Let's get setup
            <motion.span
              className="block text-primary"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              to scale 🚀
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            The modern way to create beautiful, fast, and scalable applications
          </motion.p>
        </div>
      </motion.div>
    </main>
  );
}
