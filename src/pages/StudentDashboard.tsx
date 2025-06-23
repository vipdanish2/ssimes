
import React from 'react';
import { Users, FileText, BookOpen, Calendar, ClipboardCheck } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import TabView from '@/components/TabView';
import { Card } from '@/components/ui/card';
import CardGrid from '@/components/CardGrid';
import StatCard from '@/components/StatCard';
import { Separator } from '@/components/ui/separator';
import TeamDashboard from '@/components/TeamDashboard';
import TimelineDisplay from '@/components/TimelineDisplay';

// Sidebar items for student dashboard
const sidebarItems = [
  {
    title: 'My Team',
    path: '/dashboard',
    icon: <Users size={18} />,
  },
  {
    title: 'Submissions',
    path: '/dashboard/submissions',
    icon: <FileText size={18} />,
  },
  {
    title: 'Resources',
    path: '/dashboard/resources',
    icon: <BookOpen size={18} />,
  },
  {
    title: 'Timeline',
    path: '/dashboard/timeline',
    icon: <Calendar size={18} />,
  },
];

// Demo content for tabs
const MyTeamContent = () => (
  <div className="space-y-6">
    <TeamDashboard />
  </div>
);

const SubmissionsContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Project Submissions</h2>
    <CardGrid columns={1}>
      <Card className="dashboard-card">
        <h3 className="text-lg font-semibold mb-2">Required Submissions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
            <div>
              <p className="font-medium">Abstract</p>
              <p className="text-sm text-muted-foreground">Upload your project abstract (PDF)</p>
            </div>
            <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm">Pending</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
            <div>
              <p className="font-medium">PowerPoint Presentation</p>
              <p className="text-sm text-muted-foreground">Upload your presentation slides</p>
            </div>
            <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm">Pending</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
            <div>
              <p className="font-medium">Final Report</p>
              <p className="text-sm text-muted-foreground">Upload your final project report</p>
            </div>
            <div className="bg-neutral-500/20 text-neutral-500 px-3 py-1 rounded-full text-sm">Not Started</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
            <div>
              <p className="font-medium">Repository Link</p>
              <p className="text-sm text-muted-foreground">Provide GitHub repository link</p>
            </div>
            <div className="bg-neutral-500/20 text-neutral-500 px-3 py-1 rounded-full text-sm">Not Started</div>
          </div>
        </div>
      </Card>
    </CardGrid>
  </div>
);

const ResourcesContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Learning Resources</h2>
    <CardGrid columns={2}>
      <Card className="dashboard-card">
        <h3 className="text-lg font-semibold mb-2">Project Guidelines</h3>
        <p className="text-muted-foreground mb-4">Latest version: v2.1</p>
        <div className="bg-secondary p-3 rounded-md text-sm">
          <p>Comprehensive guide to project requirements, evaluation criteria, and submission formats.</p>
        </div>
        <div className="mt-4 flex justify-end">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
            <FileText size={14} className="mr-1" />
            Download PDF
          </div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <h3 className="text-lg font-semibold mb-2">Research Paper Templates</h3>
        <p className="text-muted-foreground mb-4">IEEE Format</p>
        <div className="bg-secondary p-3 rounded-md text-sm">
          <p>Templates and examples for formatting your final research paper according to IEEE guidelines.</p>
        </div>
        <div className="mt-4 flex justify-end">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
            <FileText size={14} className="mr-1" />
            Download Template
          </div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <h3 className="text-lg font-semibold mb-2">Presentation Guidelines</h3>
        <p className="text-muted-foreground mb-4">For final defense</p>
        <div className="bg-secondary p-3 rounded-md text-sm">
          <p>Instructions and tips for preparing your final project presentation and defense.</p>
        </div>
        <div className="mt-4 flex justify-end">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
            <FileText size={14} className="mr-1" />
            View Guidelines
          </div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <h3 className="text-lg font-semibold mb-2">Past Projects</h3>
        <p className="text-muted-foreground mb-4">Examples from previous years</p>
        <div className="bg-secondary p-3 rounded-md text-sm">
          <p>Browse exemplary projects from previous batches for inspiration and reference.</p>
        </div>
        <div className="mt-4 flex justify-end">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
            <BookOpen size={14} className="mr-1" />
            Browse Projects
          </div>
        </div>
      </Card>
    </CardGrid>
  </div>
);

const TimelineContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Project Timeline</h2>
    <p className="text-muted-foreground">
      View important project milestones and deadlines set by your administrators.
    </p>
    <TimelineDisplay />
  </div>
);

const StudentDashboard = () => {
  const tabs = [
    {
      id: 'team',
      label: 'My Team',
      content: <MyTeamContent />,
    },
    {
      id: 'submissions',
      label: 'Submissions',
      content: <SubmissionsContent />,
    },
    {
      id: 'resources',
      label: 'Resources',
      content: <ResourcesContent />,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      content: <TimelineContent />,
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Dashboard">
      <TabView tabs={tabs} defaultTab="team" />
    </DashboardLayout>
  );
};

export default StudentDashboard;
