"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function Header() {
    const t = useTranslations("Header");
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 w-full z-50 transition-colors duration-300 border-b-2 ${isScrolled
                ? "bg-black/90 backdrop-blur-none py-3 border-[#39FF14] shadow-[0_4px_20px_rgba(57,255,20,0.15)]"
                : "bg-black py-5 border-transparent"
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Brand */}
                <Link href="/" className="group relative">
                    <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                        Jackpot<span className="text-[#39FF14]">Global</span>
                    </h1>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#39FF14] transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_8px_#39FF14]"></div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex gap-8 items-center">
                    <Link
                        href="/token"
                        className="text-gray-300 hover:text-[#39FF14] transition-all duration-300 uppercase font-bold text-sm tracking-widest hover:drop-shadow-[0_0_8px_#39FF14] hover:-translate-y-0.5"
                    >
                        {t('token')}
                    </Link>
                    <Link
                        href="/buy-ticket"
                        className="text-gray-300 hover:text-[#00F0FF] transition-all duration-300 uppercase font-bold text-sm tracking-widest hover:drop-shadow-[0_0_8px_#00F0FF] hover:-translate-y-0.5"
                    >
                        {t('buyTicket')}
                    </Link>
                    <Link
                        href="/history"
                        className="text-gray-300 hover:text-[#FF3939] transition-all duration-300 uppercase font-bold text-sm tracking-widest hover:drop-shadow-[0_0_8px_#FF3939] hover:-translate-y-0.5"
                    >
                        {t('history')}
                    </Link>
                    <Link
                        href="/my-tickets"
                        className="text-gray-300 hover:text-[#FCEE09] transition-all duration-300 uppercase font-bold text-sm tracking-widest hover:drop-shadow-[0_0_8px_#FCEE09] hover:-translate-y-0.5"
                    >
                        {t('leaderboard')}
                    </Link>
                </nav>

                {/* Action */}
                <div className="flex items-center gap-4 relative z-10">
                    <LanguageSwitcher />
                    <ConnectButton
                        accountStatus="avatar"
                        chainStatus="icon"
                        showBalance={false}
                    />
                </div>
            </div>

            {/* Decorative Cyberpunk Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-50"></div>
        </motion.header>
    );
}
