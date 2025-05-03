import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/mainpage/Card/Card";
import mainpageTitleImg from "@/assets/mainpage-title.png";
import styles from "./MainPage.module.scss";
import NvBar from "@/components/shared/NvBar";

const MainPage = (): JSX.Element => {
  const cardItems = [
    { text: "編輯機器", href: "/ManagementPage" },
    { text: "編輯機櫃", href: "/cabinet" },
  ];

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.heroSection}>
          <img src={mainpageTitleImg} alt="Mainpage title" className={styles.heroImage} />
          <NvBar />
        </div>

        <div className={styles.cardContainer}>
          {cardItems.map((item, index) => (
            <Link key={index} to={item.href} className={styles.cardLink}>
              <Card
                hovered={hoveredCardIndex === index}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
              >
                <CardContent>
                  {item.text}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
