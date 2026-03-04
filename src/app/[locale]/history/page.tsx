'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { History, Calendar, DollarSign, Users, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LatestDrawResult from '@/components/history/LatestDrawResult';

const BACKEND_URL =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) ||
    'http://localhost:3001';

type DrawHistoryItem = {
    id: string;
    onChainDrawId: number | null;
    winningNumbers: number[];
    totalPrize: string;
    status: string;
    transactionHash: string | null;
    executedAt: string;
    ticketCount: number;
    winnerCount: number;
};

const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

export default function HistoryPage() {
    const t = useTranslations('History');

    const { data: historyData, isLoading, isError } = useQuery({
        queryKey: ['draw-history'],
        queryFn: async () => {
            const res = await fetch(`${BACKEND_URL}/api/draws/history?limit=50`);
            if (!res.ok) {
                throw new Error('Failed to fetch history');
            }
            return res.json() as Promise<DrawHistoryItem[]>;
        },
        refetchInterval: 30000,
    });

    return (
        <div className="flex flex-col items-center w-full relative overflow-hidden min-h-screen text-white pb-20">
            {/* Background glow effects */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF3939]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <motion.div
                className="w-full max-w-5xl px-4 flex flex-col gap-16 mt-20"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.15 } },
                    hidden: {}
                }}
            >
                {/* Header Section */}
                <motion.section variants={fadeUpVariant} className="flex flex-col items-center text-center gap-4">
                    <div className="bg-[#FF3939]/10 p-4 rounded-full border border-[#FF3939]/30 mb-2 shadow-[0_0_20px_rgba(255,57,57,0.2)]">
                        <History className="w-10 h-10 text-[#FF3939]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-[#00F0FF] tracking-widest uppercase font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                        {t('subtitle')}
                    </p>
                </motion.section>

                {/* Latest Draw Result */}
                <motion.section variants={fadeUpVariant} className="flex flex-col gap-6 w-full mt-4">
                    <LatestDrawResult />
                </motion.section>

                {/* Filters/Controls would go here (e.g., Year/Month selector) */}

                {/* History List */}
                <motion.section variants={fadeUpVariant} className="flex flex-col gap-6 w-full">
                    {isLoading ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl">
                            <Loader2 className="w-10 h-10 text-[#00F0FF] animate-spin mb-4" />
                            <span className="text-white/40 tracking-widest uppercase">Đang tải dữ liệu...</span>
                        </div>
                    ) : isError ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl">
                            <span className="text-[#FF3939] tracking-widest uppercase text-center p-4">Lỗi kết nối Máy chủ. <br />Vui lòng thử lại sau.</span>
                        </div>
                    ) : !historyData || historyData.length === 0 ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl">
                            <span className="text-white/40 tracking-widest uppercase">{t('noRecords')}</span>
                        </div>
                    ) : (
                        historyData.map((draw) => (
                            <motion.div
                                key={draw.id}
                                whileHover={{ scale: 1.01, backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center transition-all duration-300 group hover:border-[#FF3939]/50 hover:shadow-[0_0_30px_rgba(255,57,57,0.1)]"
                            >
                                {/* Draw Info */}
                                <div className="flex flex-col gap-2 min-w-[150px]">
                                    <div className="flex items-center gap-2 text-[#FF3939]">
                                        <span className="text-2xl font-black uppercase tracking-wider">{t('draw')} #{draw.onChainDrawId ?? '-'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-white/50 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="tracking-wider">{new Date(draw.executedAt).toLocaleDateString()}</span>
                                        </div>
                                        {draw.transactionHash && (
                                            <a
                                                href={`https://testnet.bscscan.com/tx/${draw.transactionHash}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-[#39FF14] hover:text-white hover:underline transition-all duration-200 mt-1 uppercase text-xs tracking-widest"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                {t('viewOnBlockchain')}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Winning Numbers */}
                                <div className="flex flex-col items-start lg:items-center gap-3 flex-grow">
                                    <span className="text-xs text-white/40 uppercase tracking-widest">{t('winningNumbers')}</span>
                                    <div className="flex flex-wrap gap-2 md:gap-3">
                                        {draw.winningNumbers.map((num: number, i: number) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00F0FF]/20 border border-[#39FF14]/50 flex justify-center items-center text-white font-bold text-lg md:text-xl shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                                            >
                                                {num.toString().padStart(2, '0')}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Prize Info */}
                                <div className="flex flex-col sm:flex-row lg:flex-col gap-6 lg:gap-3 min-w-[200px] lg:items-end">
                                    <div className="flex flex-col lg:items-end gap-1">
                                        <span className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" /> {t('jackpot')}
                                        </span>
                                        <span className="text-xl md:text-2xl font-black text-[#FCEE09] drop-shadow-[0_0_8px_rgba(252,238,9,0.3)]">
                                            {draw.totalPrize} $JPK
                                        </span>
                                    </div>
                                    <div className="flex flex-col lg:items-end gap-1">
                                        <span className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {t('winners')}
                                        </span>
                                        <span className={`text-lg font-bold ${draw.winnerCount > 0 ? "text-[#39FF14]" : "text-white/60"}`}>
                                            {draw.winnerCount}
                                        </span>
                                    </div>
                                </div>

                            </motion.div>
                        ))
                    )}
                </motion.section>

            </motion.div>
        </div>
    );
}
