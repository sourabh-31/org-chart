"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function OrgChartLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <DotLottieReact
        loop
        autoplay
        src="/assets/lottie/tree.lottie"
        className="w-72 sm:w-80 xl:w-96"
      />
      <div className="-mt-4 text-center font-recoletaAlt text-lg text-[#ffffff99] sm:text-xl xl:text-2xl">
        Please wait while we prepare your Org chart...
      </div>
    </div>
  );
}
