"use client";

import CardSmall from "../CardSmall";

const Cards = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <CardSmall />
        <CardSmall />
        <CardSmall />
      </div>
    </div>
  );
};

export default Cards;
