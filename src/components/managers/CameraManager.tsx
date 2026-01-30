import React, { useRef, useEffect } from 'react';
import { CameraControls } from '@react-three/drei';
import { useExperienceStore } from '../../store/useExperienceStore';
import type { FocusTarget } from '../../store/useExperienceStore';

/**
 * SOURCE OF TRUTH: Camera Configurations
 */
const CAMERA_CONFIGS: Record<FocusTarget, { position: [number, number, number], target: [number, number, number] }> = {
    rose: { position: [-2.2, 0.8, 6.5], target: [-2.2, -0.8, -1] },
    envelope: { position: [2.8, 0.8, 6.5], target: [2.8, -0.4, 0.5] },
    photo: { position: [0, 2.0, 7.5], target: [0, 2.0, -2.0] },
    chocolate: { position: [5.0, 0.8, 7.5], target: [5.0, -0.8, 1.0] },
    center: { position: [0, 1.0, 16.0], target: [0, 0, 0] },
};

export const CameraManager: React.FC = () => {
    const focusTarget = useExperienceStore((state) => state.focusTarget);
    const setIsTransitioning = useExperienceStore((state) => state.setIsTransitioning);
    const isFrozen = useExperienceStore((state) => state.isFrozen);

    // We get the controls instance
    const controlsRef = useRef<CameraControls>(null);

    // Handle Transitions when focusTarget changes
    useEffect(() => {
        const config = CAMERA_CONFIGS[focusTarget];
        if (config && controlsRef.current) {
            setIsTransitioning(true);
            controlsRef.current.setLookAt(
                ...config.position,
                ...config.target,
                true // enable transition
            ).then(() => {
                setIsTransitioning(false);
            });
        }
    }, [focusTarget, setIsTransitioning]);

    return (
        <CameraControls
            ref={controlsRef}
            makeDefault
            dollyToCursor={true} // ENABLE ZOOM TO CURSOR
            minDistance={2}
            maxDistance={35}
            smoothTime={1.2} // Cinematic smoothing
            enabled={!isFrozen} // Disable when frozen (snapshot)
            draggingSmoothTime={0.1} // Responsive but smooth
        />
    );
};
