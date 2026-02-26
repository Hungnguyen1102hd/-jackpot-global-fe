'use client';
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useQuery } from "@tanstack/react-query";

const BACKEND_URL =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) ||
    'http://localhost:3001';

export function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(0);
    const t = useTranslations('Hero');

    const { data } = useQuery({
        queryKey: ['next-draw-time'],
        queryFn: async () => {
            const res = await fetch(`${BACKEND_URL}/api/draws/next-time`);
            if (!res.ok) {
                throw new Error('Failed to fetch next draw time');
            }
            return res.json() as Promise<{ nextDrawTimestamp: number }>;
        },
        refetchInterval: 60000,
    });

    useEffect(() => {
        if (!data?.nextDrawTimestamp) return;

        const interval = setInterval(() => {
            const nowSeconds = Math.floor(Date.now() / 1000);
            const diff = data.nextDrawTimestamp - nowSeconds;
            setTimeLeft(diff > 0 ? diff : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [data?.nextDrawTimestamp]);

    const d = Math.floor(timeLeft / (3600 * 24));
    const h = Math.floor((timeLeft % (3600 * 24)) / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;

    const pad = (num: number) => num.toString().padStart(2, "0");

    return (
        <div className="flex flex-col items-center justify-center p-6 border-y-2 md:border-2 border-[#00F0FF] bg-black backdrop-blur-sm shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <h3 className="text-[#00F0FF] font-mono text-sm tracking-widest uppercase mb-4 opacity-80">
                {t('nextDraw')}
            </h3>
            <div className="flex gap-4 md:gap-8 font-mono">
                {[
                    { label: t('days'), value: d },
                    { label: t('hours'), value: h },
                    { label: t('mins'), value: m },
                    { label: t('secs'), value: s },
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] tabular-nums px-2 md:px-4 py-2 bg-[#00F0FF]/10 border border-[#00F0FF]/30">
                            {pad(item.value)}
                        </div>
                        <div className="text-[#00F0FF]/60 text-[10px] md:text-xs tracking-widest mt-2">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
