import React from 'react';
import { Download, X } from 'lucide-react';
import { useExperienceStore } from '../../store/useExperienceStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ScreenshotPreview: React.FC = () => {
    const capturedImage = useExperienceStore(s => s.capturedImage);
    const setCapturedImage = useExperienceStore(s => s.setCapturedImage);
    const selectedFrame = useExperienceStore(s => s.selectedFrame) || 'classic';

    if (!capturedImage) return null;

    const handleDownload = () => {
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
        link.setAttribute("download", `valentine-gift-${timestamp}.png`);
        link.setAttribute("href", capturedImage);
        link.click();
    };

    const handleClose = () => {
        setCapturedImage(null);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-lg p-4 overflow-hidden pointer-events-auto"
            >
                <div className="flex flex-col items-center justify-center w-full h-full max-h-screen">
                    {/* The Framed Photo Container - Scaled Down */}
                    <motion.div
                        initial={{ scale: 0.5, rotate: -5, y: 100 }}
                        animate={{ scale: 1, rotate: 0, y: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="relative max-w-[85vw] md:max-w-[65vw]"
                    >
                        {/* 1. CLASSIC STYLE */}
                        {selectedFrame === 'classic' && (
                            <div className="bg-white p-3 shadow-2xl border border-[#E8AEB7]/30 rounded-[10px]">
                                <div className="relative">
                                    <img src={capturedImage} alt="Captured" className="max-h-[45vh] w-auto object-contain block rounded-[4px]" />
                                    <div className="absolute inset-0 border border-[#E8AEB7]/20 rounded-[4px] pointer-events-none" />
                                </div>
                                <div className="mt-3 text-center">
                                    <div className="text-[#E8AEB7] text-[10px] tracking-[0.2em] font-serif uppercase">
                                        Valentine 2026
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. KAWAII STYLE - Refined */}
                        {selectedFrame === 'cute' && (
                            <div className="bg-[#FFF5F7] p-4 border-[3px] border-pink-300 rounded-[30px] shadow-2xl relative overflow-visible">
                                <div className="absolute -top-5 left-4 text-3xl animate-bounce">🎀</div>
                                <div className="absolute -bottom-4 -right-2 text-3xl rotate-12">💖</div>
                                <img src={capturedImage} alt="Captured" className="max-h-[45vh] w-auto object-contain block rounded-[20px] border-2 border-white shadow-sm" />
                                <div className="mt-3 flex justify-center">
                                    <div className="text-pink-400 font-bold text-[11px] tracking-[0.2em] bg-white/80 px-4 py-1 rounded-full shadow-sm border border-pink-100">
                                        ✨ SWEET MOMENT ✨
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. ROSE GOLD STYLE - Enhanced */}
                        {selectedFrame === 'rose' && (
                            <div className="bg-[#2a1a1c] p-4 border-[2px] border-[#b76e79] shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-1.5 border border-[#b76e79]/30" />
                                <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#b76e79]/20 rounded-full blur-2xl" />
                                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#b76e79]/20 rounded-full blur-2xl" />

                                <img src={capturedImage} alt="Captured" className="max-h-[45vh] w-auto object-contain block relative z-10 border border-[#b76e79]/40" />

                                <div className="mt-4 text-center relative z-10">
                                    <div className="text-[#b76e79] font-serif italic text-lg tracking-[0.15em] drop-shadow-sm">
                                        Eternal Bloom
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. CRYSTAL STYLE - NEW */}
                        {selectedFrame === 'crystal' && (
                            <div className="bg-white/10 backdrop-blur-md p-3 border border-white/40 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 via-transparent to-blue-200/20 pointer-events-none" />
                                <div className="absolute top-2 right-2 text-white/80 animate-pulse">✦</div>
                                <div className="absolute bottom-2 left-2 text-white/80 animate-pulse delay-700">✧</div>
                                <img src={capturedImage} alt="Captured" className="max-h-[45vh] w-auto object-contain block shadow-2xl border border-white/20" />
                                <div className="mt-3 text-center">
                                    <div className="text-white text-[9px] font-light tracking-[0.4em] uppercase opacity-60">
                                        Crystal Clear Memory
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. FLORAL STYLE - NEW */}
                        {selectedFrame === 'floral' && (
                            <div className="bg-[#f0f9f1] p-4 border-[8px] border-white rounded-sm shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-40">🌸</div>
                                <div className="absolute bottom-0 left-0 p-1 opacity-40">🌷</div>
                                <img src={capturedImage} alt="Captured" className="max-h-[45vh] w-auto object-contain block border border-green-100 shadow-sm" />
                                <div className="mt-2 text-center">
                                    <div className="text-green-800/60 font-serif italic text-sm tracking-widest">
                                        Spring Love
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. CINEMATIC STYLE */}
                        {selectedFrame === 'cinematic' && (
                            <div className="bg-black shadow-2xl overflow-hidden rounded-md border border-white/10">
                                <div className="bg-black py-2 px-6 flex justify-between items-center">
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                    <span className="text-white/40 text-[8px] tracking-[0.3em] uppercase">Recording</span>
                                </div>
                                <img src={capturedImage} alt="Captured" className="max-h-[45vh] w-auto object-contain block shadow-lg" />
                                <div className="bg-black py-3 px-6 flex justify-center items-center">
                                    <span className="text-white/40 text-[8px] tracking-[0.5em] uppercase font-sans">Cinematic Memory</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Controls */}
                    <div className="flex items-center gap-10 mt-8 mb-4">
                        <button
                            onClick={handleClose}
                            className="group flex flex-col items-center gap-2 text-white/50 hover:text-white transition-all opacity-80"
                        >
                            <div className="p-2.5 rounded-full border border-white/20 group-hover:bg-white/10 transition-all">
                                <X size={20} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest">Bỏ qua</span>
                        </button>

                        <button
                            onClick={handleDownload}
                            className="group flex flex-col items-center gap-2 text-white"
                        >
                            <div className="p-3.5 rounded-full bg-pink-500 shadow-xl shadow-pink-500/30 group-hover:scale-110 group-hover:bg-pink-600 transition-all">
                                <Download size={24} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-pink-300">Lưu ảnh</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
