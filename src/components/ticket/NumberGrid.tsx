"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { maxUint256, parseEther } from "viem";
import JackpotTokenAbi from "@/abis/JackpotToken.json";
import JackpotLotteryAbi from "@/abis/JackpotLottery.json";

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;
const LOTTERY_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`;
const TICKET_PRICE = parseEther("10"); // Giá vé: 10 JPK

export function NumberGrid() {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [errorVisible, setErrorVisible] = useState(false);
    const [toast, setToast] = useState<{ type: "info" | "success" | "error"; message: string } | null>(null);

    const maxSelection = 6;
    const totalNumbers = 55;

    const { address } = useAccount();

    // 1. Kiểm tra Allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: JackpotTokenAbi.abi,
        functionName: "allowance",
        args: address ? [address, LOTTERY_ADDRESS as `0x${string}`] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // 2. Viết hàm Approve
    const { writeContractAsync: approveAsync, isPending: isApprovePending, data: approveTxHash } = useWriteContract();

    // 3. Theo dõi giao dịch Approve
    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveTxHash,
    });

    // Cập nhật lại allowance khi Approve thành công
    useEffect(() => {
        if (isApproveSuccess) {
            void refetchAllowance();
            // Không set state ở đây để tránh cascading renders
        }
    }, [isApproveSuccess, refetchAllowance]);

    // 4. Viết hàm BuyTicket
    const { writeContractAsync: buyTicketAsync, isPending: isBuyPending, data: buyTxHash } = useWriteContract();

    // 5. Theo dõi giao dịch BuyTicket
    const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
        hash: buyTxHash,
    });

    useEffect(() => {
        if (isBuySuccess) {
            setToast({
                type: "success",
                message: "Mua vé thành công! Vé của bạn đã được ghi nhận.",
            });
            // Gọi timeout để tách context render giúp tránh cảnh báo cascading renders
            setTimeout(() => {
                setSelectedNumbers([]);
            }, 0);
            void refetchAllowance(); // Fetch lại token sau khi đã mua
        }
    }, [isBuySuccess, refetchAllowance]);

    // Toast tự động ẩn sau một thời gian ngắn
    useEffect(() => {
        if (!toast) return;
        const id = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(id);
    }, [toast]);

    // Toast cho trạng thái giao dịch Approve
    useEffect(() => {
        if (isApproveConfirming) {
            setToast({
                type: "info",
                message: "Giao dịch Approve $JPK đang chờ xác nhận trên blockchain...",
            });
        }
    }, [isApproveConfirming]);

    useEffect(() => {
        if (isApproveSuccess) {
            setToast({
                type: "success",
                message: "Approve $JPK thành công. Bạn có thể tiến hành mua vé.",
            });
        }
    }, [isApproveSuccess]);

    // Toast cho trạng thái giao dịch mua vé
    useEffect(() => {
        if (isBuyConfirming) {
            setToast({
                type: "info",
                message: "Giao dịch mua vé đang chờ xác nhận trên blockchain...",
            });
        }
    }, [isBuyConfirming]);

    const toggleNumber = (num: number) => {
        if (selectedNumbers.includes(num)) {
            setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
            setErrorVisible(false);
        } else {
            if (selectedNumbers.length >= maxSelection) {
                setErrorVisible(true);
                setTimeout(() => setErrorVisible(false), 3000); // Hide error after 3s
                return;
            }
            setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
        }
    };

    const clearSelection = () => {
        setSelectedNumbers([]);
        setErrorVisible(false);
    };

    const handleApprove = async () => {
        if (!address) {
            setToast({
                type: "error",
                message: "Vui lòng kết nối ví để tiếp tục.",
            });
            return;
        }

        try {
            setToast({
                type: "info",
                message: "Đang gửi giao dịch Approve $JPK...",
            });
            await approveAsync({
                address: TOKEN_ADDRESS as `0x${string}`,
                abi: JackpotTokenAbi.abi,
                functionName: 'approve',
                args: [LOTTERY_ADDRESS as `0x${string}`, maxUint256],
            });
        } catch (error) {
            console.error("Lỗi khi Approve:", error);
            setToast({
                type: "error",
                message: "Approve $JPK thất bại. Vui lòng thử lại.",
            });
        }
    };

    const handleBuyTicket = async () => {
        if (!address) {
            setToast({
                type: "error",
                message: "Vui lòng kết nối ví để tiếp tục.",
            });
            return;
        }
        if (selectedNumbers.length !== maxSelection) {
            setToast({
                type: "error",
                message: `Vui lòng chọn trọn vẹn ${maxSelection} số.`,
            });
            return;
        }

        try {
            setToast({
                type: "info",
                message: "Đang gửi giao dịch mua vé...",
            });
            await buyTicketAsync({
                address: LOTTERY_ADDRESS as `0x${string}`,
                abi: JackpotLotteryAbi.abi,
                functionName: 'buyTicket',
                args: [selectedNumbers], // array 6 chữ số
            });
        } catch (error) {
            console.error("Lỗi khi mua vé:", error);
            setToast({
                type: "error",
                message: "Giao dịch mua vé thất bại. Vui lòng thử lại.",
            });
        }
    };

    const isAllowanceSufficient = allowance !== undefined && (allowance as bigint) >= TICKET_PRICE;
    const isProcessingApprove = isApprovePending || isApproveConfirming;
    const isProcessingBuy = isBuyPending || isBuyConfirming;
    const isSelectionComplete = selectedNumbers.length === maxSelection;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-10 border-2 border-[#00F0FF] bg-black shadow-[0_0_30px_rgba(0,240,255,0.15)] relative">
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#39FF14] -translate-x-[2px] -translate-y-[2px]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#39FF14] translate-x-[2px] translate-y-[2px]"></div>

            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#39FF14] uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                    Power 6/55 Terminal
                </h2>
                <p className="text-gray-400 font-mono text-sm mt-3 tracking-widest uppercase">
                    Select {maxSelection} prime numbers. Await execution.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-11 gap-3 md:gap-4 mb-8">
                {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((num) => {
                    const isSelected = selectedNumbers.includes(num);
                    return (
                        <button
                            key={num}
                            onClick={() => toggleNumber(num)}
                            className={`
                aspect-square flex items-center justify-center font-mono font-bold text-lg transition-all duration-300 transform-gpu
                ${isSelected
                                    ? "bg-[#39FF14] text-black shadow-[0_0_15px_#39FF14] scale-110 border-none"
                                    : "bg-black text-[#00F0FF] border border-[#00F0FF]/30 hover:border-[#00F0FF] hover:bg-[#00F0FF]/20 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:-translate-y-1"
                                }
              `}
                            style={{
                                clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                            }}
                        >
                            {num.toString().padStart(2, "0")}
                        </button>
                    );
                })}
            </div>

            {/* Control Panel */}
            <div className="flex flex-col md:flex-row items-center justify-between p-6 border border-[#FF003C]/30 bg-[#FF003C]/5 relative overflow-hidden">
                {/* Error Overlay */}
                <div className={`absolute inset-0 bg-[#FF003C] flex items-center justify-center transition-transform duration-500 z-10 
                        ${errorVisible ? "translate-y-0" : "translate-y-full"}`}>
                    <span className="font-mono font-black text-black uppercase tracking-widest text-sm md:text-lg animate-pulse flex items-center gap-2">
                        <span className="w-3 h-3 bg-black rounded-full"></span>
                        System Error: Max {maxSelection} numbers selected
                        <span className="w-3 h-3 bg-black rounded-full"></span>
                    </span>
                </div>

                <div className="flex flex-col mb-6 md:mb-0 w-full md:w-auto">
                    <span className="text-gray-500 font-mono text-xs mb-2 uppercase tracking-widest block text-center md:text-left">
                        Selection Matrix
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start min-h-[40px]">
                        {selectedNumbers.length === 0 ? (
                            <span className="text-gray-700 font-mono tracking-widest italic flex items-center">
                                AWAITING INPUT...
                            </span>
                        ) : (
                            selectedNumbers.map((n) => (
                                <div key={n} className="px-3 py-1 bg-[#39FF14]/20 border border-[#39FF14] text-[#39FF14] font-mono font-bold">
                                    {n.toString().padStart(2, "0")}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={clearSelection}
                        className="flex-1 md:flex-none px-6 py-3 border border-gray-600 text-gray-400 font-mono text-sm tracking-widest hover:border-white hover:text-white transition-colors"
                    >
                        CLEAR
                    </button>

                    {/* Render action button based on allowance */}
                    {!isAllowanceSufficient ? (
                        <button
                            onClick={handleApprove}
                            disabled={!isSelectionComplete || isProcessingApprove}
                            className={`flex-1 md:flex-none px-8 py-3 font-black text-sm uppercase tracking-widest transition-all duration-300 ${isSelectionComplete && !isProcessingApprove
                                ? "bg-[#00F0FF] text-black hover:bg-white hover:shadow-[0_0_20px_#00F0FF] cursor-pointer"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                            style={{
                                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                            }}
                        >
                            {isProcessingApprove ? "Đang xử lý..." : "Approve $JPK"}
                        </button>
                    ) : (
                        <button
                            onClick={handleBuyTicket}
                            disabled={!isSelectionComplete || isProcessingBuy}
                            className={`flex-1 md:flex-none px-8 py-3 font-black text-sm uppercase tracking-widest transition-all duration-300 ${isSelectionComplete && !isProcessingBuy
                                ? "bg-[#39FF14] text-black hover:bg-white hover:shadow-[0_0_20px_#39FF14] cursor-pointer"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                            style={{
                                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                            }}
                        >
                            {isProcessingBuy ? "Đang xử lý..." : "Xác nhận Mua Vé"}
                        </button>
                    )}
                </div>
            </div>

            {toast && (
                <div
                    className={`
                        fixed bottom-6 right-6 z-50 px-4 py-3 max-w-sm
                        font-mono text-xs uppercase tracking-widest border
                        ${toast.type === "success"
                            ? "bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]"
                            : toast.type === "error"
                                ? "bg-[#FF003C]/20 border-[#FF003C] text-[#FF003C]"
                                : "bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]"
                        }
                    `}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
