
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ResourcesList from '@/components/ResourcesList';
import TimelineDisplay from '@/components/TimelineDisplay';
import SimpleTeamForm from '@/components/form/SimpleTeamForm';
import TimelineFileUpload from '@/components/form/TimelineFileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Calendar, Upload } from 'lucide-react';

const sidebarItems = [
  {
    title: 'My Team',
    path: '/dashboard',
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: 'Resources',
    path: '/dashboard/resources',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: 'Timeline',
    path: '/dashboard/timeline',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: 'Submissions',
    path: '/dashboard/submissions',
    icon: <Upload className="h-4 w-4" />,
  },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your team information, access resources, and submit your project deliverables
          </p>
        </div>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">My Team</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <SimpleTeamForm />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourcesList />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <TimelineDisplay />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <TimelineFileUpload />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
