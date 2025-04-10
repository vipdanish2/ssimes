import React from 'react';
// ... keep existing code (other imports)

// Add Calendar import
import { Users, MessageSquare, ClipboardList, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import TabView from '@/components/TabView';
import { Card } from '@/components/ui/card';
import CardGrid from '@/components/CardGrid';
import StatCard from '@/components/StatCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// Add this import
import TimelineDisplay from '@/components/TimelineDisplay';

// Sidebar items for mentor dashboard
const sidebarItems = [
  {
    title: 'Assigned Teams',
    path: '/mentor-dashboard',
    icon: <Users size={18} />,
  },
  {
    title: 'Submissions Review',
    path: '/mentor-dashboard/submissions',
    icon: <ClipboardList size={18} />,
  },
  {
    title: 'Messages',
    path: '/mentor-dashboard/messages',
    icon: <MessageSquare size={18} />,
  },
  {
    title: 'Timeline',
    path: '/mentor-dashboard/timeline',
    icon: <Calendar size={18} />,
  },
];

// Demo content for tabs
const AssignedTeamsContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Your Assigned Teams</h2>
    <CardGrid columns={3}>
      <StatCard 
        title="Total Teams" 
        value="5" 
        icon={<Users size={20} />}
        description="Currently mentoring"
      />
      <StatCard 
        title="Review Pending" 
        value="3" 
        icon={<ClipboardList size={20} />}
        trend={{ value: 20, isPositive: false }}
        description="Submissions awaiting review"
      />
      <StatCard 
        title="Upcoming Meetings" 
        value="2" 
        icon={<MessageSquare size={20} />}
        description="Scheduled for this week"
      />
    </CardGrid>
    
    <h3 className="section-heading mt-8">Team Progress Overview</h3>
    <Card className="dashboard-card">
      <div className="space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Alpha</h4>
              <p className="text-sm text-muted-foreground">Smart Agriculture System</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-2">
                On Track
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Beta</h4>
              <p className="text-sm text-muted-foreground">AI-based Diagnostic Tool</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs mr-2">
                Needs Attention
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Gamma</h4>
              <p className="text-sm text-muted-foreground">Blockchain Supply Chain</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-2">
                On Track
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Delta</h4>
              <p className="text-sm text-muted-foreground">AR Navigation System</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-2">
                On Track
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Epsilon</h4>
              <p className="text-sm text-muted-foreground">NLP Chatbot for Education</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="bg-rose-500/20 text-rose-500 px-3 py-1 rounded-full text-xs mr-2">
                Delayed
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>30%</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const SubmissionsReviewContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Pending Reviews</h2>
    <CardGrid columns={1}>
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Project Proposal</h3>
            <p className="text-muted-foreground">Team Alpha - Smart Agriculture System</p>
            <p className="text-sm text-muted-foreground mt-1">Submitted: October 12, 2025</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Review Submission</Button>
          </div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Progress Report</h3>
            <p className="text-muted-foreground">Team Beta - AI-based Diagnostic Tool</p>
            <p className="text-sm text-muted-foreground mt-1">Submitted: October 15, 2025</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Review Submission</Button>
          </div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Project Proposal</h3>
            <p className="text-muted-foreground">Team Epsilon - NLP Chatbot for Education</p>
            <p className="text-sm text-muted-foreground mt-1">Submitted: October 14, 2025</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Review Submission</Button>
          </div>
        </div>
      </Card>
    </CardGrid>
    
    <h3 className="section-heading mt-8">Recently Reviewed</h3>
    <CardGrid columns={1}>
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Project Proposal</h3>
            <p className="text-muted-foreground">Team Gamma - Blockchain Supply Chain</p>
            <p className="text-sm text-muted-foreground mt-1">Reviewed: October 10, 2025</p>
          </div>
          <div className="mt-4 md:mt-0 flex">
            <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-sm mr-3 flex items-center">
              Approved
            </div>
            <Button variant="outline">View Details</Button>
          </div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Project Proposal</h3>
            <p className="text-muted-foreground">Team Delta - AR Navigation System</p>
            <p className="text-sm text-muted-foreground mt-1">Reviewed: October 9, 2025</p>
          </div>
          <div className="mt-4 md:mt-0 flex">
            <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm mr-3 flex items-center">
              Revisions Needed
            </div>
            <Button variant="outline">View Details</Button>
          </div>
        </div>
      </Card>
    </CardGrid>
  </div>
);

const MessagesContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Student Messages</h2>
    <Card className="dashboard-card">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h4 className="font-medium">Team Alpha</h4>
              <p className="text-xs text-muted-foreground">Today, 9:42 AM</p>
            </div>
            <p className="text-sm text-muted-foreground">We're having trouble with the sensor calibration. Could we schedule a quick meeting to discuss possible solutions?</p>
            <div className="mt-3 flex">
              <Button size="sm" variant="outline" className="mr-2">Reply</Button>
              <Button size="sm">Schedule Meeting</Button>
            </div>
          </div>
        </div>
        <Separator />
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h4 className="font-medium">Team Beta</h4>
              <p className="text-xs text-muted-foreground">Yesterday, 3:15 PM</p>
            </div>
            <p className="text-sm text-muted-foreground">We've updated our project scope based on your feedback. Could you please review the attached document when you get a chance?</p>
            <div className="mt-3 flex">
              <Button size="sm" variant="outline" className="mr-2">Reply</Button>
              <Button size="sm" variant="outline">View Document</Button>
            </div>
          </div>
        </div>
        <Separator />
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h4 className="font-medium">Team Epsilon</h4>
              <p className="text-xs text-muted-foreground">Oct 12, 2025</p>
            </div>
            <p className="text-sm text-muted-foreground">We're falling behind schedule due to some unexpected technical challenges. Can we discuss a revised timeline?</p>
            <div className="mt-3 flex">
              <Button size="sm" variant="outline" className="mr-2">Reply</Button>
              <Button size="sm">Schedule Meeting</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
    
    <h3 className="section-heading mt-8">Upcoming Meetings</h3>
    <CardGrid columns={2}>
      <Card className="dashboard-card">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-4">
            <MessageSquare size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Team Alpha Check-in</h4>
            <p className="text-sm text-muted-foreground mt-1">Thursday, Oct 20 • 2:00 PM</p>
            <p className="text-sm mt-3">Agenda: Sensor calibration issues, timeline review</p>
            <div className="mt-4 space-x-2">
              <Button size="sm" variant="outline">Reschedule</Button>
              <Button size="sm">Join Meeting</Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-4">
            <MessageSquare size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Team Epsilon Progress Review</h4>
            <p className="text-sm text-muted-foreground mt-1">Friday, Oct 21 • 10:30 AM</p>
            <p className="text-sm mt-3">Agenda: Technical challenges, revised timeline</p>
            <div className="mt-4 space-x-2">
              <Button size="sm" variant="outline">Reschedule</Button>
              <Button size="sm">Join Meeting</Button>
            </div>
          </div>
        </div>
      </Card>
    </CardGrid>
  </div>
);

// Add timeline tab
const TimelineContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Project Timeline</h2>
    <TimelineDisplay />
  </div>
);

const MentorDashboard = () => {
  const tabs = [
    {
      id: 'teams',
      label: 'Assigned Teams',
      content: <AssignedTeamsContent />,
    },
    {
      id: 'submissions',
      label: 'Submissions Review',
      content: <SubmissionsReviewContent />,
    },
    {
      id: 'messages',
      label: 'Messages',
      content: <MessagesContent />,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      content: <TimelineContent />,
    }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Mentor Dashboard">
      <TabView tabs={tabs} defaultTab="teams" />
    </DashboardLayout>
  );
};

export default MentorDashboard;
// ... keep existing code (for the rest of the component)
