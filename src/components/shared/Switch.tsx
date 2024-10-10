import Image from "next/image";
import React, { useState } from "react";

export default function Switch() {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => setIsChecked(!isChecked);

  return (
    <div className="mb-6 mr-[6px] mt-[-20px] flex h-12 w-[88%] items-center self-end rounded-lg border border-[#b4b4b4] bg-[#292d38] p-2 font-mulish text-sm font-bold text-[#FFFFFF99] outline-none sm:mb-[2px] sm:mr-0 sm:mt-0 sm:w-[195px] sm:self-center">
      <Image
        src="/assets/svg/my-brands/poc/whatsapp-logo.svg"
        alt="whatsapp-icon"
        width={26}
        height={26}
      />
      <span className="ml-1 text-xs font-semibold text-[#FFFFFFCC] sm:text-[10px] sm:leading-[12px] 2xl:ml-2 2xl:text-xs">
        Also WhatsApp Number
      </span>
      <button
        type="button"
        onClick={toggleSwitch}
        aria-label={
          isChecked ? "Turn off WhatsApp number" : "Turn on WhatsApp number"
        } // Accessibility label
        className={`relative ml-6 mr-1 h-3 w-[30px] rounded-full border-[0.6px] border-[#FFE58E] transition-colors duration-300 focus:outline-none sm:ml-0 ${
          isChecked ? "bg-[#050818]" : "bg-[#292d38]"
        }`}
      >
        <span
          className={`absolute left-[-2px] top-[-3px] size-[16px] rounded-full bg-[#FFE58E] transition-transform duration-300 sm:left-[-6px] ${
            isChecked ? "translate-x-[18px]" : ""
          }`}
        />
        {/* Optionally add visually hidden text for screen readers */}
        <span className="sr-only">Toggle WhatsApp number visibility</span>
      </button>
    </div>
  );
}
