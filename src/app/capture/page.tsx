'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePhoto } from '@/context/PhotoContext';
import Link from 'next/link';

export default function CapturePage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [isSetup, setIsSetup] = useState(true);
    const [showFlash, setShowFlash] = useState(false);

    // Pause State
    const [isPaused, setIsPaused] = useState(false);
    const isPausedRef = useRef(false); // Ref for loop access

    const { setCapturedImages, targetCount, setTargetCount } = usePhoto();
    const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);
    const [statusMessage, setStatusMessage] = useState('');

    const router = useRouter();

    // Cleanup helper with robust track stopping
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            console.log("Stopping camera tracks...");
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
                console.log(`Stopped track: ${track.label}`);
            });
            streamRef.current = null;
        }
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
                audio: false,
            });
            streamRef.current = mediaStream;
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera access denied:', err);
            setError('Camera access denied. Please upload a photo.');
        }
    };

    // Start camera on mount
    useEffect(() => {
        startCamera();
        // Strict cleanup on unmount
        return () => {
            console.log("Unmounting CapturePage, cleaning up...");
            stopCamera();
        };
    }, [stopCamera]);

    // Handle navigation away manually to ensure cleanup check
    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("Navigating back, forcing cleanup...");
        stopCamera();
        router.push('/');
    };

    // When we have enough photos, save and redirect
    useEffect(() => {
        if (currentPhotos.length > 0 && currentPhotos.length === targetCount) {
            setCapturedImages(currentPhotos);
            stopCamera();
            setTimeout(() => {
                router.push('/filters');
            }, 500);
        }
    }, [currentPhotos, targetCount, router, setCapturedImages, stopCamera]);

    const togglePause = () => {
        const newState = !isPaused;
        setIsPaused(newState);
        isPausedRef.current = newState;
    };

    const startCaptureSequence = async () => {
        setCapturing(true);
        setCurrentPhotos([]);
        setStatusMessage('Get Ready!');

        for (let i = 0; i < targetCount; i++) {
            // Check Pause Before Countdown
            while (isPausedRef.current) {
                setStatusMessage('Paused');
                await new Promise(r => setTimeout(r, 200));
            }

            // Start Countdown
            setStatusMessage(`Photo ${i + 1} of ${targetCount}`);
            for (let c = 3; c > 0; c--) {
                // Check Pause During Countdown
                while (isPausedRef.current) {
                    setStatusMessage('Paused');
                    setCountdown(null); // Hide countdown while paused
                    await new Promise(r => setTimeout(r, 200));
                }

                setCountdown(c);
                await new Promise(r => setTimeout(r, 1000));
            }
            setCountdown(0); // Snap indicator

            // Trigger flash effect
            setShowFlash(true);
            await new Promise(r => setTimeout(r, 50)); // Brief delay for flash to show

            // Capture
            const photo = captureFrame();
            if (photo) {
                setCurrentPhotos(prev => [...prev, photo]);
            }

            // Hide flash
            await new Promise(r => setTimeout(r, 100));
            setShowFlash(false);

            // Brief pause between shots (review)
            if (i < targetCount - 1) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        setCapturing(false);
        setCountdown(null);
    };

    const captureFrame = (): string | null => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Calculate square crop from center
            const size = Math.min(video.videoWidth, video.videoHeight);
            const sx = (video.videoWidth - size) / 2;
            const sy = (video.videoHeight - size) / 2;

            // Set canvas to square
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                // Draw cropped square from video
                ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
                return canvas.toDataURL('image/jpeg', 0.9);
            }
        }
        return null;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCapturedImages([event.target.result as string]);
                    router.push('/filters');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50">
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-lg">📷</div>
                <span className="font-bold text-gray-800 text-xs">CozyCam</span>
            </div>

            <Link href="/" onClick={handleBack} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition z-10 flex items-center gap-2 text-sm">
                &larr; Back
            </Link>

            {/* Main Content Area */}
            <div className="w-full max-w-2xl relative flex flex-col gap-6">

                {/* Camera Viewport (No overlays except basic status if needed) */}
                <div className="glass-panel p-2 rounded-3xl shadow-2xl overflow-hidden relative aspect-square bg-black flex items-center justify-center group border border-white/10">

                    {/* Setup Overlay */}
                    {isSetup && !error && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-8 animate-fade-in bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                            <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">Choose Your Layout</h2>
                            <div className="flex gap-4 mb-8 flex-wrap justify-center px-4">
                                {[3, 4, 6, 8].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setTargetCount(num)}
                                        className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all font-bold text-xl animate-scale-in ${targetCount === num
                                            ? 'border-pink-500 bg-pink-500 text-white scale-110 shadow-lg shadow-pink-500/50'
                                            : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/20'
                                            }`}
                                        style={{ animationDelay: `${(num - 2) * 50}ms` }}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsSetup(false)}
                                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                Start Session
                            </button>
                        </div>
                    )}

                    {error ? (
                        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl">
                            <p className="text-red-400 mb-6 text-sm">{error}</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold px-8 py-3 rounded-full">
                                Upload Photo
                            </button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className={`w-full h-full object-cover transform scale-x-[-1] rounded-2xl`}
                            onLoadedMetadata={() => videoRef.current?.play()}
                        />
                    )}

                    {/* Flash Effect */}
                    {showFlash && (
                        <div className="absolute inset-0 bg-white z-40 animate-flash rounded-2xl"></div>
                    )}

                    {/* Corner indicator */}
                    {!isSetup && !error && (
                        <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            LIVE
                        </div>
                    )}
                </div>

                {/* Status Bar / Controls (Below Camera) */}
                {!isSetup && !error && (
                    <div className="w-full glass-panel rounded-3xl p-4 md:p-6 flex items-center justify-between shadow-lg min-h-[100px] animate-fade-in-up">

                        {/* Left: Progress */}
                        <div className="flex flex-col gap-3 w-1/3">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Progress</span>
                            <div className="flex w-full gap-2">
                                {Array.from({ length: targetCount }).map((_, i) => {
                                    // Determine status
                                    const isCompleted = i < currentPhotos.length;
                                    const isActive = i === currentPhotos.length;

                                    return (
                                        <div
                                            key={i}
                                            className={`flex-1 h-2 rounded-full transition-all duration-500 ${isCompleted
                                                ? 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-sm'
                                                : isActive
                                                    ? 'bg-pink-300 animate-pulse'
                                                    : 'bg-gray-200'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Center: Timer / Status */}
                        <div className="flex flex-col items-center justify-center w-1/3">
                            {capturing ? (
                                <div className="text-center">
                                    <div className="text-5xl font-black text-gray-800 tabular-nums leading-none mb-2">
                                        {countdown !== null && countdown > 0 ? countdown : (countdown === 0 ? '📸' : (isPaused ? '⏸' : '•••'))}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{statusMessage}</div>
                                </div>
                            ) : (
                                <button
                                    onClick={startCaptureSequence}
                                    className="w-20 h-20 bg-white rounded-full border-4 border-pink-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full" />
                                </button>
                            )}
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center justify-end gap-3 w-1/3">
                            {capturing && (
                                <button
                                    onClick={togglePause}
                                    className={`px-5 py-2 rounded-full font-bold text-sm transition ${isPaused ? 'bg-yellow-400 text-gray-900 shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {isPaused ? 'Resume' : 'Pause'}
                                </button>
                            )}

                            {!capturing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                                    title="Upload">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
            </div>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
