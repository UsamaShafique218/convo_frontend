import {
  HomeIcon, 
  TableCellsIcon, 
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard"; 
import Genders from "./pages/dashboard/references_data/Genders";
import Industries from "./pages/dashboard/references_data/Industries";
import NetworkinGoals from "./pages/dashboard/references_data/NetworkinGoals";
import ArtisticIdentities from "./pages/dashboard/references_data/ArtisticIdentities";
import PrimaryMediums from "./pages/dashboard/references_data/PrimaryMediums";
import SkillsAndTechniques from "./pages/dashboard/references_data/SkillsAndTechniques";
import ToolsAndSoftware from "./pages/dashboard/references_data/ToolsAndSoftware";
import CollaborationGoals from "./pages/dashboard/references_data/CollaborationGoals";
import Interests from "./pages/dashboard/references_data/Interests";
import Orientations from "./pages/dashboard/references_data/Orientations";
import Work from "./pages/dashboard/references_data/Work";
import CommunicationStyles from "./pages/dashboard/references_data/CommunicationStyles";
import LoveLanguages from "./pages/dashboard/references_data/LoveLanguages";
import ZodiacSigns from "./pages/dashboard/references_data/ZodiacSigns";
import IcebreakerPrompts from "./pages/dashboard/references_data/IcebreakerPrompts";
import CollaborationProfile from "./pages/dashboard/CollaborationProfile"; 
import Users from "./pages/dashboard/Users";
import Posts from "./pages/dashboard/Posts"; 

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      }, 
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Users",
        path: "/Users",
        element: <Users />,
      },
       
      {
        icon: <TableCellsIcon {...icon} />,
        name: "References Data",
        collapse: true,
        pages: [
          {
            name: "Genders",
            path: "/Genders",
            element: <Genders />,
          }, 
          {
            name: "Industries",
            path: "/industries",
            element: <Industries />,
          },
          {
            name: "Networkin Goals",
            path: "/networkin-goals",
            element: <NetworkinGoals />,
          },
          {
            name: "Artistic Identities",
            path: "/artistic-identities",
            element: <ArtisticIdentities />,
          },
          {
            name: "Primary Mediums",
            path: "/primary-mediums",
            element: <PrimaryMediums />,
          }, 
          {
            name: "Skills and Techniques",
            path: "/skills-and-techniques",
            element: <SkillsAndTechniques />,
          }, 
          {
            name: "Tools and Software",
            path: "/tools-and-software",
            element: <ToolsAndSoftware />,
          },
          {
            name: "Collaboration Goals",
            path: "/collaboration-goals",
            element: <CollaborationGoals />,
          },
          {
            name: "Interests",
            path: "/interests",
            element: <Interests />,
          },
          {
            name: "Orientations",
            path: "/orientations",
            element: <Orientations />,
          },
          {
            name: "Work",
            path: "/work",
            element: <Work />,
          },
          {
            name: "Communication Styles",
            path: "/communication-styles",
            element: <CommunicationStyles />,
          },
          {
            name: "Love Languages",
            path: "/love-languages",
            element: <LoveLanguages />,
          },
          {
            name: "Zodiac Signs",
            path: "/zodiac-signs",
            element: <ZodiacSigns />,
          },
          {
            name: "Icebreaker Prompts",
            path: "/icebreaker-prompts",
            element: <IcebreakerPrompts />,
          }, 
          
        ],
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Collaboration Profile",
        path: "/collaboration-profile",
        element: <CollaborationProfile />,
      }, 

      {
        icon: <TableCellsIcon {...icon} />,
        name: "Posts",
        path: "/posts",
        element: <Posts />,
      },

      
    ],
  }, 
];

export default routes;
