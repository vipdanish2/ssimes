
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import TimelineEditor from '@/components/admin/TimelineEditor';
import TimelineManagement from '@/components/admin/TimelineManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Settings, Users, BarChart3 } from 'lucide-react';

const adminSidebarItems = [
  {
    title: 'Dashboard',
    path: '/admin-dashboard',
    icon: <BarChart3 size={18} />,
  },
  {
    title: 'Timeline Events',
    path: '/admin-dashboard/timeline',
    icon: <Calendar size={18} />,
  },
  {
    title: 'User Management',
    path: '/admin-dashboard/users',
    icon: <Users size={18} />,
  },
  {
    title: 'Settings',
    path: '/admin-dashboard/settings',
    icon: <Settings size={18} />,
  },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="Admin Dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage project timeline, events, and system administration
          </p>
        </div>

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline">Timeline Events</TabsTrigger>
            <TabsTrigger value="legacy-timeline">Legacy Timeline</TabsTrigger>
            <TabsTrigger value="overview">System Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineManagement />
          </TabsContent>

          <TabsContent value="legacy-timeline">
            <TimelineEditor />
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">
                    Registered students
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">
                    Teams with submissions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Timeline Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">
                    Active events
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
