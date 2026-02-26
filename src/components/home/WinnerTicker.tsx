'use client';

import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const BACKEND_URL =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) ||
    'http://localhost:3001';

type WinnerTickerItem = {
    walletAddress: string;
    maskedWalletAddress: string;
    drawId: number | null;
    prizeAmount: string;
    updatedAt: string;
};

export function WinnerTicker() {
    const t = useTranslations('WinnerTicker');

    const { data } = useQuery({
        queryKey: ['recent-winners'],
        queryFn: async () => {
            const res = await fetch(`${BACKEND_URL}/api/draws/recent-winners?limit=20`);
            if (!res.ok) {
                throw new Error('Failed to fetch recent winners');
            }
            return res.json() as Promise<WinnerTickerItem[]>;
        },
        refetchInterval: 15000,
    });

    const winners = (data && data.length > 0
        ? data.map((w) => ({
            address: w.maskedWalletAddress,
            amount: `${w.prizeAmount} JPK`,
            game: `${t('draw')} #${w.drawId ?? '-'}`,
        }))
        : [
            {
                address: "0x000...0000",
                amount: "0 JPK",
                game: t('noWinnersYet'),
            },
        ]);

    return (
        <div className="w-full overflow-hidden bg-black border-y-2 border-[#FF003C] shadow-[0_0_20px_rgba(255,0,60,0.2)] py-4 relative flex items-center">
            {/* Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

            <motion.div
                className="flex whitespace-nowrap items-center hover:cursor-pointer"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 30,
                }}
                whileHover={{ animationPlayState: "paused" }}
                style={{ width: "200%" }}
            >
                {/* Double the array for seamless looping */}
                {[...winners, ...winners].map((winner, idx) => (
                    <div key={idx} className="flex items-center mx-10 font-mono text-sm uppercase">
                        <span className="text-gray-600 mr-3">[{winner.game}]</span>
                        <span className="text-white font-bold tracking-wider mr-3">{winner.address}</span>
                        <span className="text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]">{t('won')} {winner.amount}</span>
                        <div className="w-1.5 h-1.5 bg-[#FF003C] animate-pulse rounded-full ml-10"></div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
