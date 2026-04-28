import { JSX } from "react";
import { NavLink } from "react-router";
import { FaCog, FaImage } from "react-icons/fa"

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
        `w-full text-center p-3 text-lg font-medium flex justify-center items-center gap-2 rounded-full md:px-3 md:py-2 md:rounded-md ${isActive ? "bg-(--main-primary)" : ""} hover:bg-(--main-secondary-light)`
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
    <aside>
      <nav>
        <NavItems icon={<FaImage />} location="/" text="Images" />
        <NavItems icon={<FaCog />} location="/settings" text="Settings" />
      </nav>
    </aside>
  );
};

export { AppNavigationDeskTop };
