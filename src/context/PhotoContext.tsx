'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CollageLayout = 'classic-strip' | 'grid-2x2' | 'grid-3x1' | 'grid-2x3' | 'grid-2x4';

interface PhotoContextType {
  capturedImages: string[];
  setCapturedImages: (imgs: string[]) => void;
  targetCount: number;
  setTargetCount: (count: number) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  finalCollage: string | null;
  setFinalCollage: (img: string | null) => void;
  frameColor: string;
  setFrameColor: (color: string) => void;
  collageLayout: CollageLayout;
  setCollageLayout: (layout: CollageLayout) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [targetCount, setTargetCount] = useState<number>(3);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [finalCollage, setFinalCollage] = useState<string | null>(null);
  const [frameColor, setFrameColor] = useState<string>('#1a1625');
  const [collageLayout, setCollageLayout] = useState<CollageLayout>('classic-strip');

  return (
    <PhotoContext.Provider
      value={{
        capturedImages,
        setCapturedImages,
        targetCount,
        setTargetCount,
        selectedFilter,
        setSelectedFilter,
        finalCollage,
        setFinalCollage,
        frameColor,
        setFrameColor,
        collageLayout,
        setCollageLayout,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhoto() {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhoto must be used within a PhotoProvider');
  }
  return context;
}
