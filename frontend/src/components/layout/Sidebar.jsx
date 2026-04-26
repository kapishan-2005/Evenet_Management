import { NavLink } from 'react-router-dom';
import {
  CalendarDays, Users, BarChart2,
  Inbox, Settings, PlusCircle
} from 'lucide-react';

const navItems = [
  { label: 'Events',     icon: CalendarDays, path: '/events' },
  { label: 'Users',      icon: Users,        path: '/users' },
  { label: 'Reports',    icon: BarChart2,     path: '/reports' },
  { label: 'Inbox',      icon: Inbox,         path: '/inbox' },
  { label: 'Settings',   icon: Settings,      path: '/settings' },
  { label: 'Post Event', icon: PlusCircle,    path: '/post-event' },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-44 bg-[#141414] flex flex-col justify-between py-8 px-4 z-50 border-r border-[#222]">

      {/* Logo */}
      <div>
        <div className="mb-10 px-2">
          <h1 className="text-[#FFE500] font-bold text-sm uppercase tracking-widest leading-tight">
            Golden<br />Curator
          </h1>
          <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-wider">
            Admin Board
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-[#FFE500] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#222]'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-[#FFE500] flex items-center justify-center text-black text-xs font-bold">
            C
          </div>
          <div>
            <p className="text-white text-xs font-medium">Chief Curator</p>
            <p className="text-gray-500 text-[10px]">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}