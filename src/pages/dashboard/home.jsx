import React from "react";
import {
  Typography, 
} from "@material-tailwind/react";
 
import { StatisticsCard } from "@/widgets/cards"; 
import {
  statisticsCardsData, 
} from "@/data"; 

export function Home() {
  return (
    <div className="dashbord_content">
      <h4 className="page_title">Dashboard</h4>
      <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })} 
          />
        ))}
      </div> 
    </div>
  );
}

export default Home;
