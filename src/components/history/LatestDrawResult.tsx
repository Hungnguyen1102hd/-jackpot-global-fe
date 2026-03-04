'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const BACKEND_URL =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) ||
    'http://localhost:3001';

type PrizeTier = {
    name: string;
    match: string;
    winners: number;
    prizeValue: string;
};

type LatestDrawResultResponse = {
    drawId: number;
    drawDate: string;
    winningNumbers: number[];
    prizePool: string;
    transactionHash: string | null;
    tiers: PrizeTier[];
};

const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' as const },
    },
};

export default function LatestDrawResult() {
    const t = useTranslations('LatestDraw');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['latest-draw-result'],
        queryFn: async () => {
            const res = await fetch(`${BACKEND_URL}/api/draws/latest-result`);
            if (!res.ok) {
                if (res.status === 404) return null; // Handle 404 cleanly
                throw new Error('Failed to fetch latest result');
            }
            return res.json() as Promise<LatestDrawResultResponse>;
        },
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <motion.div
                variants={fadeUpVariant}
                className="w-full relative overflow-hidden bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px]"
            >
                <Loader2 className="w-10 h-10 text-[#00F0FF] animate-spin mb-4" />
                <span className="text-[#00F0FF]/60 animate-pulse tracking-widest uppercase font-mono">
                    {t('loading')}
                </span>
            </motion.div>
        );
    }

    if (isError) {
        return (
            <motion.div
                variants={fadeUpVariant}
                className="w-full relative overflow-hidden bg-black/40 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px]"
            >
                <AlertCircle className="w-12 h-12 text-[#FF3939] mb-4" />
                <span className="text-[#FF3939] tracking-widest uppercase font-mono text-center">
                    {t('error')}
                </span>
            </motion.div>
        );
    }

    // Handle empty state gracefully
    if (!data || data.winningNumbers.length === 0) {
        return (
            <motion.div
                variants={fadeUpVariant}
                className="w-full relative overflow-hidden bg-black/80 backdrop-blur-md border border-[#00F0FF]/20 rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px]"
            >
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00F0FF]/50 rounded-tl-xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00F0FF]/50 rounded-br-xl pointer-events-none"></div>

                <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
                <span className="text-[#00F0FF] text-xl tracking-[0.3em] font-mono text-center animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                    {t('standby')}
                </span>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={fadeUpVariant}
            className="w-full relative overflow-hidden bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,240,255,0.05)]"
        >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00F0FF]/40 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00F0FF]/40 rounded-tr-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00F0FF]/40 rounded-bl-xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00F0FF]/40 rounded-br-xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                {/* Left Column: Info & Balls */}
                <div className="flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-blue-500">
                            {t('title')}
                        </h2>
                        <p className="text-white/60 font-mono text-sm uppercase tracking-widest flex items-center flex-wrap gap-2 mt-1">
                            <span>{t('drawLabel')} #{data.drawId ?? '-'}</span>
                            <span className="text-white/20">|</span>
                            <span>
                                {t('dateLabel')}:{' '}
                                <span className="text-[#00F0FF]">
                                    {new Date(data.drawDate).toLocaleDateString()}
                                </span>
                            </span>
                            {data.transactionHash && (
                                <>
                                    <span className="text-white/20">|</span>
                                    <a
                                        href={`https://testnet.bscscan.com/tx/${data.transactionHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#39FF14] hover:text-white hover:underline transition-all duration-200 flex items-center gap-1"
                                    >
                                        {t('viewOnBlockchain')}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="mt-auto">
                        <span className="text-xs text-white/40 uppercase tracking-[0.2em] mb-4 block font-mono">
                            {t('winningNumbers')}
                        </span>
                        <div className="flex flex-wrap gap-4 items-center">
                            {data.winningNumbers.map((num, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: idx * 0.1, type: 'spring', bounce: 0.5 }}
                                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#FF3939]/30 via-[#FF3939]/10 to-transparent border border-[#FF3939]/60 flex justify-center items-center text-white font-black text-2xl md:text-3xl shadow-[0_0_25px_rgba(255,57,57,0.3)] relative group"
                                >
                                    <div className="absolute inset-0 rounded-full border border-white/20 scale-[0.85]"></div>
                                    <span className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                        {num.toString().padStart(2, '0')}
                                    </span>
                                    <div className="absolute -inset-1 bg-[#FF3939]/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Prize Table */}
                <div className="flex flex-col h-full justify-between">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#00F0FF]/20 text-[10px] md:text-xs text-[#00F0FF]/60 uppercase tracking-[0.2em] font-mono">
                                    <th className="py-4 px-2 font-semibold">{t('tablePrize')}</th>
                                    <th className="py-4 px-2 font-semibold hidden sm:table-cell text-center">
                                        {t('tableMatch')}
                                    </th>
                                    <th className="py-4 px-2 font-semibold text-center">{t('tableWinners')}</th>
                                    <th className="py-4 px-2 font-semibold text-right">
                                        {t('tableValue')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.tiers.map((tier, idx) => {
                                    const isJackpot = tier.name === 'Jackpot';
                                    return (
                                        <tr
                                            key={idx}
                                            className={`border-b border-white/5 transition-colors relative ${isJackpot
                                                ? 'bg-[#FF3939]/10 group'
                                                : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <td
                                                className={`py-4 px-2 font-bold tracking-wider relative ${isJackpot
                                                    ? 'text-[#FF3939] drop-shadow-[0_0_8px_rgba(255,57,57,0.6)]'
                                                    : 'text-white/80'
                                                    }`}
                                            >
                                                {/* Jackpot left accent line */}
                                                {isJackpot && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF3939] shadow-[0_0_10px_#FF3939]"></div>
                                                )}
                                                <span className={isJackpot ? 'pl-2' : ''}>
                                                    {isJackpot ? tier.name : t('tierPrefix') + ' ' + tier.name.replace('Giải ', '')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-white/50 text-sm hidden sm:table-cell text-center font-mono">
                                                {tier.match}
                                            </td>
                                            <td
                                                className={`py-4 px-2 font-mono text-center ${tier.winners > 0 ? 'text-[#39FF14]' : 'text-white/20'
                                                    }`}
                                            >
                                                {tier.winners.toLocaleString()}
                                            </td>
                                            <td
                                                className={`py-4 px-2 text-right font-black tracking-tight ${isJackpot
                                                    ? 'text-[#FCEE09] text-lg md:text-xl drop-shadow-[0_0_10px_rgba(252,238,9,0.4)]'
                                                    : 'text-[#00F0FF] text-base md:text-lg'
                                                    }`}
                                            >
                                                {isNaN(Number(tier.prizeValue))
                                                    ? tier.prizeValue
                                                    : Number(tier.prizeValue).toLocaleString()}
                                                <span className={`ml-1 font-medium ${isJackpot ? 'text-xs opacity-70' : 'text-[10px] opacity-60'}`}>$JPK</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-white/30 text-xs mt-6 text-center lg:text-right font-mono tracking-widest">
                        {t('disclaimer')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
