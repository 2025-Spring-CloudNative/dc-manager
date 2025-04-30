import React, { useState } from "react";
import { Button } from "@/components/ManagementPage/Button/Button";
import styles from "./FilterButton.module.scss";

const FilterButton = (): JSX.Element => {
  const filterButtons = [
    { id: 1, label: "Filter 1" },
    { id: 2, label: "Filter 2" },
    { id: 3, label: "Filter 3" },
    { id: 4, label: "Filter 4" },
  ];

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const handleClick = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className={styles.filterControlsSection}>
      {filterButtons.map((button) => (
        <Button
          key={button.id}
          onClick={() => handleClick(button.id)}
          className={`${styles.filterButton} ${
            selected.has(button.id) ? styles.selected : ""
          }`}
        >
          {button.label}
        </Button>
      ))}
    </section>
  );
};

export default FilterButton;
