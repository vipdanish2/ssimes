
import React, { useState, useEffect } from 'react';
import { useTeams } from '@/hooks/useTeams';
import { TeamMember } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Plus, UserPlus, UserX } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TeamMembersProps {
  teamId: string;
}

const addMemberSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const TeamMembers: React.FC<TeamMembersProps> = ({ teamId }) => {
  const { user } = useAuth();
  const { getTeamMembers, addTeamMember, removeTeamMember, isAddingMember, isRemovingMember } = useTeams();
  const [members, setMembers] = useState<(TeamMember & { user: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: '',
    },
  });

  const isTeamLeader = members.some(
    member => member.user_id === user?.id && member.role === 'leader'
  );
  
  const memberCount = members.length;
  const canAddMoreMembers = memberCount < 4;

  useEffect(() => {
    const loadMembers = async () => {
      if (!teamId) return;
      
      try {
        setLoading(true);
        const data = await getTeamMembers(teamId);
        setMembers(data);
      } catch (error) {
        console.error('Error loading team members:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMembers();
  }, [teamId, getTeamMembers]);

  const onSubmit = (values: z.infer<typeof addMemberSchema>) => {
    addTeamMember(
      { teamId, email: values.email },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          // Reload members after adding a new one
          getTeamMembers(teamId).then(setMembers);
        }
      }
    );
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      removeTeamMember(
        { memberId, teamId },
        {
          onSuccess: () => {
            // Reload members after removing one
            getTeamMembers(teamId).then(setMembers);
          }
        }
      );
    }
  };

  if (loading) {
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members ({memberCount}/4)</CardTitle>
          <CardDescription>Manage your project team members</CardDescription>
        </div>
        {isTeamLeader && canAddMoreMembers && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-1" /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Enter the email address of the student you want to add to your team.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="student@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isAddingMember}>
                      {isAddingMember ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Member'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No team members found. Add members to start collaborating.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user?.name || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.user?.email} · {member.role === 'leader' ? 'Team Leader' : 'Member'}
                    </p>
                  </div>
                </div>
                {isTeamLeader && member.user_id !== user?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isRemovingMember}
                  >
                    {isRemovingMember ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserX className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
