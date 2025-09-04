import {
  HomeIcon, 
  TableCellsIcon, 
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard"; 
import Genders from "./pages/dashboard/references_data/genders";
import Industries from "./pages/dashboard/references_data/industries";
import NetworkinGoals from "./pages/dashboard/references_data/networkinGoals";
import ArtisticIdentities from "./pages/dashboard/references_data/artisticIdentities";
import PrimaryMediums from "./pages/dashboard/references_data/primaryMediums";
import SkillsAndTechniques from "./pages/dashboard/references_data/skillsAndTechniques";
import ToolsAndSoftware from "./pages/dashboard/references_data/toolsAndSoftware";
import CollaborationGoals from "./pages/dashboard/references_data/collaborationGoals";
import Interests from "./pages/dashboard/references_data/interests";
import Orientations from "./pages/dashboard/references_data/orientations";
import Work from "./pages/dashboard/references_data/work";
import CommunicationStyles from "./pages/dashboard/references_data/communicationStyles";
import LoveLanguages from "./pages/dashboard/references_data/loveLanguages";
import ZodiacSigns from "./pages/dashboard/references_data/zodiacSigns";
import IcebreakerPrompts from "./pages/dashboard/references_data/icebreakerPrompts";
import CollaborationProfile from "./pages/dashboard/collaborationProfile";
import GetApiUsers from "./pages/dashboard/users"; 
import Users from "./pages/dashboard/users";
import Posts from "./pages/dashboard/posts";
// import Abc from "./pages/dashboard/references_data/abc";

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
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
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
            path: "/genders",
            element: <Genders />,
          },
          // {
          //   name: "Abc",
          //   path: "/abc",
          //   element: <Abc />,
          // },
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
