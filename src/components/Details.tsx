"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import About from "./About";
import Notes from "./Notes";

export default function Details({ name }: { name: string }) {
  const [activeTab, setActiveTab] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const detailsWindow = searchParams.get("details");

  useEffect(() => {
    if (detailsWindow) {
      setActiveTab(detailsWindow);
    }
  }, [detailsWindow]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`?details=${tab}`, { scroll: false });
  };

  return (
    <section className="mt-5">
      <div
        className={`mx-auto flex h-[46px] items-center rounded-full bg-white px-1 font-mulish ${name === "people-details" ? "w-[284px]" : "w-[145px]"}`}
      >
        <button
          type="button"
          className={`h-[40px] w-[143px] rounded-full text-sm font-medium transition-colors ${
            activeTab === "about"
              ? "bg-[#0094FF] font-bold text-white"
              : "bg-white font-normal text-[#231F20]"
          }`}
          onClick={() => handleTabChange("about")}
        >
          About
        </button>

        {name === "people-details" ? (
          <button
            type="button"
            className={`h-[40px] w-[143px] rounded-full text-sm font-medium transition-colors ${
              activeTab === "notes"
                ? "bg-[#0094FF] font-bold text-white"
                : "bg-white font-normal text-[#231F20]"
            }`}
            onClick={() => handleTabChange("notes")}
          >
            <span>Notes</span>
          </button>
        ) : null}
      </div>

      {activeTab === "about" ? <About /> : <Notes />}
    </section>
  );
}
