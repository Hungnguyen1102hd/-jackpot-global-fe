"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Whitepaper() {
    const t = useTranslations("Whitepaper");

    // Animation Variants
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemVariants: any = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 pt-32 pb-20 overflow-hidden relative">
            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Glowing Accent Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#39FF14] rounded-full blur-[150px] opacity-[0.05] pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#00F0FF] rounded-full blur-[150px] opacity-[0.05] pointer-events-none -translate-y-1/2"></div>

            <motion.main
                className="container max-w-4xl mx-auto px-4 relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center mb-16 relative">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                        {t("title")}
                    </h1>
                    <h2 className="text-xl md:text-2xl text-[#39FF14] font-medium tracking-widest uppercase drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">
                        {t("subtitle")}
                    </h2>
                    {/* Decorative Line Under Header */}
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent mx-auto mt-6"></div>
                </motion.div>

                <div className="space-y-10">

                    {/* 1. Project Summary */}
                    <motion.section variants={itemVariants} className="group relative">
                        {/* Glow Behind Card */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14] to-transparent rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

                        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-[#39FF14]/50 transition-colors duration-300">
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase flex items-center gap-3">
                                <span className="w-2 h-8 bg-[#39FF14] inline-block shadow-[0_0_8px_#39FF14]"></span>
                                {t("summary.title")}
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-300">
                                {t("summary.content")}
                            </p>
                        </div>
                    </motion.section>

                    {/* 2. Problem & Solution */}
                    <motion.section variants={itemVariants} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3939] via-transparent to-[#00F0FF] rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

                        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-white/30 transition-colors duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase flex items-center gap-3">
                                <span className="w-2 h-8 bg-[#00F0FF] inline-block shadow-[0_0_8px_#00F0FF]"></span>
                                {t("problemSolution.title")}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Problem Block */}
                                <div className="p-5 rounded-lg bg-black/40 border border-[#FF3939]/30 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF3939] opacity-[0.05] rounded-bl-full"></div>
                                    <h3 className="text-xl font-bold text-[#FF3939] mb-2">{t("problemSolution.problemTitle")}</h3>
                                    <p className="text-gray-400">{t("problemSolution.problemDesc")}</p>
                                </div>
                                {/* Solution Block */}
                                <div className="p-5 rounded-lg bg-black/40 border border-[#00F0FF]/30 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#00F0FF] opacity-[0.05] rounded-bl-full"></div>
                                    <h3 className="text-xl font-bold text-[#00F0FF] mb-2">{t("problemSolution.solutionTitle")}</h3>
                                    <p className="text-gray-300">{t("problemSolution.solutionDesc")}</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 3. Tokenomics */}
                    <motion.section variants={itemVariants} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FCEE09] to-transparent rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

                        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-[#FCEE09]/50 transition-colors duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase flex items-center gap-3">
                                <span className="w-2 h-8 bg-[#FCEE09] inline-block shadow-[0_0_8px_#FCEE09]"></span>
                                {t("tokenomics.title")}
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 p-4 rounded-lg bg-black/30 border border-white/5 hover:bg-black/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#FCEE09]/20 flex items-center justify-center shrink-0 border border-[#FCEE09]/50 shadow-[0_0_10px_rgba(252,238,9,0.2)]">
                                        <div className="w-2 h-2 rounded-full bg-[#FCEE09]"></div>
                                    </div>
                                    <span className="text-lg font-medium text-gray-200 pt-1">{t("tokenomics.totalSupply")}</span>
                                </li>
                                <li className="flex items-start gap-4 p-4 rounded-lg bg-black/30 border border-white/5 hover:bg-black/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 flex items-center justify-center shrink-0 border border-[#39FF14]/50 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                                        <div className="w-2 h-2 rounded-full bg-[#39FF14]"></div>
                                    </div>
                                    <span className="text-lg font-medium text-gray-200 pt-1">{t("tokenomics.tax")}</span>
                                </li>
                                <li className="flex items-start gap-4 p-4 rounded-lg bg-black/30 border border-white/5 hover:bg-black/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#FF3939]/20 flex items-center justify-center shrink-0 border border-[#FF3939]/50 shadow-[0_0_10px_rgba(255,57,57,0.2)]">
                                        <div className="w-2 h-2 rounded-full bg-[#FF3939]"></div>
                                    </div>
                                    <span className="text-lg font-medium text-gray-200 pt-1">{t("tokenomics.burn")}</span>
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* 4. Game Mechanics */}
                    <motion.section variants={itemVariants} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-transparent rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

                        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-purple-500/50 transition-colors duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase flex items-center gap-3">
                                <span className="w-2 h-8 bg-purple-500 inline-block shadow-[0_0_8px_#A855F7]"></span>
                                {t("gameMechanics.title")}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { label: t("gameMechanics.ticketPrice"), icon: "🎟️" },
                                    { label: t("gameMechanics.rules"), icon: "🎯" },
                                    { label: t("gameMechanics.schedule"), icon: "⏱️" },
                                    { label: t("gameMechanics.prize"), icon: "🏆" }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-lg flex items-center gap-4 hover:border-purple-500/30 transition-colors">
                                        <span className="text-2xl grayscale opacity-70">{item.icon}</span>
                                        <span className="text-gray-300 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* 5. Technology */}
                    <motion.section variants={itemVariants} className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00F0FF] to-transparent rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

                        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-[#00F0FF]/50 transition-colors duration-300">
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase flex items-center gap-3">
                                <span className="w-2 h-8 bg-[#00F0FF] inline-block shadow-[0_0_8px_#00F0FF]"></span>
                                {t("technology.title")}
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-300 font-mono bg-black/50 p-6 rounded-lg border border-[#00F0FF]/20 shadow-inner">
                                <span className="text-[#00F0FF]">{`> `}</span>
                                {t("technology.stack")}
                                <span className="animate-pulse">_</span>
                            </p>
                        </div>
                    </motion.section>

                    {/* 6. Roadmap (Vertical Timeline) */}
                    <motion.section variants={itemVariants} className="mt-16">
                        <h2 className="text-3xl font-bold text-center text-white mb-12 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                            {t("roadmap.title")}
                        </h2>

                        <div className="relative border-l-2 border-white/10 ml-4 md:ml-10 space-y-12">
                            {[
                                { text: t("roadmap.phase1"), color: "bg-[#39FF14]", shadow: "shadow-[0_0_15px_#39FF14]", glowBorder: "hover:border-[#39FF14]/50", markerBorder: "border-[#39FF14]" },
                                { text: t("roadmap.phase2"), color: "bg-[#00F0FF]", shadow: "shadow-[0_0_15px_#00F0FF]", glowBorder: "hover:border-[#00F0FF]/50", markerBorder: "border-[#00F0FF]" },
                                { text: t("roadmap.phase3"), color: "bg-[#FCEE09]", shadow: "shadow-[0_0_15px_#FCEE09]", glowBorder: "hover:border-[#FCEE09]/50", markerBorder: "border-[#FCEE09]" },
                                { text: t("roadmap.phase4"), color: "bg-purple-500", shadow: "shadow-[0_0_15px_#A855F7]", glowBorder: "hover:border-purple-500/50", markerBorder: "border-purple-500" }
                            ].map((phase, idx) => (
                                <div key={idx} className="relative pl-8 md:pl-12 group">
                                    {/* Timeline Node */}
                                    <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ${phase.color} ${phase.shadow} flex items-center justify-center`}>
                                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl transition-all duration-300 ${phase.glowBorder} group-hover:-translate-y-1`}>
                                        <div className={`absolute left-0 top-0 w-1 h-full rounded-l-xl ${phase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                        <p className="text-lg font-bold text-gray-200">
                                            {phase.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </motion.main>
        </div>
    );
}
