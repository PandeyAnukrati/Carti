import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#f7f4ee]">
      <div className="w-60 h-60">
        <DotLottieReact
          src="https://lottie.host/41ce7742-5b52-4c46-819d-208885466c87/9rnpjkrvB6.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}
