import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Generate random stars
        const starsContainer = containerRef.current.querySelector('.stars-container');
        if (starsContainer) {
            for (let i = 0; i < 150; i++) {
                const star = document.createElement('div');
                const size = ['star-small', 'star-medium', 'star-large'][Math.floor(Math.random() * 3)];
                star.className = `star ${size}`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.setProperty('--star-duration', `${2 + Math.random() * 4}s`);
                star.style.setProperty('--star-delay', `${Math.random() * 5}s`);
                starsContainer.appendChild(star);
            }
        }

        // Generate particles
        const particlesContainer = containerRef.current.querySelector('.particles');
        if (particlesContainer) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = 3 + Math.random() * 7;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.setProperty('--particle-duration', `${10 + Math.random() * 20}s`);
                particle.style.setProperty('--particle-delay', `${Math.random() * 10}s`);
                particlesContainer.appendChild(particle);
            }
        }

        // Generate shooting stars
        const shootingStarsContainer = containerRef.current.querySelector('.shooting-stars');
        if (shootingStarsContainer) {
            const createShootingStar = () => {
                const star = document.createElement('div');
                star.className = 'shooting-star';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${-10}%`;
                shootingStarsContainer.appendChild(star);
                
                setTimeout(() => {
                    star.remove();
                }, 3000);
            };

            // Create a shooting star every 5-15 seconds
            const interval = setInterval(() => {
                if (Math.random() > 0.7) {
                    createShootingStar();
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, []);

    return (
        <div className="cosmic-background" ref={containerRef}>
            <div className="stars-container"></div>
            <div className="nebula-clouds">
                <div className="nebula nebula-1"></div>
                <div className="nebula nebula-2"></div>
                <div className="nebula nebula-3"></div>
            </div>
            <div className="particles"></div>
            <div className="shooting-stars"></div>
            <div className="aurora"></div>
        </div>
    );
}
