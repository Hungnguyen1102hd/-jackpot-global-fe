'use client';

import { JackpotOdometer } from "@/components/home/JackpotOdometer";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { WinnerTicker } from "@/components/home/WinnerTicker";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

export default function Home() {
  const t = useTranslations('Hero');

  return (
    <div className="flex flex-col items-center w-full relative overflow-hidden">
      {/* Deep Cyberpunk Background Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
          hidden: {}
        }}
        className="w-full flex-grow flex flex-col items-center justify-center py-20 gap-16"
      >
        {/* Main Odometer */}
        <motion.div variants={fadeUpVariant} className="w-full max-w-6xl px-4">
          <JackpotOdometer />
        </motion.div>

        {/* Countdown */}
        <motion.div variants={fadeUpVariant} className="w-full max-w-4xl px-4">
          <CountdownTimer />
        </motion.div>

        {/* Call To Action */}
        <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-6 mt-4 relative z-10 px-4">
          <Link href="/buy-ticket" className="px-10 py-5 bg-[#39FF14] text-black font-black uppercase tracking-widest text-sm
                             hover:bg-white hover:drop-shadow-[0_0_20px_#39FF14] hover:-translate-y-1
                             transition-all duration-300 transform-gpu text-center"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)"
            }}>
            {t('buyTicketNow')}
          </Link>
          <Link href="/docs" className="px-10 py-5 bg-transparent text-white border-2 border-white/20 font-bold uppercase tracking-widest text-sm
                             hover:border-[#00F0FF] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]
                             transition-all duration-300 text-center"
            style={{
              clipPath: "polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)"
            }}>
            {t('systemStatus')}
          </Link>
        </motion.div>

      </motion.section>

      {/* Live Ticker Anchored at Bottom of Hero */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-full mb-10"
      >
        <WinnerTicker />
      </motion.div>

    </div>
  );
}
