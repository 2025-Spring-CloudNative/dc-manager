import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

export const DataCenterComponentSection = (): JSX.Element => {
  // Data for the rack tables
  const dataCenters = [
    {
      id: "DC-B",
      rooms: [
        {
          name: "Room A",
          racks: ["Rack 1", "Rack 1", "Rack 1"],
        },
        {
          name: "Room B",
          racks: ["Rack 1"],
        },
      ],
    },
  ];

  // Unit numbers for the rows
  const units = ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <Card className="w-full p-8 bg-[#ffffffa1] rounded-[30px] border-[3px] border-solid border-[#ffffff4c] backdrop-blur-[6.6px]">
      <div className="flex justify-end mb-2">
        <Button className="bg-[#e5fbff] text-[#125359] border-[3px] border-[#a2e1e4] rounded-[54px] hover:bg-[#d5ebef] font-normal text-xl tracking-[2px]">
          編輯機櫃
        </Button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-full max-w-[684px] flex items-center justify-center">
          <Separator className="absolute w-[261px] h-[5px] bg-[#a2e1e4] left-0 top-[30px]" />
          <h2 className="text-black text-[28px] text-center tracking-[2.80px] font-normal [font-family:'Noto_Sans',Helvetica] px-8">
            常用機櫃
          </h2>
          <Separator className="absolute w-[261px] h-[5px] bg-[#a2e1e4] right-0 top-[30px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Table */}
        <div className="border border-[#c1d5d7]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#46a4ad] border border-[#c1d5d7]">
                <TableHead colSpan={4} className="h-10 text-center">
                  <span className="font-bold text-white text-base tracking-[2.00px]">
                    DC-B
                  </span>
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[59px] bg-[#cde9ec] h-10 border border-[#c1d5d7] text-center p-0"></TableHead>
                <TableHead className="w-80 bg-[#cde9ec] h-10 border border-[#c1d5d7] text-center p-0">
                  <span className="font-medium text-black text-base">
                    Room A
                  </span>
                </TableHead>
                <TableHead className="w-40 bg-[#cde9ec] h-10 border border-[#c1d5d7] text-center p-0">
                  <span className="font-medium text-black text-base">
                    Room B
                  </span>
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[59px] bg-[#effdff] h-10 border border-[#c1d5d7] text-center p-0">
                  <span className="font-medium text-black text-base">Unit</span>
                </TableHead>
                {["Rack 1", "Rack 1", "Rack 1"].map((rack, index) => (
                  <TableHead
                    key={`left-rack-header-${index}`}
                    className="w-40 bg-[#effdff] h-10 border border-[#c1d5d7] text-center p-0"
                  >
                    <span className="font-medium text-black text-base">
                      {rack}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.slice(1).map((unit) => (
                <TableRow key={`left-unit-${unit}`}>
                  <TableCell className="w-[59px] bg-[#effdff] h-10 border border-[#c1d5d7] text-center p-0">
                    <span className="font-medium text-black text-base">
                      {unit}
                    </span>
                  </TableCell>
                  {[1, 2, 3].map((cell, index) => (
                    <TableCell
                      key={`left-cell-${unit}-${index}`}
                      className="w-40 bg-layout-100 h-10 border border-[#c1d5d7] p-0"
                    />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right Table */}
        <div className="border border-[#c1d5d7]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#46a4ad] border border-[#c1d5d7]">
                <TableHead colSpan={4} className="h-10 text-center">
                  <span className="font-bold text-white text-base tracking-[2.00px]">
                    DC-B
                  </span>
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[59px] bg-[#cde9ec] h-10 border border-[#c1d5d7] text-center p-0"></TableHead>
                <TableHead className="w-80 bg-[#cde9ec] h-10 border border-[#c1d5d7] text-center p-0">
                  <span className="font-medium text-black text-base">
                    Room A
                  </span>
                </TableHead>
                <TableHead className="w-40 bg-[#cde9ec] h-10 border border-[#c1d5d7] text-center p-0">
                  <span className="font-medium text-black text-base">
                    Room B
                  </span>
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[59px] bg-[#effdff] h-10 border border-[#c1d5d7] text-center p-0">
                  <span className="font-medium text-black text-base">Unit</span>
                </TableHead>
                {["Rack 1", "Rack 1", "Rack 1"].map((rack, index) => (
                  <TableHead
                    key={`right-rack-header-${index}`}
                    className="w-40 bg-[#effdff] h-10 border border-[#c1d5d7] text-center p-0"
                  >
                    <span className="font-medium text-black text-base">
                      {rack}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.slice(1).map((unit) => (
                <TableRow key={`right-unit-${unit}`}>
                  <TableCell className="w-[59px] bg-[#effdff] h-10 border border-[#c1d5d7] text-center p-0">
                    <span className="font-medium text-black text-base">
                      {unit}
                    </span>
                  </TableCell>
                  {[1, 2, 3].map((cell, index) => (
                    <TableCell
                      key={`right-cell-${unit}-${index}`}
                      className="w-40 bg-layout-100 h-10 border border-[#c1d5d7] p-0"
                    />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
