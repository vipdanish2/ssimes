
import React, { useState } from 'react';
import { useSimplifiedTeams } from '@/hooks/useSimplifiedTeams';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Users, Trash2, UserPlus } from 'lucide-react';
import SubmissionOptions from '@/components/SubmissionOptions';
import SubmissionsList from '@/components/SubmissionsList';
import TeamIdDisplay from '@/components/TeamIdDisplay';

const createTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50, 'Team name must not exceed 50 characters'),
});

const addMemberSchema = z.object({
  memberName: z.string().min(2, 'Member name must be at least 2 characters').max(100, 'Member name too long'),
});

const SimplifiedTeamDashboard: React.FC = () => {
  const {
    userTeam,
    teamMemberNames,
    teamLoading,
    membersLoading,
    createTeam,
    isCreatingTeam,
    addMemberName,
    isAddingMember,
    removeMemberName,
    isRemovingMember,
  } = useSimplifiedTeams();

  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const createTeamForm = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: '' },
  });

  const addMemberForm = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { memberName: '' },
  });

  const onCreateTeam = (values: z.infer<typeof createTeamSchema>) => {
    createTeam(values, {
      onSuccess: () => {
        setCreateTeamOpen(false);
        createTeamForm.reset();
      },
    });
  };

  const onAddMember = (values: z.infer<typeof addMemberSchema>) => {
    addMemberName(values, {
      onSuccess: () => {
        setAddMemberOpen(false);
        addMemberForm.reset();
      },
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      removeMemberName({ memberId });
    }
  };

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userTeam) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Your Team</CardTitle>
          <CardDescription>
            As a team leader, create your team and add your team members.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Your Team</DialogTitle>
                <DialogDescription>
                  Enter a name for your project team.
                </DialogDescription>
              </DialogHeader>
              <Form {...createTeamForm}>
                <form onSubmit={createTeamForm.handleSubmit(onCreateTeam)} className="space-y-4">
                  <FormField
                    control={createTeamForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter team name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isCreatingTeam}>
                      {isCreatingTeam ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Team'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Team: {userTeam.name}</h2>
          <p className="text-muted-foreground">
            Manage your team members and project submissions
          </p>
        </div>
      </div>

      <TeamIdDisplay teamId={userTeam.id} teamName={userTeam.name} />

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="submissions">Project Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members ({teamMemberNames.length + 1}/4)
                </CardTitle>
                <CardDescription>Manage your team member names</CardDescription>
              </div>
              {teamMemberNames.length < 3 && (
                <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-1" /> Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Enter the name of your team member.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...addMemberForm}>
                      <form onSubmit={addMemberForm.handleSubmit(onAddMember)} className="space-y-4">
                        <FormField
                          control={addMemberForm.control}
                          name="memberName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Member Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter member name" {...field} />
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
              <div className="space-y-3">
                {/* Team Leader */}
                <div className="flex items-center justify-between p-3 rounded-md border bg-blue-50">
                  <div>
                    <p className="font-medium">You (Team Leader)</p>
                    <p className="text-sm text-muted-foreground">Team Leader</p>
                  </div>
                </div>

                {/* Team Members */}
                {membersLoading ? (
                  <div className="flex justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  teamMemberNames.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <div>
                        <p className="font-medium">{member.member_name}</p>
                        <p className="text-sm text-muted-foreground">Team Member</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={isRemovingMember}
                      >
                        {isRemovingMember ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  ))
                )}

                {teamMemberNames.length === 0 && !membersLoading && (
                  <div className="text-center p-6 text-muted-foreground">
                    No team members added yet. Add members to start collaborating.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <SubmissionOptions teamId={userTeam.id} />
          <SubmissionsList teamId={userTeam.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimplifiedTeamDashboard;
