import React, { useState } from 'react';

import { NavLink, Outlet } from 'react-router-dom';

import {
  LayoutDashboard,
  ScrollText,
  ListChecks,
  MapPinned,
  FileStack,
  History,
  Users,
  ClipboardList,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/schemes', label: 'Schemes', icon: ScrollText },
  { to: '/admin/rules', label: 'Rules', icon: ListChecks },
  { to: '/admin/partners', label: 'Partners', icon: MapPinned },
  { to: '/admin/documents', label: 'Documents', icon: FileStack },
  { to: '/admin/updates', label: 'Updates', icon: History },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/applications', label: 'Applications', icon: ClipboardList },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">

      {/* Desktop Sidebar - unchanged */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="card p-3 sticky top-20">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <l.icon size={16} /> {l.label}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Mobile Admin Navigation */}
      <div className="md:hidden absolute top-20 left-0 z-30">

        {/* Open Arrow */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="
              bg-white
              border border-slate-200
              border-l-0
              rounded-r-lg
              shadow-md
              p-2
              text-slate-600
              hover:text-brand-700
              flex items-center justify-center
            "
            aria-label="Open admin navigation"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Sliding Admin Menu */}
        {open && (
          <div
            className="
              relative
              w-64
              bg-white
              border border-slate-200
              rounded-r-xl
              shadow-xl
              p-3
            "
          >

            {/* Menu Header */}
            <div className="flex items-center gap-2 px-3 py-2 mb-2 text-sm font-semibold text-slate-800">
              <LayoutDashboard size={18} />
              Admin Navigation
            </div>

            {/* Navigation Links */}
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <l.icon size={16} /> {l.label}
              </NavLink>
            ))}

            {/* Close Arrow - attached to menu */}
            <button
              onClick={() => setOpen(false)}
              className="
                absolute
                top-1/2
                -translate-y-1/2
                -right-9
                bg-white
                border border-slate-200
                rounded-r-lg
                shadow-md
                p-2
                text-slate-600
                hover:text-brand-700
                flex items-center justify-center
              "
              aria-label="Close admin navigation"
            >
              <ChevronLeft size={22} />
            </button>

          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>

    </div>
  );
}