import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";

export const NavigationBarSection = (): JSX.Element => {
  // Navigation items data
  const navigationItems = [
    { id: 1, text: "編輯機櫃" },
    { id: 2, text: "編輯機器" },
    { id: 3, text: "登入系統" },
  ];

  return (
    <header className="w-full h-[77px] shadow-[0px_4px_4px_#00000040] [background:linear-gradient(90deg,rgba(139,222,255,1)_0%,rgba(73,183,162,1)_100%)] flex items-center justify-between px-6">
      <div className="flex items-center">
        <img
          className="w-[138px] h-[30px]"
          alt="Dcms"
          src="https://c.animaapp.com/25sGGoJV/img/dcms.svg"
        />
      </div>

      <NavigationMenu>
        <NavigationMenuList className="flex gap-0">
          {navigationItems.map((item) => (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink className="w-[156px] h-[43px] flex items-center justify-center text-[#e5fbff] text-2xl text-center tracking-[2.40px] [font-family:'Noto_Sans',Helvetica] font-normal cursor-pointer">
                {item.text}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default NavigationBarSection;