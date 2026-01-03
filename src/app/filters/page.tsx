'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePhoto } from '@/context/PhotoContext';
import { FILTERS } from '@/config/filters';

const FILTER_COLORS: { [key: string]: { bg: string, gradient: string } } = {
    'none': { bg: 'bg-white', gradient: 'from-gray-100 to-gray-200' },
    'dramatic-warm': { bg: 'bg-orange-400', gradient: 'from-orange-400 to-red-400' },
    'old-film': { bg: 'bg-amber-600', gradient: 'from-amber-500 to-amber-700' },
    'faded-noir': { bg: 'bg-gray-700', gradient: 'from-gray-600 to-gray-800' },
    'cold-noir': { bg: 'bg-blue-400', gradient: 'from-blue-400 to-cyan-500' },
    'arctic-film': { bg: 'bg-sky-400', gradient: 'from-sky-300 to-blue-400' },
    'frozen-mafia': { bg: 'bg-slate-600', gradient: 'from-slate-500 to-slate-700' },
    'ice-faded-film': { bg: 'bg-cyan-400', gradient: 'from-cyan-300 to-teal-400' },
    'dusty-reel': { bg: 'bg-yellow-700', gradient: 'from-yellow-600 to-amber-800' },
    'faded-archive': { bg: 'bg-orange-200', gradient: 'from-orange-100 to-yellow-200' },
    'godfather-warm': { bg: 'bg-orange-900', gradient: 'from-red-900 to-orange-950' },
    'noir-crime-scene': { bg: 'bg-gray-900', gradient: 'from-gray-800 to-black' },
};

export default function FiltersPage() {
    const { capturedImages, selectedFilter, setSelectedFilter } = usePhoto();
    const router = useRouter();
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        if (capturedImages.length === 0) {
            router.push('/capture');
        }
    }, [capturedImages, router]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swiped left - next photo
                setCurrentPhotoIndex(prev => 
                    prev < capturedImages.length - 1 ? prev + 1 : prev
                );
            } else {
                // Swiped right - previous photo
                setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : prev);
            }
        }
    };

    const goToNextPhoto = () => {
        setCurrentPhotoIndex(prev => 
            prev < capturedImages.length - 1 ? prev + 1 : prev
        );
    };

    const goToPrevPhoto = () => {
        setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : prev);
    };

    if (capturedImages.length === 0) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50">
            {/* Logo Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-lg">📷</div>
                <span className="font-bold text-gray-800 text-xs">CozyCam</span>
            </div>

            {/* Title */}
            <div className="text-center animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-black mb-2 text-gray-900">
                    Pick Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">Vibe</span>
                </h1>
                <p className="text-sm text-gray-500 mb-8">Choose a filter for your awesome shots</p>
            </div>

            {/* Large Preview */}
            <div className="w-full max-w-2xl mb-10 px-4 animate-scale-in animate-delay-100">
                <div className="glass-panel p-4 rounded-3xl shadow-2xl overflow-hidden">
                    <div 
                        className="relative"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img
                            src={capturedImages[currentPhotoIndex]}
                            alt="Preview"
                            className="w-full h-auto max-h-[60vh] object-contain rounded-2xl transition-all duration-300"
                            style={{ filter: FILTERS.find(f => f.id === selectedFilter)?.css }}
                        />
                        {/* Filter name overlay */}
                        {selectedFilter !== 'none' && (
                            <div className="absolute bottom-4 left-4 bg-pink-500/90 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg">
                                {FILTERS.find(f => f.id === selectedFilter)?.name}
                            </div>
                        )}
                        {/* Photo counter */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-gray-800 font-semibold text-xs">
                            {currentPhotoIndex + 1} of {capturedImages.length}
                        </div>
                        
                        {/* Navigation arrows */}
                        {capturedImages.length > 1 && (
                            <>
                                {currentPhotoIndex > 0 && (
                                    <button
                                        onClick={goToPrevPhoto}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>
                                )}
                                {currentPhotoIndex < capturedImages.length - 1 && (
                                    <button
                                        onClick={goToNextPhoto}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                        
                        {/* Swipe indicator hint */}
                        {capturedImages.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
                                ← Swipe →
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Grid */}
            <div className="w-full max-w-4xl mb-10 animate-fade-in-up animate-delay-200">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Select Filter</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 px-4">
                    {FILTERS.map((filter) => {
                        const colors = FILTER_COLORS[filter.id] || FILTER_COLORS['none'];
                        return (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${selectedFilter === filter.id
                                    ? 'glass-panel shadow-xl ring-2 ring-pink-500'
                                    : 'glass-panel shadow-md'
                                    }`}
                            >
                                {/* Color circle */}
                                <div
                                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-md flex items-center justify-center overflow-hidden`}>
                                    <img
                                        src={capturedImages[currentPhotoIndex]}
                                        alt={filter.name}
                                        className="w-full h-full object-cover"
                                        style={{ filter: filter.css }}
                                    />
                                </div>

                                {/* Filter name */}
                                <div className="text-center">
                                    <span className="text-xs font-bold text-gray-800 block leading-tight">
                                        {filter.name}
                                    </span>
                                </div>

                                {/* Check mark for selected */}
                                {selectedFilter === filter.id && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => router.push('/capture')}
                    className="px-6 py-3 rounded-full border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-semibold transition">
                    Retake
                </button>
                <button
                    onClick={() => router.push('/collage')}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Next: Layout &rarr;
                </button>
            </div>
        </div>
    );
}
