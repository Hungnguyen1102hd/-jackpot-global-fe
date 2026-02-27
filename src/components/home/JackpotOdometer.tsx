'use client';
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const BACKEND_URL =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) ||
    'http://localhost:3001';

export function JackpotOdometer() {
    const t = useTranslations('Hero');

    const { data } = useQuery({
        queryKey: ['jackpot-stats'],
        queryFn: async () => {
            const res = await fetch(`${BACKEND_URL}/api/jackpot/stats`);
            if (!res.ok) {
                throw new Error('Failed to fetch jackpot stats');
            }
            return res.json() as Promise<{ formattedBalance?: string; rawBalance?: string }>;
        },
        refetchInterval: 15000,
    });
    const value = data
        ? (data.formattedBalance && !Number.isNaN(Number.parseFloat(data.formattedBalance)))
            ? Number.parseFloat(data.formattedBalance)
            : (data.rawBalance && !Number.isNaN(Number(data.rawBalance) / 1e18))
                ? Number(data.rawBalance) / 1e18
                : 0
        : 0;

    const formatted = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-[#39FF14] bg-black shadow-[0_0_30px_rgba(57,255,20,0.2)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#39FF14]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h2 className="text-[#39FF14] text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 
                     flex items-center gap-3">
                <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full bg-[#39FF14]"
                ></motion.span>
                {t('globalSuperJackpot')}
            </h2>

            <motion.div
                animate={{ scale: [1, 1.02, 1], textShadow: ["0px 0px 15px rgba(57,255,20,0.6)", "0px 0px 30px rgba(57,255,20,0.8)", "0px 0px 15px rgba(57,255,20,0.6)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-mono font-black text-transparent bg-clip-text 
                      bg-gradient-to-b from-[#39FF14] to-[#00F0FF] tabular-nums tracking-tighter"
            >
                ${formatted}
            </motion.div>
        </div>
    );
}
