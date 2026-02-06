import { RouterProvider } from "react-router";
import { router } from "@/app/routes";
import "@/i18n/config";

export default function App() {
  return <RouterProvider router={router} />;
}