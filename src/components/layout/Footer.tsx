import { Link } from "@/i18n/routing";

export function Footer() {
    return (
        <footer className="w-full bg-black border-t-2 border-[#FF003C] shadow-[0_-4px_25px_rgba(255,0,60,0.15)] pt-16 pb-8 mt-20 relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(#FF003C 1px, transparent 1px), linear-gradient(90deg, #FF003C 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic mb-4">
                            Jackpot<span className="text-[#FF003C]">Global</span>
                        </h2>
                        <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed max-w-sm">
                            DECENTRALIZED GAMING PROTOCOL. IMMUTABLE ODDS. PROVABLY FAIR.
                        </p>
                        <div className="text-xs font-mono font-bold tracking-widest text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-3 py-1.5 inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                            SYSTEM ONLINE
                        </div>
                    </div>

                    {/* Terminal Links */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-3 border-b border-[#FF003C]/30 pb-2 inline-block w-fit relative group">
                            Terminal
                            <div className="absolute -bottom-[1px] left-0 w-1/3 h-[1px] bg-[#FF003C] transition-all duration-300 group-hover:w-full"></div>
                        </h4>
                        <Link
                            href="/docs"
                            className="text-gray-400 hover:text-[#00F0FF] transition-all duration-300 font-mono text-sm hover:translate-x-2 inline-block w-fit"
                        >
                            &gt;&nbsp;_DOCS
                        </Link>
                        <Link
                            href="/contracts"
                            className="text-gray-400 hover:text-[#00F0FF] transition-all duration-300 font-mono text-sm hover:translate-x-2 inline-block w-fit"
                        >
                            &gt;&nbsp;_SMART_CONTRACTS
                        </Link>
                    </div>

                    {/* Network Links */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-3 border-b border-[#FF003C]/30 pb-2 inline-block w-fit relative group">
                            Network
                            <div className="absolute -bottom-[1px] left-0 w-1/3 h-[1px] bg-[#FF003C] transition-all duration-300 group-hover:w-full"></div>
                        </h4>
                        <Link
                            href="https://twitter.com"
                            className="text-gray-400 hover:text-[#FCEE09] transition-all duration-300 font-mono text-sm hover:translate-x-2 inline-block w-fit"
                        >
                            &gt;&nbsp;TWITTER
                        </Link>
                        <Link
                            href="https://discord.com"
                            className="text-gray-400 hover:text-[#FCEE09] transition-all duration-300 font-mono text-sm hover:translate-x-2 inline-block w-fit"
                        >
                            &gt;&nbsp;DISCORD
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-8 border-t border-[#FF003C]/20 flex flex-col items-center justify-center">
                    <p className="text-gray-500 font-mono text-xs tracking-widest">
                        © {new Date().getFullYear()} JACKPOT GLOBAL. ALL RIGHTS RESERVED.
                    </p>
                    <div className="mt-2 text-[#FF003C]/50 font-mono text-[10px]">
                        {"//"} V.1.0.0
                    </div>
                </div>
            </div>
        </footer>
    );
}
