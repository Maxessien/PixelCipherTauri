import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import { AppNavigationDeskTop, AppNavigationMobile } from "./AppNavigation";
import Button from "../reusable/Button";
import { useLocation } from "react-router";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <main className="md:grid flex-1 md:grid-cols-[25%_75%]">
        <AppNavigationDeskTop />
        <section className="w-full h-full flex px-4 py-5 flex-col">
          <div className="flex-1 w-full overflow-auto">{children}</div>
          {location.pathname === "/" && (
            <div className="flex w-full justify-between py-3 items-center gap-2">
              <Button className="flex-1" rounded="rounded-md">
                Encode Selected
              </Button>
              <Button className="flex-1" rounded="rounded-md">
                Decode Selected
              </Button>
            </div>
          )}
          <AppNavigationMobile />
        </section>
      </main>
    </div>
  );
};

export default AppLayout;
