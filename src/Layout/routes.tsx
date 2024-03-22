import { MdOutlineDashboard, MdOutlineDocumentScanner } from "react-icons/md";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { FaStore } from "react-icons/fa6";
import { IoSyncOutline } from "react-icons/io5";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CastForEducationOutlinedIcon from "@mui/icons-material/CastForEducationOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import { FaChrome } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { SlSocialYoutube } from "react-icons/sl";
import { FaDiscord } from "react-icons/fa";
export const routes = [
  {
    icon: <DashboardOutlinedIcon fontSize="small" />,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: <DocumentScannerOutlinedIcon fontSize="small" />,
    name: "Scans",
    link: "/scans",
  },
  {
    icon: <FolderOpenOutlinedIcon fontSize="small" />,
    name: "Favourites",
    link: "/product-folder",
  },
  {
    icon: <SettingsOutlinedIcon fontSize="small" />,
    name: "Setting",
    link: "/setting",
  },
  {
    icon: <CastForEducationOutlinedIcon fontSize="small" />,
    name: "Training",
    link: "*",
  },
  {
    icon: <GroupsOutlinedIcon fontSize="small" />,
    name: "Community Calls",
    link: "*",
  },
  {
    icon: <ForumOutlinedIcon fontSize="small" />,
    name: "Success Talks",
    link: "*",
  },
  {
    icon: <FaChrome fontSize={16} />,
    name: "Get Extension",
    link: "*",
  },
  {
    icon: <SlSocialYoutube fontSize={16} />,
    name: "Youtube",
    link: "/widgets",
  },
  {
    icon: <CiFacebook fontSize={16} />,
    name: "Facebook Group",
    link: "/widgets",
  },
  {
    icon: <FaDiscord fontSize={16} />,
    name: "Discord",
    link: "/widgets",
  },
];
