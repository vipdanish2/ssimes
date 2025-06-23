
import React from 'react';
import { useSimplifiedTeams } from '@/hooks/useSimplifiedTeams';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';

interface TeamMembersProps {
  teamId: string;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ teamId }) => {
  const { teamMemberNames, membersLoading } = useSimplifiedTeams();

  if (membersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Loading team members...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members ({teamMemberNames.length + 1})
        </CardTitle>
        <CardDescription>Your team member list</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 rounded-md border bg-blue-50">
            <p className="font-medium">Team Leader</p>
            <p className="text-sm text-muted-foreground">You</p>
          </div>
          {teamMemberNames.map((member) => (
            <div key={member.id} className="p-3 rounded-md border">
              <p className="font-medium">{member.member_name}</p>
              <p className="text-sm text-muted-foreground">Team Member</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
