
import React from 'react';
import { Users, Bell, Settings, ClipboardList, ArrowUpRight, ArrowDownRight, UserCheck, FileCheck, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import TabView from '@/components/TabView';
import { Card } from '@/components/ui/card';
import CardGrid from '@/components/CardGrid';
import StatCard from '@/components/StatCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sidebar items for admin dashboard
const sidebarItems = [
  {
    title: 'Mentor Management',
    path: '/admin-dashboard',
    icon: <UserCheck size={18} />,
  },
  {
    title: 'All Teams',
    path: '/admin-dashboard/teams',
    icon: <Users size={18} />,
  },
  {
    title: 'Announcements',
    path: '/admin-dashboard/announcements',
    icon: <Bell size={18} />,
  },
  {
    title: 'Settings',
    path: '/admin-dashboard/settings',
    icon: <Settings size={18} />,
  },
];

// Demo content for tabs
const MentorManagementContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Mentor Overview</h2>
    <CardGrid columns={3}>
      <StatCard 
        title="Total Mentors" 
        value="10" 
        icon={<UserCheck size={20} />}
        description="Currently active"
      />
      <StatCard 
        title="Total Teams" 
        value="25" 
        icon={<Users size={20} />}
        description="Assigned across mentors"
      />
      <StatCard 
        title="Avg. Teams per Mentor" 
        value="2.5" 
        icon={<ClipboardList size={20} />}
        description="2-3 teams per mentor"
      />
    </CardGrid>
    
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-8 mb-4">
      <h3 className="section-heading mb-0">Mentor List</h3>
      <Button className="mt-2 sm:mt-0">Add New Mentor</Button>
    </div>
    
    <Card className="dashboard-card">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="font-medium">Dr. James Wilson</h4>
            <p className="text-sm text-muted-foreground">AI & Machine Learning</p>
            <p className="text-sm text-muted-foreground">james.wilson@ssiems.edu</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="text-sm bg-secondary px-3 py-1 rounded-full">
              5 Teams Assigned
            </div>
            <Button variant="outline" size="sm">View Teams</Button>
            <Button size="sm">Edit</Button>
          </div>
        </div>
        <Separator />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="font-medium">Dr. Sarah Johnson</h4>
            <p className="text-sm text-muted-foreground">Database Systems</p>
            <p className="text-sm text-muted-foreground">sarah.johnson@ssiems.edu</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="text-sm bg-secondary px-3 py-1 rounded-full">
              3 Teams Assigned
            </div>
            <Button variant="outline" size="sm">View Teams</Button>
            <Button size="sm">Edit</Button>
          </div>
        </div>
        <Separator />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="font-medium">Dr. Michael Chen</h4>
            <p className="text-sm text-muted-foreground">Web Technologies</p>
            <p className="text-sm text-muted-foreground">michael.chen@ssiems.edu</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="text-sm bg-secondary px-3 py-1 rounded-full">
              4 Teams Assigned
            </div>
            <Button variant="outline" size="sm">View Teams</Button>
            <Button size="sm">Edit</Button>
          </div>
        </div>
        <Separator />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="font-medium">Dr. Emily Rodriguez</h4>
            <p className="text-sm text-muted-foreground">Mobile App Development</p>
            <p className="text-sm text-muted-foreground">emily.rodriguez@ssiems.edu</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="text-sm bg-secondary px-3 py-1 rounded-full">
              3 Teams Assigned
            </div>
            <Button variant="outline" size="sm">View Teams</Button>
            <Button size="sm">Edit</Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const AllTeamsContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Teams Overview</h2>
    <CardGrid columns={4}>
      <StatCard 
        title="Total Teams" 
        value="25" 
        icon={<Users size={20} />}
        description="Active teams"
      />
      <StatCard 
        title="On Schedule" 
        value="18" 
        icon={<FileCheck size={20} />}
        trend={{ value: 5, isPositive: true }}
        description="72% of teams"
      />
      <StatCard 
        title="At Risk" 
        value="5" 
        icon={<AlertCircle size={20} />}
        trend={{ value: 2, isPositive: false }}
        description="20% of teams"
      />
      <StatCard 
        title="Behind Schedule" 
        value="2" 
        icon={<AlertCircle size={20} />}
        description="8% of teams"
      />
    </CardGrid>
    
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 mb-6">
      <h3 className="section-heading mb-0">Team List</h3>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 w-full sm:w-auto mt-4 sm:mt-0">
        <div className="w-full sm:w-[200px]">
          <Input placeholder="Search teams..." />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    
    <Card className="dashboard-card">
      <div className="space-y-6">
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Alpha</h4>
              <p className="text-sm text-muted-foreground">Smart Agriculture System</p>
              <p className="text-sm text-muted-foreground">Mentor: Dr. James Wilson</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-2">
                On Track
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Beta</h4>
              <p className="text-sm text-muted-foreground">AI-based Diagnostic Tool</p>
              <p className="text-sm text-muted-foreground">Mentor: Dr. Sarah Johnson</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs mr-2">
                At Risk
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Gamma</h4>
              <p className="text-sm text-muted-foreground">Blockchain Supply Chain</p>
              <p className="text-sm text-muted-foreground">Mentor: Dr. Michael Chen</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-2">
                On Track
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Delta</h4>
              <p className="text-sm text-muted-foreground">AR Navigation System</p>
              <p className="text-sm text-muted-foreground">Mentor: Dr. Emily Rodriguez</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-2">
                On Track
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        </div>
        <Separator />
        
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">Team Epsilon</h4>
              <p className="text-sm text-muted-foreground">NLP Chatbot for Education</p>
              <p className="text-sm text-muted-foreground">Mentor: Dr. James Wilson</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-rose-500/20 text-rose-500 px-3 py-1 rounded-full text-xs mr-2">
                Delayed
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
          <div className="space-y-2 mt-3">
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

const AnnouncementsContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Announcements</h2>
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
      <div className="mb-4 sm:mb-0">
        <p className="text-muted-foreground">Create and manage announcements for all users</p>
      </div>
      <Button>Create New Announcement</Button>
    </div>
    
    <CardGrid columns={1}>
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Final Submission Date Extended</h3>
            <p className="text-sm text-muted-foreground">Published: October 10, 2025</p>
          </div>
          <div className="flex mt-2 md:mt-0">
            <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-3 flex items-center">
              Active
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        <div className="bg-secondary p-3 rounded-md text-sm mb-3">
          <p>Due to multiple requests, the final submission deadline has been extended by one week to April 27, 2026. Please use this additional time to refine your projects and documentation.</p>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Visible to: All Users</span>
          <span>Expires: April 27, 2026</span>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Workshop: Advanced Project Documentation</h3>
            <p className="text-sm text-muted-foreground">Published: October 5, 2025</p>
          </div>
          <div className="flex mt-2 md:mt-0">
            <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs mr-3 flex items-center">
              Active
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        <div className="bg-secondary p-3 rounded-md text-sm mb-3">
          <p>We are hosting a workshop on advanced project documentation techniques on October 25, 2025, from 2:00 PM to 4:00 PM in Room CS301. All team members are encouraged to attend.</p>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Visible to: Students, Mentors</span>
          <span>Expires: October 25, 2025</span>
        </div>
      </Card>
      
      <Card className="dashboard-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Mentor Evaluation Forms Due</h3>
            <p className="text-sm text-muted-foreground">Published: September 30, 2025</p>
          </div>
          <div className="flex mt-2 md:mt-0">
            <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs mr-3 flex items-center">
              Expired
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        <div className="bg-secondary p-3 rounded-md text-sm mb-3">
          <p>Reminder to all mentors: First-round evaluation forms are due by October 5, 2025. Please submit your evaluations through the portal.</p>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Visible to: Mentors</span>
          <span>Expired: October 5, 2025</span>
        </div>
      </Card>
    </CardGrid>
  </div>
);

const SettingsContent = () => (
  <div className="space-y-6">
    <h2 className="project-heading">Platform Settings</h2>
    <Card className="dashboard-card">
      <h3 className="text-lg font-semibold mb-4">General Settings</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Academic Year</label>
            <Select defaultValue="2025-2026">
              <SelectTrigger>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
                <SelectItem value="2026-2027">2026-2027</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Current Semester</label>
            <Select defaultValue="fall">
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Platform Name</label>
          <Input defaultValue="SSIEMS Project Hub" />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Contact Email</label>
          <Input defaultValue="projects@ssiems.edu" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mt-8 mb-4">Timeline Settings</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Project Proposal Deadline</label>
            <Input type="date" defaultValue="2025-10-15" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Progress Report Deadline</label>
            <Input type="date" defaultValue="2026-01-10" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Final Submission Deadline</label>
            <Input type="date" defaultValue="2026-04-27" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Final Presentation Date</label>
            <Input type="date" defaultValue="2026-05-10" />
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mt-8 mb-4">User Registration</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allow-student-reg"
            className="mr-2 w-4 h-4"
            defaultChecked
          />
          <label htmlFor="allow-student-reg" className="text-sm font-medium">
            Allow student registration
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allow-mentor-reg"
            className="mr-2 w-4 h-4"
          />
          <label htmlFor="allow-mentor-reg" className="text-sm font-medium">
            Allow mentor registration (require admin approval)
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="email-verification"
            className="mr-2 w-4 h-4"
            defaultChecked
          />
          <label htmlFor="email-verification" className="text-sm font-medium">
            Require email verification for new accounts
          </label>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </Card>
  </div>
);

const AdminDashboard = () => {
  const tabs = [
    {
      id: 'mentors',
      label: 'Mentor Management',
      content: <MentorManagementContent />,
    },
    {
      id: 'teams',
      label: 'All Teams',
      content: <AllTeamsContent />,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      content: <AnnouncementsContent />,
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <SettingsContent />,
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Admin Dashboard">
      <TabView tabs={tabs} defaultTab="mentors" />
    </DashboardLayout>
  );
};

export default AdminDashboard;
