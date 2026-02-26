"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
    { code: "en", label: "🇺🇸 English" },
    { code: "vi", label: "🇻🇳 Tiếng Việt" },
    { code: "ko", label: "🇰🇷 한국어" },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeLanguage = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[1];

    const switchLanguage = (newLocale: string) => {
        setIsOpen(false);
        router.replace(pathname, { locale: newLocale });
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-black border border-[#00F0FF]/50 text-[#00F0FF] text-sm font-mono hover:bg-[#00F0FF]/10 hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all duration-300 transform-gpu"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
            >
                <span>{activeLanguage.label}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-black border border-[#39FF14] shadow-[0_4px_15px_rgba(57,255,20,0.2)] z-50 flex flex-col pointer-events-auto origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="absolute -top-[1px] left-0 w-full h-[1px] bg-[#39FF14] opacity-50"></div>
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            className={`px-4 py-3 text-left font-mono text-sm transition-colors duration-200
                                ${locale === lang.code
                                    ? "text-[#39FF14] bg-[#39FF14]/10"
                                    : "text-gray-300 hover:text-white hover:bg-[#39FF14]/5"
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
