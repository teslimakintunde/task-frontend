import { Outlet } from "react-router-dom";
import Header from "../header/Header";

const RootLayout = () => {
  return (
    <div>
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
