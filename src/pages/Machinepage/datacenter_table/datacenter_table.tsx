import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

export const DataCenterTableSection = (): JSX.Element => {
  // Data for table rows
  const dataCenters = [
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
  ];

  return (
    <Card className="w-full mx-auto my-7 bg-[#ffffffa1] rounded-[30px] border-[3px] border-solid border-[#ffffff4c] backdrop-blur-[6.6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6.6px)_brightness(100%)]">
      <div className="p-7">
        <Table>
          <TableHeader className="bg-[#a2e1e452]">
            <TableRow>
              <TableHead className="w-[150px] h-[55px] border-x border-[#6bb7be] font-medium text-layout-800 text-xl">
                機櫃名稱
              </TableHead>
              <TableHead className="w-[150px] h-[55px] border-x border-[#6bb7be] font-medium text-layout-800 text-xl">
                Rack 數量
              </TableHead>
              <TableHead className="w-[150px] h-[55px] border-x border-[#6bb7be] font-medium text-layout-800 text-xl">
                Unit 數量
              </TableHead>
              <TableHead className="w-[500px] h-[55px] border-x border-[#6bb7be] font-medium text-layout-800 text-xl">
                現有機器
              </TableHead>
              <TableHead className="w-60 h-[55px] border-x border-[#6bb7be] font-medium text-layout-800 text-xl">
                加到常用
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataCenters.map((dc, index) => (
              <TableRow
                key={index}
                className="border-b border-variable-collection-color-8"
              >
                <TableCell className="h-[55px] border-x border-[#6bb7be] bg-layout-100 font-medium text-layout-800 text-[22px]">
                  {dc.name}
                </TableCell>
                <TableCell className="h-[55px] border-x border-[#6bb7be] bg-layout-100 font-medium text-layout-800 text-[22px]">
                  {dc.rackCount}
                </TableCell>
                <TableCell className="h-[55px] border-x border-[#6bb7be] bg-layout-100 font-medium text-layout-800 text-[22px]">
                  {dc.unitCount}
                </TableCell>
                <TableCell className="h-[55px] border-x border-[#6bb7be] bg-layout-100">
                  <div className="flex gap-2.5">
                    {dc.hosts.map((host, hostIndex) => (
                      <Badge
                        key={hostIndex}
                        className="w-[100px] h-[35px] flex items-center justify-center bg-[#a2e1e4] text-layout-800 text-lg font-medium rounded-[54px]"
                      >
                        {host}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="h-[55px] border-x border-[#6bb7be] bg-layout-100">
                  <div className="flex gap-[15px]">
                    {dc.favorites.map((favorite, favIndex) => (
                      <Badge
                        key={favIndex}
                        className="w-[100px] h-[35px] flex items-center justify-center bg-[#d0f7f8] text-layout-800 text-lg font-medium rounded-[54px]"
                      >
                        {favorite}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
