import React from 'react';
import { Users, FileText, BookOpen, Calendar, ClipboardCheck } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import TabView from '@/components/TabView';
import { Card } from '@/components/ui/card';
import CardGrid from '@/components/CardGrid';
import StatCard from '@/components/StatCard';
import { Separator } from '@/components/ui/separator';
import TeamDashboard from '@/components/TeamDashboard';

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
        <h3 className="text-lg font-semibold mb-2">Project Proposal</h3>
        <p className="text-muted-foreground mb-4">Due: October 15, 2025</p>
        <div className="bg-secondary p-3 rounded-md text-sm mb-4">
          <p>Submit a 2-3 page proposal outlining your project idea, objectives, methodology, and expected outcomes.</p>
        </div>
        <div className="flex justify-end">
          <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-sm">Submitted</div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <h3 className="text-lg font-semibold mb-2">Progress Report</h3>
        <p className="text-muted-foreground mb-4">Due: January 10, 2026</p>
        <div className="bg-secondary p-3 rounded-md text-sm mb-4">
          <p>Submit a progress report detailing work completed, challenges faced, and next steps.</p>
        </div>
        <div className="flex justify-end">
          <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm">Pending</div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <h3 className="text-lg font-semibold mb-2">Final Report</h3>
        <p className="text-muted-foreground mb-4">Due: April 20, 2026</p>
        <div className="bg-secondary p-3 rounded-md text-sm mb-4">
          <p>Submit your final project report including all documentation, code, and presentation slides.</p>
        </div>
        <div className="flex justify-end">
          <div className="bg-neutral-500/20 text-neutral-500 px-3 py-1 rounded-full text-sm">Not Started</div>
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
    <Card className="dashboard-card">
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-border"></div>
        
        <div className="relative flex gap-4 pb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10">
            <Calendar size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Project Kickoff</h3>
            <p className="text-sm text-muted-foreground mb-2">September 5, 2025</p>
            <div className="bg-secondary p-3 rounded-md text-sm">
              <p>Team formation and project topic selection deadline.</p>
            </div>
            <div className="mt-2 bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs inline-flex">
              Completed
            </div>
          </div>
        </div>
        
        <div className="relative flex gap-4 pb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10">
            <FileText size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Project Proposal</h3>
            <p className="text-sm text-muted-foreground mb-2">October 15, 2025</p>
            <div className="bg-secondary p-3 rounded-md text-sm">
              <p>Submit initial project proposal document.</p>
            </div>
            <div className="mt-2 bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs inline-flex">
              Completed
            </div>
          </div>
        </div>
        
        <div className="relative flex gap-4 pb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10">
            <ClipboardCheck size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">First Review</h3>
            <p className="text-sm text-muted-foreground mb-2">December 1, 2025</p>
            <div className="bg-secondary p-3 rounded-md text-sm">
              <p>First progress review presentation with mentor.</p>
            </div>
            <div className="mt-2 bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs inline-flex">
              In Progress
            </div>
          </div>
        </div>
        
        <div className="relative flex gap-4 pb-8">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0 z-10">
            <FileText size={24} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Progress Report</h3>
            <p className="text-sm text-muted-foreground mb-2">January 10, 2026</p>
            <div className="bg-secondary p-3 rounded-md text-sm">
              <p>Submit detailed progress report document.</p>
            </div>
            <div className="mt-2 bg-neutral-500/20 text-neutral-500 px-3 py-1 rounded-full text-xs inline-flex">
              Upcoming
            </div>
          </div>
        </div>
        
        <div className="relative flex gap-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0 z-10">
            <FileText size={24} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Final Submission</h3>
            <p className="text-sm text-muted-foreground mb-2">April 20, 2026</p>
            <div className="bg-secondary p-3 rounded-md text-sm">
              <p>Submit final project report and code.</p>
            </div>
            <div className="mt-2 bg-neutral-500/20 text-neutral-500 px-3 py-1 rounded-full text-xs inline-flex">
              Upcoming
            </div>
          </div>
        </div>
      </div>
    </Card>
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
