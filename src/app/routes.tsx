import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import VoiceLibrary from "./pages/VoiceLibrary";
import Contacts from "./pages/Contacts";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "campaigns", Component: Campaigns },
      { path: "campaigns/create", Component: CreateCampaign },
      { path: "voice-library", Component: VoiceLibrary },
      { path: "contacts", Component: Contacts },
      { path: "analytics", Component: Analytics },
      { path: "users", Component: Users },
      { path: "settings", Component: Settings },
    ],
  },
]);
