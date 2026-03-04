import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import JackpotLotteryAbi from "@/abis/JackpotLottery.json";

const LOTTERY_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`;

type ClaimPrizeModalProps = {
    isOpen: boolean;
    ticketId: number;
    prizeAmount: number; // in numerical value, maybe format later.
    onClose: () => void;
    onSuccess: () => void;
};

export default function ClaimPrizeModal({ isOpen, ticketId, prizeAmount, onClose, onSuccess }: ClaimPrizeModalProps) {
    const [selectedOption, setSelectedOption] = useState<'instant' | 'vesting'>('vesting');
    const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

    const { writeContractAsync, isPending: isWriting, data: txHash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

    const isProcessing = isWriting || isConfirming;

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setToast({ message: "GIAO DỊCH THÀNH CÔNG! ĐANG LÀM MỚI DỮ LIỆU...", type: "success" });
            }, 0);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        }
    }, [isSuccess, onSuccess, onClose]);

    const handleConfirm = async () => {
        try {
            setToast({ message: "ĐANG XÁC NHẬN GIAO DỊCH...", type: "info" });
            await writeContractAsync({
                address: LOTTERY_ADDRESS,
                abi: JackpotLotteryAbi.abi,
                functionName: "claimPrize",
                args: [ticketId, selectedOption === 'instant'],
            });
        } catch (error) {
            console.error("Claim Error:", error);
            setToast({ message: "LỖI GIAO DỊCH. VUI LÒNG THỬ LẠI!", type: "error" });
            setTimeout(() => setToast(null), 3000);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0A0A0A]/90 border border-[#00F0FF]/50 shadow-[0_0_30px_rgba(0,240,255,0.2)] p-6 md:p-8"
                    >
                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00F0FF]"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00F0FF]"></div>

                        {/* Blinking Title */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#39FF14] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(57,255,20,0.6)] animate-[pulse_2s_infinite]">
                                TÍN HIỆU TRÚNG THƯỞNG XÁC NHẬN
                            </h2>
                            <p className="text-gray-400 font-mono mt-2 uppercase tracking-widest">
                                Ticket #{ticketId}
                            </p>
                        </div>

                        {/* Options Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Option 1: Instant Claim */}
                            <div
                                onClick={() => !isProcessing && setSelectedOption('instant')}
                                className={`relative cursor-pointer transition-all duration-300 p-6 border bg-black/50 backdrop-blur-sm
                                    ${selectedOption === 'instant'
                                        ? 'border-[#FF3939] shadow-[0_0_20px_rgba(255,57,57,0.3)] scale-[1.02]'
                                        : 'border-gray-700 hover:border-[#FF3939]/50'
                                    }
                                    ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                                `}
                            >
                                <h3 className={`text-xl font-black mb-2 uppercase tracking-wide
                                    ${selectedOption === 'instant' ? 'text-[#FF3939] drop-shadow-[0_0_5px_rgba(255,57,57,0.5)]' : 'text-gray-400'}
                                `}>
                                    INSTANT CLAIM
                                </h3>
                                <p className="text-sm font-bold text-gray-300 mb-4">Nhận ngay 70% tổng giải thưởng</p>

                                <div className="bg-[#FF3939]/10 p-3 mb-4 rounded border border-[#FF3939]/30">
                                    <span className="block text-xs uppercase tracking-widest text-[#FF3939] mb-1">Nhận ngay:</span>
                                    <span className="text-xl font-black text-[#FF3939]">{Number(prizeAmount * 0.7).toLocaleString()} JPK</span>
                                </div>

                                <p className="text-xs font-mono text-gray-500 italic border-l-2 border-gray-600 pl-2">
                                    Cảnh báo: Chịu 30% phí duy trì hệ thống & vốn mồi
                                </p>
                            </div>

                            {/* Option 2: Vesting Claim */}
                            <div
                                onClick={() => !isProcessing && setSelectedOption('vesting')}
                                className={`relative cursor-pointer transition-all duration-300 p-6 border bg-black/50 backdrop-blur-sm mt-4 md:mt-0
                                    ${selectedOption === 'vesting'
                                        ? 'border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-[1.02]'
                                        : 'border-gray-700 hover:border-[#00F0FF]/50'
                                    }
                                    ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                                `}
                            >
                                <div className="absolute -top-3 -right-3 bg-[#39FF14] text-black font-black text-[10px] uppercase px-3 py-1 border border-black shadow-[0_0_10px_#39FF14] animate-pulse -rotate-6">
                                    RECOMMENDED (Khuyên Dùng)
                                </div>

                                <h3 className={`text-xl font-black mb-2 uppercase tracking-wide
                                    ${selectedOption === 'vesting' ? 'text-[#00F0FF] drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]' : 'text-gray-400'}
                                `}>
                                    VESTING CLAIM
                                </h3>
                                <p className="text-sm font-bold text-gray-300 mb-4">Nhận 50% ngay + 10% mỗi tháng (Tổng 90%)</p>

                                <div className="bg-[#00F0FF]/10 p-3 mb-4 rounded border border-[#00F0FF]/30 space-y-2">
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-[#00F0FF] mb-0.5">Nhận ngay:</span>
                                        <span className="text-lg font-black text-[#00F0FF]">{Number(prizeAmount * 0.5).toLocaleString()} JPK</span>
                                    </div>
                                    <div className="h-px bg-[#00F0FF]/20 w-full"></div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-[#00F0FF] mb-0.5">Mỗi tháng (4 tháng):</span>
                                        <span className="text-sm font-bold text-[#00F0FF]">{Number(prizeAmount * 0.1).toLocaleString()} JPK / tháng</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Toast Inline (If ANY error/info) */}
                        {toast && (
                            <div className={`mb-6 p-4 text-center font-mono text-sm tracking-widest uppercase border
                                ${toast.type === 'success' ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]' :
                                    toast.type === 'error' ? 'bg-[#FF3939]/10 text-[#FF3939] border-[#FF3939]' :
                                        'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]'}
                            `}>
                                {toast.message}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 p-1">
                            <button
                                onClick={onClose}
                                disabled={isProcessing}
                                className="flex-1 py-4 font-black uppercase tracking-widest border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors disabled:opacity-50"
                            >
                                HỦY BỎ
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className={`flex-[2] relative py-4 font-black uppercase tracking-widest text-black transition-all overflow-hidden
                                    ${selectedOption === 'instant' ? 'bg-[#FF3939] hover:bg-[#ff5555] shadow-[0_0_15px_#FF3939]' : 'bg-[#00F0FF] hover:bg-[#33f3ff] shadow-[0_0_15px_#00F0FF]'}
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                <span className="relative z-10">{isProcessing ? "ĐANG XỬ LÝ..." : "XÁC NHẬN GIAO DỊCH"}</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
