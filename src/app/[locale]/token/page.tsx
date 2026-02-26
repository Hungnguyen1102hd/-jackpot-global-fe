'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Coins, Flame, CheckCircle } from 'lucide-react';

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000';

const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

export default function TokenPage() {
    const t = useTranslations('TokenInfo');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(tokenAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="flex flex-col items-center w-full relative overflow-hidden min-h-screen text-white pb-20">
            {/* Background glow effects */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <motion.div
                className="w-full max-w-5xl px-4 flex flex-col gap-24 mt-20"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.2 } },
                    hidden: {}
                }}
            >
                {/* Section 1: Hero */}
                <motion.section variants={fadeUpVariant} className="flex flex-col items-center text-center gap-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#00F0FF] drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
                        {t('heroDesc')}
                    </p>

                    <div className="mt-6 flex flex-col items-center gap-3 relative">
                        <span className="text-sm uppercase tracking-widest text-white/60">{t('contractLabel')}</span>
                        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-[#39FF14]/30 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                            <span className="font-mono text-[#39FF14] md:text-lg tracking-wider break-all">{tokenAddress}</span>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-[#39FF14]/20 rounded-lg transition-colors group relative border border-transparent hover:border-[#39FF14]/50 cursor-pointer"
                                aria-label={t('copyToClipboard')}
                            >
                                <Copy className="w-5 h-5 text-[#39FF14]" />
                            </button>
                        </div>
                        {/* Toast Notification */}
                        <AnimatePresence>
                            {copied && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                    className="absolute -bottom-14 bg-[#39FF14] text-black font-bold px-4 py-2 text-sm shadow-[0_0_15px_#39FF14]"
                                    style={{
                                        clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
                                    }}
                                >
                                    {t('copied')}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Section 2: Tokenomics */}
                <motion.section variants={fadeUpVariant} className="flex flex-col items-center gap-12">
                    <div className="text-center">
                        <h2 className="text-2xl text-white/60 uppercase tracking-widest mb-4">{t('totalSupplyLabel')}</h2>
                        <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            {t('totalSupplyValue')}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-8">
                        {/* Tax Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-black/30 backdrop-blur-md border border-[#00F0FF]/40 rounded-2xl p-8 flex flex-col items-start gap-4 shadow-[0_0_30px_rgba(0,240,255,0.1)] hover:shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:border-[#00F0FF] transition-all duration-300"
                        >
                            <div className="bg-[#00F0FF]/20 p-4 rounded-xl">
                                <Coins className="w-8 h-8 text-[#00F0FF]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#00F0FF] mt-2">{t('taxTitle')}</h3>
                            <p className="text-white/70 leading-relaxed text-lg">{t('taxDesc')}</p>
                        </motion.div>

                        {/* Burn Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-black/30 backdrop-blur-md border border-[#FF3939]/40 rounded-2xl p-8 flex flex-col items-start gap-4 shadow-[0_0_30px_rgba(255,57,57,0.1)] hover:shadow-[0_0_40px_rgba(255,57,57,0.2)] hover:border-[#FF3939] transition-all duration-300"
                        >
                            <div className="bg-[#FF3939]/20 p-4 rounded-xl">
                                <Flame className="w-8 h-8 text-[#FF3939]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#FF3939] mt-2">{t('burnTitle')}</h3>
                            <p className="text-white/70 leading-relaxed text-lg">{t('burnDesc')}</p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Section 3: Utilities */}
                <motion.section variants={fadeUpVariant} className="flex flex-col items-center gap-10">
                    <h2 className="text-3xl font-black uppercase tracking-widest text-center border-b border-white/30 pb-4">
                        {t('utilitiesTitle')}
                    </h2>

                    <div className="flex flex-col gap-6 w-full max-w-2xl bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        {[t('util1'), t('util2'), t('util3')].map((text, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="mt-1">
                                    <CheckCircle className="w-6 h-6 text-[#39FF14]" />
                                </div>
                                <p className="text-xl text-white/90 leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Section 4: Call to Action */}
                <motion.section variants={fadeUpVariant} className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
                    <Link href="/buy-ticket" className="px-10 py-5 bg-[#39FF14] text-black font-black uppercase tracking-widest sm:text-lg
                             hover:bg-white hover:drop-shadow-[0_0_20px_#39FF14] hover:-translate-y-1
                             transition-all duration-300 transform-gpu text-center flex-1 sm:flex-none"
                        style={{
                            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)"
                        }}>
                        {t('playLotteryBtn')}
                    </Link>

                    <a href="#" className="px-10 py-5 bg-transparent text-white border-2 border-white/20 font-bold uppercase tracking-widest sm:text-lg
                             hover:border-[#00F0FF] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]
                             transition-all duration-300 text-center flex-1 sm:flex-none"
                        style={{
                            clipPath: "polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)"
                        }}>
                        {t('buyJpkBtn')}
                    </a>
                </motion.section>

            </motion.div>
        </div>
    );
}
