import { XIcon } from "lucide-react";
import React from "react";
import { Input } from "../../components/machinepage/input";
import { DataCenterComponentSection } from "./datacenter_component";
import { DataCenterTableSection } from "./datacenter_table";
import { FilterControlsSection } from "./filter_control";
import { NavigationBarSection } from "./machine_navbar";

export const ElementDcManagePage = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-col w-full min-h-screen">
      <NavigationBarSection />

      <div className="flex flex-col w-full px-6 py-4 bg-[#dbfaff]">
        {/* Search Bar */}
        <div className="relative w-full max-w-5xl mx-auto mb-4">
          <div className="relative flex items-center">
            <div className="absolute left-6 z-10">
              <img
                className="w-[29px] h-[29px]"
                alt="Search icon"
                src="https://c.animaapp.com/25sGGoJV/img/group-66@2x.png"
              />
            </div>
            <Input
              className="pl-16 pr-12 py-5 h-[49px] text-xl tracking-[2.00px] text-[#6dccd5] border-[3px] border-[#46a4adb2] rounded-[54px] bg-white backdrop-blur-[6.6px]"
              placeholder="搜尋機櫃..."
            />
            <button className="absolute right-6 z-10">
              <XIcon className="w-5 h-[22px] text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <FilterControlsSection />

        {/* Data Center Table */}
        <DataCenterTableSection />

        {/* Data Center Component */}
        <DataCenterComponentSection />
      </div>
    </div>
  );
};
