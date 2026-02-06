import { createBrowserRouter } from "react-router";
import { Home } from "@/app/pages/Home";
import { Closet } from "@/app/pages/Closet";
import { Looks } from "@/app/pages/Looks";
import { Profile } from "@/app/pages/Profile";
import { SharedLook } from "@/app/pages/SharedLook";
import { Notifications } from "@/app/pages/Notifications";
import { FAQ } from "@/app/pages/FAQ";
import { Announcements } from "@/app/pages/Announcements";
import { AnnouncementDetail } from "@/app/pages/AnnouncementDetail";
import { Layout } from "@/app/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "closet",
        Component: Closet,
      },
      {
        path: "looks",
        Component: Looks,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "notifications",
        Component: Notifications,
      },
      {
        path: "faq",
        Component: FAQ,
      },
      {
        path: "announcements",
        Component: Announcements,
      },
      {
        path: "announcements/:id",
        Component: AnnouncementDetail,
      },
      {
        path: "share/:lookId",
        Component: SharedLook,
      },
    ],
  },
]);