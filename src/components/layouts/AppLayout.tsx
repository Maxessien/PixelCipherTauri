import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import { AppNavigationDeskTop, AppNavigationMobile } from "./AppNavigation";


const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <main className="md:grid h-[calc(100vh-77px)] md:grid-cols-[25%_75%]">
        <AppNavigationDeskTop />
        <section className="w-full h-full min-h-0 flex px-3 lg:px-4 pt-5 pb-3 flex-col">
          <div className="flex-1 w-full h-full px-1 overflow-y-auto">{children}</div>
          <AppNavigationMobile />
        </section>
      </main>
    </div>
  );
};

export default AppLayout;
