'use client';

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) ||
    'http://localhost:3001';

// Types
type TicketData = {
    id: string;
    ticketId: number;
    numbers: number[];
    isWinner: boolean;
    purchasedAt: string;
    draw: {
        drawId: number;
        status: string;
        winningNumbers: number[];
        totalPrize: string;
        executedAt: string;
    } | null;
};

type DrawHistoryItem = {
    id: string;
    onChainDrawId: number;
    winningNumbers: number[];
    totalPrize: string;
    status: string;
    executedAt: string;
    ticketCount: number;
    winnerCount: number;
};

// Mock Data
type Ticket = {
    id: string;
    drawId: string;
    numbers: number[];
    status: string;
    prize?: string;
};

function TicketCard({ ticket, type }: { ticket: TicketData, type: 'pending' | 'history' }) {
    const isWinner = ticket.isWinner;
    const t = useTranslations("MyTickets");

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`
      relative overflow-hidden w-full p-6 border-2 transition-colors duration-300
      ${isWinner
                    ? "border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_20px_rgba(57,255,20,0.3)] animate-[pulse_3s_ease-in-out_infinite] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
                    : "border-gray-800 bg-black hover:border-gray-600"}
    `}>
            {/* Visual Glitch/Decal */}
            <div className={`absolute -right-10 -top-10 w-24 h-24 rotate-45 opacity-20 ${isWinner ? 'bg-[#39FF14]' : 'bg-gray-600'}`}></div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-white font-mono font-bold text-lg">TKT-{ticket.ticketId}</h3>
                    <p className="text-gray-500 font-mono text-xs tracking-widest uppercase mt-1">{t('draw')} {ticket.draw ? `#${ticket.draw.drawId}` : t('pending')}</p>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest border
          ${isWinner ? "border-[#39FF14] text-[#39FF14] bg-[#39FF14]/10" :
                        type === "history" ? "border-gray-700 text-gray-500 bg-gray-900" :
                            "border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/10"}
        `}>
                    {isWinner ? t('prizeSecured') : type === "history" ? t('lost') : t('awaitingDraw').toUpperCase()}
                </div>
            </div>

            {/* Numbers */}
            <div className="flex flex-wrap gap-2 mb-6">
                {ticket.numbers.map((n: number, idx: number) => (
                    <div key={idx} className={`
            w-10 h-10 flex items-center justify-center font-mono font-bold border
            ${isWinner ? "border-[#39FF14] text-[#39FF14] shadow-[0_0_10px_#39FF14]" : "border-gray-700 text-gray-300"}
          `}>
                        {n.toString().padStart(2, "0")}
                    </div>
                ))}
            </div>

            {/* Action / Prize Area */}
            {type === 'history' && (
                <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                    <div>
                        <span className="text-gray-500 font-mono text-xs uppercase tracking-widest block mb-1">{t('result')}</span>
                        {isWinner
                            ? <span className="text-[#39FF14] font-black text-xl drop-shadow-[0_0_8px_#39FF14]">N/A</span>
                            : <span className="text-gray-600 font-mono">{t('noMatch')}</span>
                        }
                    </div>

                    {isWinner && (
                        <button className="px-6 py-2 bg-[#39FF14] text-black font-black uppercase tracking-widest text-sm
                             hover:bg-white hover:shadow-[0_0_20px_#39FF14] transition-all duration-300"
                            style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}>
                            {t('claimPrize')}
                        </button>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export default function MyTicketsPage() {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    const t = useTranslations("MyTickets");

    const { data: tickets = [], isLoading, isError } = useQuery<TicketData[]>({
        queryKey: ['tickets', address],
        queryFn: async () => {
            if (!address) return [];
            const res = await fetch(`${BACKEND_URL}/tickets/${address}`);
            if (!res.ok) throw new Error("Failed to fetch tickets");
            return res.json();
        },
        enabled: !!address,
        refetchInterval: 10000, // Refresh every 10 seconds to catch new ones
    });

    const { data: drawHistory = [], isLoading: isDrawHistoryLoading, isError: isDrawHistoryError } =
        useQuery<DrawHistoryItem[]>({
            queryKey: ['draw-history'],
            queryFn: async () => {
                const res = await fetch(`${BACKEND_URL}/api/draws/history?limit=20`);
                if (!res.ok) throw new Error("Failed to fetch draw history");
                return res.json();
            },
            refetchInterval: 60000,
        });

    const pendingTickets = tickets.filter(t => !t.draw || t.draw.status === 'PENDING');
    const historyTickets = tickets.filter(t => t.draw && t.draw.status === 'COMPLETED');


    if (!isConnected) {
        return (
            <div className="w-full flex-grow flex flex-col items-center justify-center py-20 px-4">
                {/* Deep Cyberpunk Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF003C]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                <div className="max-w-md w-full border border-[#FF003C]/30 bg-black/80 backdrop-blur-sm p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF003C] to-transparent"></div>

                    <div className="w-16 h-16 border-2 border-[#FF003C] rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,0,60,0.3)]">
                        <span className="w-8 h-8 font-serif italic text-3xl font-bold text-[#FF003C]">!</span>
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">{t('unverifiedTitle')}</h2>
                    <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">
                        {t('unverifiedDesc')}
                    </p>

                    <div className="flex justify-center">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex-grow flex flex-col items-center py-16 px-4">
            {/* Background Glow */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

            <div className="w-full max-w-5xl">
                <h1 className="text-4xl md:text-5xl border-l-4 border-[#00F0FF] pl-6 font-black text-white uppercase tracking-tighter mb-10">
                    {t('title')} <span className="text-[#00F0FF]">{t('subtitle')}</span>
                </h1>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-800 mb-10 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-4 px-4 font-mono font-bold uppercase tracking-widest text-sm whitespace-nowrap transition-colors relative
              ${activeTab === 'pending' ? 'text-[#00F0FF]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {t('awaitingDraw')} ({pendingTickets.length})
                        {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"></div>}
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 px-4 font-mono font-bold uppercase tracking-widest text-sm whitespace-nowrap transition-colors relative
              ${activeTab === 'history' ? 'text-[#39FF14]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {t('drawHistory')} ({historyTickets.length})
                        {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#39FF14] shadow-[0_0_10px_#39FF14]"></div>}
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20 border border-[#00F0FF]/30 bg-[#00F0FF]/5">
                        <div className="w-8 h-8 rounded-full border-t-2 border-[#00F0FF] animate-spin"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 border border-[#FF003C]/30 bg-[#FF003C]/5 text-[#FF003C] font-mono">
                        {t('error')}
                    </div>
                ) : (
                    <>
                        {activeTab === 'history' && (
                            <div className="mb-10 border border-gray-800 bg-black/60 p-6">
                                <h2 className="text-lg md:text-xl font-mono font-bold uppercase tracking-widest text-gray-300 mb-4">
                                    Global Draw History
                                </h2>

                                {isDrawHistoryLoading ? (
                                    <div className="flex items-center gap-3 text-gray-500 font-mono text-xs">
                                        <div className="w-4 h-4 rounded-full border-t-2 border-[#00F0FF] animate-spin" />
                                        Loading draw history...
                                    </div>
                                ) : isDrawHistoryError ? (
                                    <div className="text-[#FF003C] font-mono text-xs">
                                        Failed to load draw history.
                                    </div>
                                ) : drawHistory.length === 0 ? (
                                    <div className="text-gray-600 font-mono text-xs uppercase tracking-widest">
                                        No completed draws yet.
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                        {drawHistory.map((draw) => (
                                            <div
                                                key={draw.id}
                                                className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-800 px-4 py-3 bg-black"
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                                                        Draw #{draw.onChainDrawId}
                                                    </span>
                                                    <span className="font-mono text-xs text-gray-400">
                                                        Executed at:{" "}
                                                        {new Date(draw.executedAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 mt-3 md:mt-0 font-mono text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 uppercase tracking-widest">
                                                            Numbers
                                                        </span>
                                                        <span className="text-white">
                                                            {draw.winningNumbers
                                                                .map((n) => n.toString().padStart(2, "0"))
                                                                .join(" ")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 uppercase tracking-widest">
                                                            Prize
                                                        </span>
                                                        <span className="text-[#39FF14]">
                                                            {draw.totalPrize} JPK
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 uppercase tracking-widest">
                                                            Tickets
                                                        </span>
                                                        <span className="text-white">
                                                            {draw.ticketCount} / Winners {draw.winnerCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {(activeTab === 'pending' ? pendingTickets : historyTickets).map((ticket) => (
                                    <TicketCard key={ticket.id} ticket={ticket} type={activeTab} />
                                ))}
                            </AnimatePresence>

                            {(activeTab === 'pending' ? pendingTickets : historyTickets).length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-1 md:col-span-2 text-center py-20 border border-gray-800 border-dashed"
                                >
                                    <p className="text-gray-600 font-mono tracking-widest uppercase">{t('noRecords')}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
