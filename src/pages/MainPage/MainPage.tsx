import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/Mainpage/Card/Card"
import mainpageTitleImg from "@/assets/mainpage-title.png"
import styles from "./MainPage.module.scss"

const MainPage = () => {
    const cardItems = [
        { text: "資料中心", href: "/DataCenterPage" },
        { text: "網路設定", href: "/network" },
        { text: "服務管理", href: "/service" },
    ]

    const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)

    return (
        <div className={styles.mainContainer}>
            <div className={styles.innerContainer}>
                <div className={styles.heroSection}>
                    <img src={mainpageTitleImg} alt="Mainpage title" className={styles.heroImage} />
                </div>

                <div className={styles.cardContainer}>
                    {cardItems.map((item, index) => (
                        <Link key={index} to={item.href} className={styles.cardLink}>
                            <Card
                                hovered={hoveredCardIndex === index}
                                onMouseEnter={() => setHoveredCardIndex(index)}
                                onMouseLeave={() => setHoveredCardIndex(null)}
                            >
                                <CardContent>{item.text}</CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MainPage
