import React, { useRef, useEffect, useState } from 'react';

export const ChromaKeyVideo = ({ src, className, style }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 640, height: 360 });

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId;

    const handleLoadedMetadata = () => {
      setDimensions({
        width: video.videoWidth || 640,
        height: video.videoHeight || 360
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    const ctx = canvas.getContext('2d');

    // Create a smaller offscreen canvas for the background flood-fill mask
    // Scaling down makes the BFS algorithm extremely fast (under 0.3ms per frame)
    const maskW = 240;
    const maskH = 135;
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = maskW;
    maskCanvas.height = maskH;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });

    const renderFrame = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }

      const mainW = video.videoWidth || 640;
      const mainH = video.videoHeight || 360;

      if (canvas.width !== mainW || canvas.height !== mainH) {
        canvas.width = mainW;
        canvas.height = mainH;
      }

      // 1. Draw video to small mask canvas
      maskCtx.drawImage(video, 0, 0, maskW, maskH);
      const maskData = maskCtx.getImageData(0, 0, maskW, maskH);
      const pixels = maskData.data;
      const visited = new Uint8Array(maskW * maskH);
      const queue = [];

      // Seed BFS from all pixels along the top border
      for (let x = 0; x < maskW; x++) {
        const idx = x;
        queue.push(idx);
        visited[idx] = 1;
      }
      // Seed BFS from left border (excluding top-left)
      for (let y = 1; y < maskH; y++) {
        const idx = y * maskW;
        if (!visited[idx]) {
          queue.push(idx);
          visited[idx] = 1;
        }
      }
      // Seed BFS from right border (excluding top-right)
      for (let y = 1; y < maskH; y++) {
        const idx = y * maskW + (maskW - 1);
        if (!visited[idx]) {
          queue.push(idx);
          visited[idx] = 1;
        }
      }
      // Seed BFS from bottom border outer regions (avoiding green sweater)
      const leftBound = Math.floor(maskW * 0.32);
      const rightBound = Math.floor(maskW * 0.57);
      for (let x = 1; x < leftBound; x++) {
        const idx = (maskH - 1) * maskW + x;
        if (!visited[idx]) {
          queue.push(idx);
          visited[idx] = 1;
        }
      }
      for (let x = rightBound; x < maskW - 1; x++) {
        const idx = (maskH - 1) * maskW + x;
        if (!visited[idx]) {
          queue.push(idx);
          visited[idx] = 1;
        }
      }

      let head = 0;

      while (head < queue.length) {
        const idx = queue[head++];
        const x = idx % maskW;
        const y = Math.floor(idx / maskW);

        const cr = pixels[idx * 4];
        const cg = pixels[idx * 4 + 1];
        const cb = pixels[idx * 4 + 2];

        // Check 4-way neighbors
        const neighbors = [
          { nx: x + 1, ny: y },
          { nx: x - 1, ny: y },
          { nx: x, ny: y + 1 },
          { nx: x, ny: y - 1 }
        ];

        for (let i = 0; i < 4; i++) {
          const { nx, ny } = neighbors[i];
          if (nx >= 0 && nx < maskW && ny >= 0 && ny < maskH) {
            const nidx = ny * maskW + nx;
            if (!visited[nidx]) {
              const nr = pixels[nidx * 4];
              const ng = pixels[nidx * 4 + 1];
              const nb = pixels[nidx * 4 + 2];

              const dR = nr - cr;
              const dG = ng - cg;
              const dB = nb - cb;
              const distSq = dR * dR + dG * dG + dB * dB;

              // Local color-similarity threshold: 10.0 (squared = 100.0)
              if (distSq < 100.0) {
                visited[nidx] = 1;
                queue.push(nidx);
              }
            }
          }
        }
      }
      // 3. Erode the foreground mask by 1 pixel to clean up the blocky/dotted boundary fringe
      const finalVisited = new Uint8Array(maskW * maskH);
      for (let y = 0; y < maskH; y++) {
        for (let x = 0; x < maskW; x++) {
          const idx = y * maskW + x;
          if (visited[idx]) {
            finalVisited[idx] = 1;
          } else {
            // It's foreground. Erode it if it borders any background pixel.
            let isNearBackground = false;
            if (x > 0 && visited[idx - 1]) isNearBackground = true;
            else if (x < maskW - 1 && visited[idx + 1]) isNearBackground = true;
            else if (y > 0 && visited[idx - maskW]) isNearBackground = true;
            else if (y < maskH - 1 && visited[idx + maskW]) isNearBackground = true;

            finalVisited[idx] = isNearBackground ? 1 : 0;
          }
        }
      }

      // 4. Convert the BFS result to a black & transparent mask
      for (let i = 0; i < finalVisited.length; i++) {
        const idx = i * 4;
        if (finalVisited[i]) {
          // Background: fully transparent
          pixels[idx + 3] = 0;
        } else {
          // Foreground: solid black shape
          pixels[idx] = 0;
          pixels[idx + 1] = 0;
          pixels[idx + 2] = 0;
          pixels[idx + 3] = 255;
        }
      }
      maskCtx.putImageData(maskData, 0, 0);

      // 4. Draw high-res video to the main canvas
      ctx.drawImage(video, 0, 0, mainW, mainH);

      // 5. Apply the low-res mask using GPU composite blending (destination-in)
      // Upscaling the low-res mask Canvas naturally feathers and smooths the edges.
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskCanvas, 0, 0, mainW, mainH);
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    video.addEventListener('play', () => {
      renderFrame();
    });

    if (!video.paused) {
      renderFrame();
    }

    video.play().catch(err => console.log("Autoplay blocked initially: ", err));

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      cancelAnimationFrame(animationFrameId);
    };
  }, [src]);

  return (
    <div className={className} style={{ ...style, position: 'relative' }}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        autoPlay
        playsInline
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};
