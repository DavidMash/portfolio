import React, { useRef, useEffect } from 'react';

const CanvasMouseEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const startOpacity = 0.1;
        const startSize = 10;
        const circles = [];
        let x = 0;
        let y = 0;
        let r = 0;
        let rDirection = false;
        let g = 0;
        let gDirection = false;
        let b = 255;
        let bDirection = false;

        // handle mouse movement
        const handleMouseMove = (event) => {
            const distY = Math.abs(x - event.clientX);
            const distX = Math.abs(y - event.clientY);    
            x = event.clientX;
            y = event.clientY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            rDirection = rDirection? r <= 255: r <= 0;
            r = r + (rDirection? 1: -1) * distance / 20;
            gDirection = gDirection? g <= 255: g <= 0;
            g = g + (rDirection? 2: -2) * distance / 20;
            bDirection = bDirection? b <= 255: b <= 0;
            b = b + (bDirection? 3: -3) * distance / 20;
            circles.push({ x: x, y: y, opacity: startOpacity * Math.min(distance / 20.0, 1), size: startSize * Math.min(distance / 100.0, 1), r: r, g: g, b: b});
        }

        window.addEventListener('mousemove', handleMouseMove);

        // animate the effect
        const animate = () => {
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // set canvas dimensions to window dimensions
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // draw circles
            for (let i = 0; i < circles.length; i++) {
                const circle = circles[i];
                if (circle.opacity <= 0) {
                    circles.splice(i--, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(${circle.r}, ${circle.b}, ${circle.g}, ${circle.opacity})`;
                    ctx.fill();
                    circle.opacity -= (0.0016 * (circles.length + 1) / 2.0);
                    circle.size += ((circles.length + 1) / 2.0 );
                }
            }

            // repeat animation
            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    return (
        <canvas className={"follow-cursor-canvas"} ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    );
};

export default CanvasMouseEffect;