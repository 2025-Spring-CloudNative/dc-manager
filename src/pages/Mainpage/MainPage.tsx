import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";

export const MainPage = () => {
  // Navigation menu items data
  const navItems = [
    { text: "編輯機櫃", href: "#" },
    { text: "編輯機器", href: "#" },
    { text: "登入系統", href: "#" },
  ];

  // Card items data
  const cardItems = [
    { text: "編輯機器", left: "329px" },
    { text: "編輯機櫃", left: "790px" },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px] h-[914px] relative">
        <div className="w-full h-[473px] relative">
          <img
            className="w-full h-[400px] mt-[73px]"
            alt="Mainpage title"
            src="https://c.animaapp.com/FARpDybl/img/mainpage-title.png"
          />

          <header className="absolute w-full h-[77px] top-0 left-0 shadow-[0px_4px_4px_#00000040] [background:linear-gradient(90deg,rgba(139,222,255,1)_0%,rgba(73,183,162,1)_100%)] flex items-center justify-between px-6">
            <Link to="/mainpage">
              <img
                className="w-[138px] h-[30px]"
                alt="Dcms"
                src="https://c.animaapp.com/FARpDybl/img/dcms.svg"
              />
            </Link>

            <nav className="flex">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to="#"
                  className="w-[156px] h-[43px] flex items-center justify-center"
                >
                  <span className="text-[#e5fbff] text-2xl tracking-[2.40px] [font-family:'Noto_Sans',Helvetica] font-normal text-center">
                    {item.text}
                  </span>
                </Link>
              ))}
            </nav>
          </header>
        </div>

        <div className="flex justify-center gap-[140px] mt-8">
          {cardItems.map((item, index) => (
            <Card
              key={index}
              className="w-[321px] h-[159px] bg-[#6dccd54c] rounded-[45px] border border-solid border-[#6dccd503] backdrop-blur-[8.7px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.7px)_brightness(100%)]"
            >
              <CardContent className="flex items-center justify-center h-full p-0">
                <div className="w-52 text-variable-collection-color-7 text-[40px] tracking-[4.00px] [font-family:'Noto_Sans',Helvetica] font-normal text-center">
                  {item.text}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
