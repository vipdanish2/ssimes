
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, CheckCircle2, LucideBarChart, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              SSIEMS Project Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A centralized platform for managing and tracking student projects from inception to completion
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-secondary rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Tailored dashboards and features for students, mentors, and administrators.
              </p>
            </div>
            
            <div className="p-6 bg-secondary rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resource Management</h3>
              <p className="text-muted-foreground">
                Access to project guidelines, templates, and reference materials.
              </p>
            </div>
            
            <div className="p-6 bg-secondary rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle2 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Submission Tracking</h3>
              <p className="text-muted-foreground">
                Manage project milestones, submissions, and receive timely feedback.
              </p>
            </div>
            
            <div className="p-6 bg-secondary rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <LucideBarChart className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Monitoring</h3>
              <p className="text-muted-foreground">
                Track team performance and project advancement with visual analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">For Every User Role</h2>
          
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Students</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Form teams and collaborate with peers</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Track submission deadlines and project timelines</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Access learning resources and documentation templates</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Communicate with assigned mentors for guidance</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card border border-border p-6 rounded-lg">
                <div className="aspect-video rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-xl font-medium text-primary">Student Dashboard Preview</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-semibold mb-4">Mentors</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Monitor assigned teams and their progress</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Review and provide feedback on submissions</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Schedule meetings and communicate with teams</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Provide resources and guidance to students</span>
                  </li>
                </ul>
              </div>
              <div className="order-2 md:order-1 bg-card border border-border p-6 rounded-lg">
                <div className="aspect-video rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-xl font-medium text-primary">Mentor Dashboard Preview</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Administrators</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Manage mentor assignments and team allocations</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Publish announcements and updates to all users</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Oversee all teams and their project status</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="mr-2 text-primary mt-1 shrink-0" size={16} />
                    <span>Configure platform settings and deadlines</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card border border-border p-6 rounded-lg">
                <div className="aspect-video rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-xl font-medium text-primary">Admin Dashboard Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join SSIEMS Project Hub to streamline your project management experience and focus on creating innovative solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/register">Create an Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground">© 2025 SSIEMS Project Hub. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
