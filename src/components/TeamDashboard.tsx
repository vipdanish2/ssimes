
import React, { useEffect, useState } from 'react';
import { useTeams } from '@/hooks/useTeams';
import { Team } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamCreation from '@/components/TeamCreation';
import JoinTeamForm from '@/components/JoinTeamForm';
import TeamMembers from '@/components/TeamMembers';
import { Loader2, PlusCircle } from 'lucide-react';
import SubmissionOptions from '@/components/SubmissionOptions';
import SubmissionsList from '@/components/SubmissionsList';

const TeamDashboard: React.FC = () => {
  const { teams, teamsLoading } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0]);
    }
  }, [teams, selectedTeam]);
  
  if (teamsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create or Join a Team</CardTitle>
          <CardDescription>
            You're not part of any team yet. Create a new team or join an existing one to start submitting project materials.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <TeamCreation />
          <JoinTeamForm />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Project Team</h2>
          <p className="text-muted-foreground">
            Manage your team and project submissions
          </p>
        </div>
        {teams.length > 0 && (
          <div className="flex items-center space-x-2">
            <select
              className="border rounded px-3 py-2 bg-background"
              value={selectedTeam?.id || ''}
              onChange={(e) => {
                const teamId = e.target.value;
                const team = teams.find(t => t.id === teamId);
                if (team) setSelectedTeam(team);
              }}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {selectedTeam && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
            <TabsTrigger value="submissions">Project Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <TeamMembers teamId={selectedTeam.id} />
          </TabsContent>
          
          <TabsContent value="submissions" className="space-y-6">
            <SubmissionOptions teamId={selectedTeam.id} />
            <SubmissionsList teamId={selectedTeam.id} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TeamDashboard;
