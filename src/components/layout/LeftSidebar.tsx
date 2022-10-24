import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
} from '@heroicons/react/24/solid';

import SidebarTab from './SidebarTab';
import { APP_VERSION } from '../../constants/common';
import { useRouter } from 'next/router';
import Logo from '../common/Logo';
import { SidebarProps } from '../../types/SidebarProps';

function LeftSidebar({ className }: SidebarProps) {
  const router = useRouter();

  return (
    <div
      className={`${className} hidden md:block group z-20 h-full fixed flex-col justify-center items-center top-0 left-0 border-r border-zinc-800/80 bg-zinc-900 backdrop-blur-lg`}
    >
      <div className="w-full h-full flex flex-col">
        <div className="pl-[0.21rem] pb-4 mx-3 mt-4 relative flex justify-start overflow-hidden border-b border-zinc-700">
          <Logo showLabel />
        </div>
        <div className="overflow-auto h-full">
          <div className="mt-4 p-2 flex flex-col items-start gap-6">
            <SidebarTab
              href="/"
              currentPath={router.pathname}
              icon={<HomeIcon />}
              label="Dashboard"
            />
            <SidebarTab
              href="/tasks"
              currentPath={router.pathname}
              icon={<ClipboardDocumentListIcon />}
              label="Tasks"
            />
            <SidebarTab
              href="/calendar"
              currentPath={router.pathname}
              icon={<CalendarIcon />}
              label="Calendar"
            />
          </div>
        </div>
        <div className="opacity-0 whitespace-nowrap group-hover:opacity-100 transition group-hover:duration-500 group-hover:delay-200 p-2 text-center text-zinc-500 font-semibold text-sm cursor-default">
          Version {APP_VERSION}
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
