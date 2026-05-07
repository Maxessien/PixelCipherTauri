import { JSX } from "react";
import { FaClock, FaCog, FaImage } from "react-icons/fa";
import { NavLink } from "react-router";

const NavItems = ({
  icon,
  location,
  text,
}: {
  text: string;
  icon: JSX.Element;
  location: string;
}) => {
  return (
    <NavLink
      className={({ isActive }) =>
        `md:w-full w-max text-center p-3 text-lg font-medium flex justify-center items-center gap-2 rounded-full md:px-3 md:py-2 md:rounded-md ${isActive ? "bg-(--main-primary) hover:bg-(--main-primary-light)" : "hover:bg-(--main-secondary-light)"}`
      }
      to={location}
    >
      <span>{icon}</span>
      <span className="hidden md:inline">{text}</span>
    </NavLink>
  );
};

const AppNavigationDeskTop = () => {
  return (
    <aside className="w-full h-full hidden md:block border-r-2 border-r-(--main-primary) bg-(--main-secondary)">
      <nav className="flex flex-col gap-3 w-full justify-start px-2 py-4">
        <NavItems icon={<FaImage />} location="/" text="Images" />
        <NavItems icon={<FaClock />} location="/history" text="History" />
        <NavItems icon={<FaCog />} location="/settings" text="Settings" />
      </nav>
    </aside>
  );
};

const AppNavigationMobile = () => {
  return (
    <aside className="w-full rounded-full md:hidden bg-(--main-secondary)">
      <nav className="flex gap-2 w-full justify-between items-center px-3 sm:px-4 py-3">
        <NavItems icon={<FaImage />} location="/" text="Images" />
        <NavItems icon={<FaClock />} location="/history" text="History" />
        <NavItems icon={<FaCog />} location="/settings" text="Settings" />
      </nav>
    </aside>
  );
};

export { AppNavigationDeskTop, AppNavigationMobile };

