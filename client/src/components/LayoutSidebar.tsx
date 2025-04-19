import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarTrigger } from './ui/sidebar';

export const LayoutSidebar = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-muted relative">
        <div className="p-6 min-h-screen">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="-ml-1" />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
