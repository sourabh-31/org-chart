"use client";

import { useEffect, useState } from "react";

import OrgChart from "@/components/OrgChart";
import OrgChartLoader from "@/components/OrgChartLoader";
import { convertChartData } from "@/lib/utils";
import { useChartStore } from "@/store/useChartStore";
import SidebarWindows from "@/components/SidebarWindows";
import ModalWindows from "@/components/ModalWindows";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const { chartData } = useChartStore();

  useEffect(() => {
    const storedConvertedData = localStorage.getItem("convertedData");

    if (storedConvertedData) {
      setIsLoading(false);
    } else {
      setTimeout(() => {
        const convertedData = convertChartData(chartData);
        localStorage.setItem("convertedData", JSON.stringify(convertedData));
        setIsLoading(false);
      }, 2000);
    }
  }, [chartData]);

  return (
    <section className="min-h-screen bg-[#1B1E25]">
      {isLoading ? <OrgChartLoader /> : <OrgChart />}

      <SidebarWindows />
      <ModalWindows />
    </section>
  );
}
