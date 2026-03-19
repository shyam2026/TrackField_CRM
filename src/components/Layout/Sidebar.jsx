import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Building2, Users, CreditCard, BarChart2,
  UserCog, Zap, Settings, Package, ChevronLeft, ChevronRight,
  LogOut, TrendingUp, CheckSquare, Contact, Ticket, Mail,
  Shield, FileText, Layers, Calendar, Activity
} from 'lucide-react';

const SUPER_ADMIN_NAV = [
  { path: '/admin/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/admin/companies',    label: 'Companies',     icon: Building2 },
  { path: '/admin/users',        label: 'All Users',     icon: Users },
  { path: '/admin/plans',        label: 'Plans',         icon: Package },
  { path: '/admin/analytics',    label: 'Analytics',     icon: BarChart2 },
  { path: '/admin/activity-log', label: 'Activity Log',  icon: Activity },
];

const COMPANY_ADMIN_NAV = [
  { path: '/company/dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/company/employees',  label: 'Employees',      icon: Users },
  { path: '/company/leads',      label: 'Leads',          icon: TrendingUp,  module: 'leads' },
  { path: '/company/deals',      label: 'Deals',          icon: Layers,      module: 'deals' },
  { path: '/company/contacts',   label: 'Contacts',       icon: Contact,     module: 'contacts' },
  { path: '/company/calendar',   label: 'Calendar',       icon: Calendar,    module: 'tasks' },
  { path: '/company/payments',   label: 'Payments',       icon: CreditCard,  module: 'payments' },
  { path: '/company/automation', label: 'Automation',     icon: Zap,         module: 'automation' },
  { path: '/company/reports',    label: 'Reports',        icon: BarChart2,   module: 'reports' },
  { path: '/company/modules',    label: 'Module Control', icon: Shield },
  { path: '/company/settings',   label: 'Settings',       icon: Settings },
];

const USER_NAV_BASE = [
  { path: '/user/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { path: '/user/leads',     label: 'My Leads',   icon: TrendingUp,  module: 'leads',    roles: ['sales','manager'] },
  { path: '/user/deals',     label: 'My Deals',   icon: Layers,      module: 'deals',    roles: ['sales','manager'] },
  { path: '/user/tasks',     label: 'Tasks',      icon: CheckSquare, module: 'tasks' },
  { path: '/user/contacts',  label: 'Contacts',   icon: Contact,     module: 'contacts', roles: ['sales','manager','support'] },
  { path: '/user/tickets',   label: 'Tickets',    icon: Ticket,      module: 'tickets',  roles: ['support','manager'] },
];

export default function Sidebar({ role, open, setOpen }) {
  const { currentUser, currentCompany, logout, isModuleEnabled } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let navItems = [];
  if (role === 'super_admin') navItems = SUPER_ADMIN_NAV;
  else if (role === 'company_admin') navItems = COMPANY_ADMIN_NAV;
  else navItems = USER_NAV_BASE;

  // Filter by module enabled + role
  const filteredNav = navItems.filter(item => {
    if (item.module && role !== 'super_admin') {
      if (!isModuleEnabled(item.module)) return false;
    }
    if (item.roles && currentUser) {
      if (!item.roles.includes(currentUser.role)) return false;
    }
    return true;
  });

  const roleLabel = role === 'super_admin' ? 'Super Admin' : role === 'company_admin' ? 'Company Admin' : 'User';
  const roleBadgeColor = role === 'super_admin' ? '#A855F7' : role === 'company_admin' ? '#0EA5E9' : '#10B981';

  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-300"
      style={{
        width: open ? '240px' : '64px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-primary)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid var(--border-primary)', minHeight: 64 }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)' }}>
          <span className="font-display font-800 text-white text-sm tracking-widest">TF</span>
        </div>
        {open && (
          <div>
            <div className="font-display font-700 tracking-widest text-base" style={{ color: 'var(--text-primary)', letterSpacing: '0.12em' }}>
              TRACKFIELD
            </div>
            <div className="text-xs font-mono font-500" style={{ color: roleBadgeColor, marginTop: 1 }}>
              {roleLabel}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {open && (
          <p className="px-3 mb-2 text-xs font-700 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Navigation
          </p>
        )}
        <div className="flex flex-col gap-1">
          {filteredNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                title={!open ? item.label : ''}
              >
                <Icon size={17} className="flex-shrink-0" />
                {open && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Company info for company_admin */}
        {open && role === 'company_admin' && currentCompany && (
          <div className="mt-6 mx-1 rounded-lg p-3" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)' }}>
            <p className="text-xs font-600 mb-1" style={{ color: 'var(--accent-blue)' }}>Company</p>
            <p className="text-sm font-600" style={{ color: 'var(--text-primary)' }}>{currentCompany.name}</p>
            <p className="text-xs capitalize mt-1" style={{ color: 'var(--text-muted)' }}>
              {currentCompany.plan} plan
            </p>
          </div>
        )}
      </nav>

      {/* User + Collapse */}
      <div style={{ borderTop: '1px solid var(--border-primary)' }}>
        {currentUser && (
          <div className="flex items-center gap-3 p-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-700"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)', color: 'white' }}>
              {currentUser.avatar || currentUser.name?.[0]}
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 truncate" style={{ color: 'var(--text-primary)' }}>{currentUser.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{currentUser.email}</p>
              </div>
            )}
            {open && (
              <button onClick={handleLogout} className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10" title="Logout">
                <LogOut size={15} style={{ color: 'var(--accent-red)' }} />
              </button>
            )}
          </div>
        )}
        {/* Collapse button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center py-2.5 text-xs transition-colors"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-primary)' }}
        >
          {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}