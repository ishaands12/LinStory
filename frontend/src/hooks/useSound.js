import { useRef, useEffect } from 'react';

export function useSound(src) {
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(src);
    }, [src]);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed first):", e));
        }
    };

    return play;
}
