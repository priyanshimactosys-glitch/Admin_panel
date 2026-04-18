import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />

      {/* 🔥 Toast Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
}