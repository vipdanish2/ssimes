
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import TeamDashboard from '@/components/TeamDashboard';
import ResourcesList from '@/components/ResourcesList';
import TimelineDisplay from '@/components/TimelineDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your team, submissions, and access resources
          </p>
        </div>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team">My Team</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <TeamDashboard />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourcesList />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <TimelineDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
