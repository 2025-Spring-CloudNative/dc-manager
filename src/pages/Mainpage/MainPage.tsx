import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import mainpageTitleImg from "@/assets/mainpage-title.png";
import dcms from "@/assets/DCMS.png";
import "./MainPage.css";

// Main page styling
const main = "relative w-full h-full bg-white"

export const MainPage = (): JSX.Element => {
  const navItems = [
    { text: "編輯機櫃", href: "/cabinet" },
    { text: "編輯機器", href: "/machine" },
    { text: "登入系統", href: "/login" },
  ];

  const cardItems = [
    { text: "編輯機器" },
    { text: "編輯機櫃" },
  ];

  return (
    <div className="bg-white flex justify-center w-full">
      {/* Constrained container */}
      <div className={main}>
        
        {/* Hero: 80% of viewport height */}
        <div className="absoulte w-full h-[70vh]">
          {/* Banner image covers whole hero */}
          <img
            src={mainpageTitleImg}
            alt="Mainpage title"
            // className="absolute inset-0 w-full h-full object-cover z-0"
            className="mainpage-hero"
          />

          {/* Header bar: 8vh tall */}
          <header className="absolute top-0 left-0 w-full h-[8vh] flex items-center justify-between px-[3vw] z-10 shadow-md bg-gradient-to-r from-[#8bdeff] to-[#49b7a2]">
            <Link to="/mainpage">
              {/* Logo size scales with viewport */}
              <img
                className="w-[9vw] h-[2vh] object-contain"
                alt="DCMS"
                src={dcms}
              />
            </Link>
            <nav className="flex space-x-[2vw]">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="text-white text-[2.5vw] tracking-[0.5vw] font-normal"
                >
                  {item.text}
                </Link>
              ))}
            </nav>
          </header>
        </div>

        {/* Cards: gap & margin in viewport units */}
        <div className="flex justify-center gap-[8vw] mt-[-10vh]">
          {cardItems.map((item, index) => (
            <Card
              key={index}
              className="w-[15vw] h-[20vh] bg-[#6dccd54c] rounded-[3vw] border border-solid border-[#6dccd503] backdrop-blur-[1vh] backdrop-brightness-[100%]"
            >
              <CardContent className="flex items-center justify-center h-full p-0">
                <div className="w-[10vw] text-variable-collection-color-7 text-[3vw] tracking-[0.5vw] font-normal text-center">
                  {item.text}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subpage content */}
        <div className="px-[5vw] py-[4vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
