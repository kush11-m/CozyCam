'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePhoto } from '@/context/PhotoContext';


export default function DownloadPage() {
    const { finalCollage, setCapturedImages, setFinalCollage, setSelectedFilter } = usePhoto();
    const router = useRouter();

    useEffect(() => {
        if (!finalCollage) {
            router.push('/capture');
        }
    }, [finalCollage, router]);

    const handleDownload = () => {
        if (finalCollage) {
            const link = document.createElement('a');
            link.href = finalCollage;
            link.download = `photobooth-strip-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleReset = () => {
        setCapturedImages([]);
        setFinalCollage(null);
        setSelectedFilter('none');
        router.push('/capture');
    };

    if (!finalCollage) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50">
            {/* Logo Header */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-lg">📷</div>
                <span className="font-bold text-gray-800 text-xs">CozyCam</span>
            </div>

            {/* Title */}
            <div className="text-center mb-8 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-black mb-3 text-gray-900 leading-tight">
                    Your Memories Look
                </h1>
                <h2 className="text-5xl md:text-6xl font-black mb-3">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">Amazing!</span>
                    <span className="inline-block ml-2">✨📸</span>
                </h2>
                <p className="text-gray-500 text-sm">Ready to save and share</p>
            </div>

            {/* Strip Preview */}
            <div className="relative glass-panel p-6 rounded-3xl shadow-2xl mb-10 transform hover:scale-[1.02] transition duration-500 animate-scale-in animate-delay-100">
                <img
                    src={finalCollage}
                    alt="Final Strip"
                    className="max-h-[50vh] w-auto shadow-lg rounded-2xl"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-sm animate-fade-in-up animate-delay-200">
                <button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-10 py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
                >
                    Download Collage
                </button>

                <button
                    onClick={handleReset}
                    className="text-gray-500 hover:text-gray-800 transition py-3 text-sm font-medium"
                >
                    Create Another One
                </button>
            </div>
        </div>
    );
}
