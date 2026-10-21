import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MusicPlayer from "../shared/MusicPlayer";

export default function MainLayout() {
  return (
    <div className="min-h-screen text-text font-body">
      {/* Fixed glassmorphism background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-indigo-100 via-fuchsia-50 to-sky-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/bg.jpg)" }}
        />
        <div className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-indigo-300/40 blur-[100px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[50%] rounded-full bg-pink-300/30 blur-[110px]" />
        <div className="absolute top-[35%] left-[55%] w-[30%] h-[30%] rounded-full bg-white/50 blur-[90px]" />
        <div className="absolute inset-0 bg-white/25 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10">
        <Header />
        <main className="pt-28">
          <Outlet />
        </main>
        <Footer />
      </div>

      <MusicPlayer />
    </div>
  );
}
