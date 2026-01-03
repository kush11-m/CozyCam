'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePhoto } from '@/context/PhotoContext';
import { FILTERS } from '@/config/filters';
import { drawCollage } from '@/utils/collageLayouts';
import type { CollageLayout } from '@/context/PhotoContext';

const FRAME_COLORS = [
    { name: 'Classic Black', color: '#1a1625' },
    { name: 'Pure White', color: '#ffffff' },
    { name: 'Soft Pink', color: '#fce7f3' },
    { name: 'Vintage Cream', color: '#fef3c7' },
    { name: 'Sky Blue', color: '#dbeafe' },
    { name: 'Mint Green', color: '#d1fae5' },
    { name: 'Lavender', color: '#e9d5ff' },
    { name: 'Coral', color: '#fed7d7' },
];

const LAYOUTS: { id: CollageLayout; name: string; icon: string; description: string }[] = [
    { id: 'classic-strip', name: 'Classic Strip', icon: '📸', description: 'Vertical photo strip' },
    { id: 'grid-3x1', name: 'Horizontal Strip', icon: '▭', description: '3 Photos Horizontal' },
    { id: 'grid-2x2', name: 'Grid 2×2', icon: '⊞', description: '4 Photos Square' },
    { id: 'grid-2x3', name: 'Grid 2×3', icon: '▦', description: '6 Photos Grid' },
    { id: 'grid-2x4', name: 'Grid 2×4', icon: '▒', description: '8 Photos Grid' },
];

export default function CollagePage() {
    const router = useRouter();
    const { capturedImages, selectedFilter, frameColor, collageLayout, setFinalCollage, setFrameColor, setCollageLayout } = usePhoto();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    // Filter layouts based on photo count
    const compatibleLayouts = LAYOUTS.filter(layout => {
        if (layout.id === 'classic-strip') return true;
        if (layout.id === 'grid-3x1' && capturedImages.length === 3) return true;
        if (layout.id === 'grid-2x2' && capturedImages.length === 4) return true;
        if (layout.id === 'grid-2x3' && capturedImages.length === 6) return true;
        if (layout.id === 'grid-2x4' && capturedImages.length === 8) return true;
        return false;
    });

    // Auto-select a valid layout if current one is invalid
    useEffect(() => {
        const isValid = compatibleLayouts.some(l => l.id === collageLayout);
        if (!isValid && compatibleLayouts.length > 0) {
            setCollageLayout(compatibleLayouts[0].id);
        }
    }, [capturedImages.length, compatibleLayouts, collageLayout, setCollageLayout]);

    const generateCollage = async () => {
        if (capturedImages.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Load All Images
        const loadedImages = await Promise.all(
            capturedImages.map(src => {
                return new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.src = src;
                });
            })
        );

        // Get selected filter configuration
        const selectedFilterConfig = FILTERS.find(f => f.id === selectedFilter) || FILTERS[0];

        // Draw collage with selected layout and frame color
        drawCollage(ctx, loadedImages, collageLayout, frameColor, selectedFilterConfig);

        // Done
        setIsGenerating(false);
    };

    useEffect(() => {
        if (capturedImages.length === 0) {
            router.push('/capture');
            return;
        }

        generateCollage();
    }, [capturedImages, selectedFilter, frameColor, collageLayout, router]);



    const handleProceed = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
            setFinalCollage(dataUrl);
            router.push('/download');
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50">
            {/* Logo Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-lg">📷</div>
                <span className="font-bold text-gray-800 text-xs">CozyCam</span>
            </div>

            <h1 className="text-3xl font-black mb-8 text-gray-900 text-center animate-fade-in-up">
                Customize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">Collage</span>
            </h1>

            {/* Customization Panel */}
            <div className="w-full max-w-4xl mb-6 glass-panel p-4 md:p-6 rounded-3xl shadow-xl animate-fade-in-up animate-delay-100">
                {/* Layout Selection */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Layout Style</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {compatibleLayouts.map((layout) => (
                            <button
                                key={layout.id}
                                onClick={() => setCollageLayout(layout.id)}
                                className={`p-4 rounded-2xl border-2 transition-all text-center ${collageLayout === layout.id
                                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{layout.icon}</div>
                                <div className="text-xs font-bold text-gray-800">{layout.name}</div>
                                <div className="text-[10px] text-gray-500 mt-1">{layout.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frame Color Selection */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Frame Color</h3>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {FRAME_COLORS.map((frame) => (
                            <button
                                key={frame.color}
                                onClick={() => setFrameColor(frame.color)}
                                className={`relative p-1 rounded-xl border-2 transition-all ${frameColor === frame.color
                                    ? 'border-pink-500 shadow-lg'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                title={frame.name}
                            >
                                <div
                                    className="w-full h-12 rounded-lg border border-gray-200"
                                    style={{ backgroundColor: frame.color }}
                                />
                                {frameColor === frame.color && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative glass-panel p-6 rounded-3xl shadow-2xl mb-8 transform hover:scale-[1.02] transition duration-500 animate-scale-in animate-delay-200">
                <canvas
                    ref={canvasRef}
                    className="max-h-[50vh] w-auto shadow-lg rounded-2xl"
                />
            </div>

            <div className="flex gap-4 animate-fade-in-up animate-delay-300">
                <button
                    onClick={() => router.push('/filters')}
                    className="px-6 py-3 rounded-full border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-semibold transition">
                    Adjust Filter
                </button>
                <button
                    onClick={handleProceed}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    View & Download &rarr;
                </button>
            </div>
        </div>
    );
}
