import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BarChart2, FileText, Users, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart2,
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: FileText,
    },
    {
      name: 'Contacts',
      href: '/contacts',
      icon: Users,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 border-r bg-muted/50">
      <div className="p-6">
        <h1 className="text-xl font-semibold">InfluencerReach</h1>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-muted hover:text-primary',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'data-[state=active]:bg-muted data-[state=active]:text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
