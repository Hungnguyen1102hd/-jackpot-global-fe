"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import JackpotFaucetAbi from "@/abis/JackpotFaucet.json";
import JackpotTokenAbi from "@/abis/JackpotToken.json";
import { formatUnits } from "viem";

const FAUCET_ADDRESS = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;

export default function FaucetPage() {
    const t = useTranslations("Faucet");
    const { address, isConnected } = useAccount();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

    // 1. Fetch User Balance
    const { data: balanceData, refetch: refetchBalance } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: JackpotTokenAbi.abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address }
    });

    // 2. Fetch Next Access Time
    const { data: nextAccessTimeRaw, refetch: refetchNextAccessTime } = useReadContract({
        address: FAUCET_ADDRESS,
        abi: JackpotFaucetAbi.abi,
        functionName: "nextAccessTime",
        args: address ? [address] : undefined,
        query: { enabled: !!address }
    });

    // 3. Faucet Transaction Logic
    const { writeContractAsync: requestTokensAsync, isPending: isRequestingTokens, data: txHash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

    // Toast Timer Management
    useEffect(() => {
        if (!toast) return;
        const id = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(id);
    }, [toast]);

    // Handle Success State
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setToast({ type: "success", message: t("claimSuccess") });
                refetchBalance();
                refetchNextAccessTime();
            }, 0);
        }
    }, [isSuccess, refetchBalance, refetchNextAccessTime, t]);

    // Transaction Processing State
    useEffect(() => {
        if (isConfirming) {
            setTimeout(() => {
                setToast({ type: "info", message: t("processing") });
            }, 0);
        }
    }, [isConfirming, t]);

    // Countdown Timer Calculation
    useEffect(() => {
        if (!nextAccessTimeRaw) return;

        const nextTime = Number(nextAccessTimeRaw) * 1000; // Convert Unix seconds to ms
        const updateTimer = () => {
            const now = Date.now();
            const difference = nextTime - now;
            setTimeLeft(Math.max(0, Math.floor(difference / 1000)));
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [nextAccessTimeRaw]);

    const handleClaim = async () => {
        if (!isConnected) {
            setToast({ type: "error", message: t("needConnect") });
            return;
        }

        try {
            setToast({ type: "info", message: t("processing") });
            await requestTokensAsync({
                address: FAUCET_ADDRESS,
                abi: JackpotFaucetAbi.abi,
                functionName: "requestTokens",
            });
        } catch (error) {
            console.error("Faucet Claim Error:", error);
            setToast({ type: "error", message: t("claimError") });
        }
    };

    // Format the time left into HH:MM:SS
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
        const s = (totalSeconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const isCooldownActive = timeLeft > 0;
    const isProcessing = isRequestingTokens || isConfirming;

    // Framer Motion Variants
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const terminalVariants: any = {
        hidden: { scale: 0.95, opacity: 0, y: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 pt-32 pb-20 overflow-hidden relative font-mono flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                variants={terminalVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl px-4 relative z-10"
            >
                {/* Cyberpunk ATM Terminal */}
                <div className="bg-black/80 backdrop-blur-md border border-[#00F0FF]/30 p-8 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative overflow-hidden group">
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#00F0FF] opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#00F0FF] opacity-50"></div>

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.03)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>

                    <div className="text-center mb-10 relative">
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {t("title")}
                        </h1>
                        <h2 className="text-[#00F0FF] text-lg md:text-xl font-bold tracking-widest uppercase mb-4 animate-[pulse_3s_ease-in-out_infinite]">
                            {t("subtitle")}
                        </h2>
                        <div className="w-16 h-1 bg-[#00F0FF] mx-auto shadow-[0_0_10px_#00F0FF]"></div>
                        <p className="text-gray-400 text-sm mt-6 leading-relaxed max-w-lg mx-auto italic">
                            {t("description")}
                        </p>
                    </div>

                    {/* Stats Display Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {/* Balance Screen */}
                        <div className="bg-[#00F0FF]/5 border border-[#00F0FF]/20 p-4 relative group-hover:border-[#00F0FF]/50 transition-colors">
                            <span className="text-[#00F0FF] text-xs uppercase tracking-widest block mb-2 opacity-70">
                                {t("balanceLabel")}
                            </span>
                            <div className="text-2xl font-black text-white flex items-baseline gap-2">
                                {balanceData !== undefined ? Number(formatUnits(balanceData as bigint, 18)).toLocaleString() : "0.00"}
                                <span className="text-sm text-[#00F0FF] font-medium tracking-widest">$JPK</span>
                            </div>
                        </div>

                        {/* Network Protocol Area */}
                        <div className="bg-black border border-gray-800 p-4 flex flex-col justify-center items-center">
                            <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">
                                Network Protocol
                            </span>
                            <span className="text-[#39FF14] text-sm uppercase tracking-widest font-bold drop-shadow-[0_0_5px_#39FF14]">
                                SECURE CONNECTION
                            </span>
                        </div>
                    </div>

                    {/* Main Interaction Area */}
                    <div className="flex flex-col items-center border border-[#00F0FF]/20 bg-[#00F0FF]/5 p-8 relative">
                        {isCooldownActive ? (
                            <div className="text-center w-full">
                                <span className="text-gray-400 text-sm uppercase tracking-widest block mb-4">
                                    {t("cooldownLabel")}
                                </span>
                                <div className="text-4xl md:text-5xl font-black text-[#FF3939] tracking-widest drop-shadow-[0_0_15px_rgba(255,57,57,0.5)] bg-black/50 py-4 border border-[#FF3939]/30">
                                    {formatTime(timeLeft)}
                                </div>
                                {/* Disabled button visual state */}
                                <div className="mt-8 px-8 py-4 bg-gray-900 border border-gray-800 text-gray-600 font-bold uppercase tracking-widest w-full cursor-not-allowed">
                                    SYSTEM LOCKED
                                </div>
                            </div>
                        ) : (
                            <div className="w-full cursor-pointer relative group" onClick={handleClaim}>
                                {/* Glowing Effect under button */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF] to-[#39FF14] rounded opacity-70 blur-md transition duration-500 group-hover:opacity-100 animate-pulse"></div>

                                <button
                                    disabled={isProcessing || !isConnected}
                                    className="relative w-full px-8 py-4 bg-black border-2 border-[#00F0FF] text-[#00F0FF] text-lg font-black uppercase tracking-widest hover:bg-[#00F0FF] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {!isConnected ? "CONNECT WALLET" : isProcessing ? t("processing") : t("claimButton")}
                                </button>
                            </div>
                        )}

                        {/* Connection Warning Overlay */}
                        {!isConnected && (
                            <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center border border-[#FF3939]/50">
                                <span className="text-[#FF3939] font-bold text-sm tracking-widest uppercase animate-pulse flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#FF3939] rounded-full"></span>
                                    {t("needConnect")}
                                    <span className="w-2 h-2 bg-[#FF3939] rounded-full"></span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="mt-6 flex justify-between items-center text-[10px] text-[#00F0FF] opacity-50 tracking-widest uppercase border-t border-[#00F0FF]/20 pt-4">
                        <span>Terminal V1.0.4</span>
                        <span>[ SYSTEM ONLINE ]</span>
                    </div>
                </div>
            </motion.div>

            {/* Custom Toast Notification Segment */}
            {toast && (
                <div
                    className={`
                        fixed bottom-6 right-6 z-50 px-6 py-4 max-w-sm font-mono text-sm uppercase tracking-widest border border-l-4
                        shadow-2xl backdrop-blur-md transform transition-all duration-300
                        ${toast.type === "success"
                            ? "bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14] border-l-[#39FF14]"
                            : toast.type === "error"
                                ? "bg-[#FF3939]/10 border-[#FF3939] text-[#FF3939] border-l-[#FF3939]"
                                : "bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF] border-l-[#00F0FF]"
                        }
                    `}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
