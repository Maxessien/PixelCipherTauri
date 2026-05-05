import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import { AppNavigationDeskTop, AppNavigationMobile } from "./AppNavigation";


const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <AppHeader />
      <main className="md:grid flex-1 md:grid-cols-[25%_75%]">
        <AppNavigationDeskTop />
        <section className="w-full h-full flex px-4 py-5 flex-col">
          <div className="flex-1 w-full overflow-y-auto">{children}</div>
          <AppNavigationMobile />
        </section>
      </main>
    </div>
  );
};

export default AppLayout;
