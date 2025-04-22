import React from "react";
import { Button } from "../../../../components/ui/button";

export const FilterControlsSection = (): JSX.Element => {
  // Filter button data for mapping
  const filterButtons = [
    { id: 1, label: "Filter" },
    { id: 2, label: "Filter" },
    { id: 3, label: "Filter" },
    { id: 4, label: "Filter" },
  ];

  return (
    <section className="flex gap-5 my-6">
      {filterButtons.map((button) => (
        <Button
          key={button.id}
          variant="outline"
          className="h-[43px] w-[116px] rounded-[54px] border-[3px] border-[#a2e1e4] bg-white text-xl tracking-[2px] font-normal [font-family:'Noto_Sans',Helvetica] backdrop-blur-[6.6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6.6px)_brightness(100%)]"
        >
          {button.label}
        </Button>
      ))}
    </section>
  );
};
