import { NumberGrid } from "@/components/ticket/NumberGrid";

export default function BuyTicketPage() {
    return (
        <div className="w-full flex-grow flex items-center justify-center py-16 px-4 relative overflow-hidden">
            {/* Deep Cyberpunk Background Glow Specific for Buy Page */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

            <div className="w-full max-w-6xl flex flex-col items-center">
                {/* Page Context */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center gap-3 bg-black border border-[#FF003C]/40 px-6 py-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#FF003C] animate-ping"></span>
                        <span className="font-mono text-[#FF003C] text-xs tracking-[0.2em] font-bold">SMART CONTRACT LINK PROTOCOL ACTIVE</span>
                    </div>
                    <p className="max-w-xl mx-auto text-gray-400 font-mono text-sm leading-relaxed">
                        The Oracle awaits your input. Select exactly 6 numbers to encode your quantum ticket pattern on the blockchain. Ensure wallet connection before approving transaction.
                    </p>
                </div>

                {/* Core Component */}
                <NumberGrid />

                {/* Rules Summary */}
                <div className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-black border border-white/10 hover:border-[#39FF14]/50 transition-colors group">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2 group-hover:text-[#39FF14] transition-colors">1. Selection</h4>
                        <p className="text-gray-500 font-mono text-xs leading-relaxed">Choose exactly 6 numbers out of 55 possible nodes. Pattern cannot be altered once signed.</p>
                    </div>
                    <div className="p-6 bg-black border border-white/10 hover:border-[#00F0FF]/50 transition-colors group">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2 group-hover:text-[#00F0FF] transition-colors">2. Approval</h4>
                        <p className="text-gray-500 font-mono text-xs leading-relaxed">Authorize the JPK protocol to execute the wager on your behalf. Requires wallet signature.</p>
                    </div>
                    <div className="p-6 bg-black border border-white/10 hover:border-[#FF003C]/50 transition-colors group">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2 group-hover:text-[#FF003C] transition-colors">3. Confirmation</h4>
                        <p className="text-gray-500 font-mono text-xs leading-relaxed">Wait for blockchain consensus. Your ticket will be permanently minted and auditable.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
