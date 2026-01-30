import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import {
    Camera, CameraOff, Maximize2, Minimize2,
    FlipHorizontal, Sparkles, X, Settings2,
    Sun, Contrast, Palette
} from 'lucide-react';
import { useExperienceStore } from '../../store/useExperienceStore';

interface CameraFilters {
    brightness: number;
    contrast: number;
    saturate: number;
    blur: number;
    hueRotate: number;
}

const DEFAULT_FILTERS: CameraFilters = {
    brightness: 1.0,
    contrast: 1.0,
    saturate: 1.1,
    blur: 0,
    hueRotate: 0
};

const FILTER_PRESETS = [
    { name: 'Normal', icon: '✨', filters: { brightness: 1.0, contrast: 1.0, saturate: 1.1, blur: 0, hueRotate: 0 } },
    { name: 'Beauty', icon: '💖', filters: { brightness: 1.05, contrast: 0.95, saturate: 1.05, blur: 1, hueRotate: 0 } },
    { name: 'Warm', icon: '🌅', filters: { brightness: 1.05, contrast: 1.05, saturate: 1.2, blur: 0, hueRotate: -10 } },
    { name: 'Cool', icon: '💎', filters: { brightness: 1.0, contrast: 1.05, saturate: 0.9, blur: 0, hueRotate: 20 } },
    { name: 'Vintage', icon: '🌸', filters: { brightness: 1.1, contrast: 0.9, saturate: 0.8, blur: 0.5, hueRotate: -15 } },
] as const;

export const CameraOverlay: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const hideControlsTimer = useRef<number | null>(null);

    // Local state
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isMirrored, setIsMirrored] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [filters, setFilters] = useState<CameraFilters>(DEFAULT_FILTERS);
    const [showFilters, setShowFilters] = useState(false);

    // Store state - sync camera info để ScreenshotButton có thể sử dụng
    const isCameraEnabled = useExperienceStore(s => s.isCameraEnabled);
    const setCameraEnabled = useExperienceStore(s => s.setCameraEnabled);
    const setCameraVideoRef = useExperienceStore(s => s.setCameraVideoRef);
    const cameraPosition = useExperienceStore(s => s.cameraPosition);
    const setCameraPosition = useExperienceStore(s => s.setCameraPosition);
    const cameraSize = useExperienceStore(s => s.cameraSize);

    // Hover handlers
    const handleMouseEnter = useCallback(() => {
        if (hideControlsTimer.current) {
            clearTimeout(hideControlsTimer.current);
            hideControlsTimer.current = null;
        }
        setShowControls(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (isExpanded || showFilters) return;
        hideControlsTimer.current = window.setTimeout(() => {
            setShowControls(false);
        }, 500);
    }, [isExpanded, showFilters]);

    useEffect(() => {
        return () => {
            if (hideControlsTimer.current) {
                clearTimeout(hideControlsTimer.current);
            }
        };
    }, []);

    // Start camera
    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setCameraVideoRef(videoRef.current);
            }
        } catch (error) {
            console.error('Failed to access camera:', error);
            setCameraEnabled(false);
        }
    }, [setCameraEnabled, setCameraVideoRef]);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraVideoRef(null);
    }, [stream, setCameraVideoRef]);

    // Toggle camera
    const toggleCamera = useCallback(() => {
        if (isCameraEnabled) {
            stopCamera();
            setCameraEnabled(false);
        } else {
            setCameraEnabled(true);
            startCamera();
        }
    }, [isCameraEnabled, startCamera, stopCamera, setCameraEnabled]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Sync video ref when stream changes
    useEffect(() => {
        if (videoRef.current && stream) {
            setCameraVideoRef(videoRef.current);
        }
    }, [stream, setCameraVideoRef]);

    // CSS filter
    const getFilterStyle = (): string => {
        return `brightness(${filters.brightness}) contrast(${filters.contrast}) saturate(${filters.saturate}) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg)`;
    };

    const applyPreset = (preset: typeof FILTER_PRESETS[number]) => {
        setFilters(preset.filters);
    };

    const updateFilter = (key: keyof CameraFilters, value: number) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Handle drag end - update store
    const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
        setCameraPosition({
            x: cameraPosition.x + info.offset.x,
            y: cameraPosition.y + info.offset.y
        });
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                    fixed bottom-4 left-1/2 -translate-x-1/2 z-50 
                    p-3 rounded-full shadow-lg backdrop-blur-md
                    transition-all pointer-events-auto
                    ${isCameraEnabled
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-2 border-pink-300/50'
                        : 'bg-black/60 text-white/80 border border-white/10 hover:bg-black/80'
                    }
                `}
                onClick={toggleCamera}
                title={isCameraEnabled ? 'Tắt camera' : 'Bật camera'}
            >
                {isCameraEnabled ? <CameraOff size={22} /> : <Camera size={22} />}
            </motion.button>

            {/* Camera Preview Window - Viền cute và sang trọng */}
            <AnimatePresence>
                {isCameraEnabled && (
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: cameraPosition.x,
                            y: cameraPosition.y,
                            width: isExpanded ? 320 : cameraSize.width,
                            height: isExpanded ? 240 : cameraSize.height
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        drag
                        dragControls={dragControls}
                        dragMomentum={false}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        className="fixed z-50 cursor-move pointer-events-auto"
                        style={{ touchAction: 'none', top: 0, left: 0 }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Outer Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400/30 via-rose-300/30 to-pink-400/30 rounded-2xl blur-md" />

                        {/* Main Container - Viền đơn giản nhưng đẹp */}
                        <div className="relative w-full h-full rounded-xl overflow-hidden
                                        border-2 border-pink-200/40
                                        shadow-[0_4px_30px_rgba(236,72,153,0.2),inset_0_0_20px_rgba(255,255,255,0.05)]
                                        bg-black/20">

                            {/* Corner Decorations - Cute & Sang trọng */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-pink-300/60 rounded-tl-lg z-10" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-pink-300/60 rounded-tr-lg z-10" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-pink-300/60 rounded-bl-lg z-10" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-300/60 rounded-br-lg z-10" />

                            {/* Video */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{
                                    filter: getFilterStyle(),
                                    transform: isMirrored ? 'scaleX(-1)' : 'none'
                                }}
                            />

                            {/* Controls Overlay */}
                            <AnimatePresence>
                                {showControls && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"
                                    >
                                        {/* Top Bar */}
                                        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setIsMirrored(!isMirrored)}
                                                    className="p-1.5 rounded-lg bg-black/40 text-white/80 hover:bg-black/60 transition-colors"
                                                    title="Lật gương"
                                                >
                                                    <FlipHorizontal size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setIsExpanded(!isExpanded)}
                                                    className="p-1.5 rounded-lg bg-black/40 text-white/80 hover:bg-black/60 transition-colors"
                                                    title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                                                >
                                                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                                </button>
                                            </div>
                                            <button
                                                onClick={toggleCamera}
                                                className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                                title="Đóng camera"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        {/* Bottom Bar - Filter Presets */}
                                        <div className="absolute bottom-0 left-0 right-0 p-2">
                                            <div className="flex gap-1 justify-center">
                                                {FILTER_PRESETS.map((preset) => (
                                                    <button
                                                        key={preset.name}
                                                        onClick={() => applyPreset(preset)}
                                                        className={`
                                                            px-2 py-1 rounded-full text-[10px] font-medium
                                                            transition-all hover:scale-105
                                                            ${filters.brightness === preset.filters.brightness && filters.saturate === preset.filters.saturate
                                                                ? 'bg-pink-500 text-white'
                                                                : 'bg-black/40 text-white/80 hover:bg-black/60'
                                                            }
                                                        `}
                                                        title={preset.name}
                                                    >
                                                        {preset.icon}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setShowFilters(!showFilters)}
                                                    className={`
                                                        p-1.5 rounded-full transition-all
                                                        ${showFilters ? 'bg-pink-500 text-white' : 'bg-black/40 text-white/80 hover:bg-black/60'}
                                                    `}
                                                    title="Tùy chỉnh filter"
                                                >
                                                    <Settings2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Filter Panel */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="absolute left-full top-0 ml-2 w-48 bg-black/80 backdrop-blur-lg rounded-xl p-3 border border-white/10 shadow-xl"
                                    >
                                        <div className="text-xs text-white/60 mb-2 flex items-center gap-1">
                                            <Sparkles size={12} />
                                            Tùy chỉnh Filter
                                        </div>

                                        {/* Brightness */}
                                        <label className="flex items-center gap-2 text-[10px] text-white/80 mb-2">
                                            <Sun size={10} />
                                            Sáng
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="1.5"
                                                step="0.05"
                                                value={filters.brightness}
                                                onChange={(e) => updateFilter('brightness', parseFloat(e.target.value))}
                                                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-pink-500"
                                            />
                                        </label>

                                        {/* Contrast */}
                                        <label className="flex items-center gap-2 text-[10px] text-white/80 mb-2">
                                            <Contrast size={10} />
                                            Tương phản
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="1.5"
                                                step="0.05"
                                                value={filters.contrast}
                                                onChange={(e) => updateFilter('contrast', parseFloat(e.target.value))}
                                                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-pink-500"
                                            />
                                        </label>

                                        {/* Saturation */}
                                        <label className="flex items-center gap-2 text-[10px] text-white/80 mb-2">
                                            <Palette size={10} />
                                            Bão hòa
                                            <input
                                                type="range"
                                                min="0"
                                                max="2"
                                                step="0.1"
                                                value={filters.saturate}
                                                onChange={(e) => updateFilter('saturate', parseFloat(e.target.value))}
                                                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-pink-500"
                                            />
                                        </label>

                                        {/* Blur/Beauty */}
                                        <label className="flex items-center gap-2 text-[10px] text-white/80">
                                            <Sparkles size={10} />
                                            Làm mịn
                                            <input
                                                type="range"
                                                min="0"
                                                max="3"
                                                step="0.5"
                                                value={filters.blur}
                                                onChange={(e) => updateFilter('blur', parseFloat(e.target.value))}
                                                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-pink-500"
                                            />
                                        </label>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
