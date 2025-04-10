
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  teamId: z.string().min(1, {
    message: "Team ID is required.",
  }),
});

const JoinTeamForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to join a team.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsJoining(true);
      
      // Check if team exists
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', values.teamId)
        .single();
        
      if (teamError || !team) {
        toast({
          title: 'Error',
          description: 'Team not found. Please check the team ID and try again.',
          variant: 'destructive',
        });
        setIsJoining(false);
        return;
      }
      
      // Check if user is already a member of this team
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', values.teamId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (existingMember) {
        toast({
          title: 'Already a member',
          description: 'You are already a member of this team.',
          variant: 'default',
        });
        setIsJoining(false);
        setOpen(false);
        form.reset();
        return;
      }
      
      // Check team member count
      const { data: memberCount, error: countError } = await supabase
        .from('team_members')
        .select('*', { count: 'exact' })
        .eq('team_id', values.teamId);
        
      if (countError) {
        throw countError;
      }
      
      if (memberCount && memberCount.length >= 4) {
        toast({
          title: 'Team is full',
          description: 'This team already has the maximum of 4 members.',
          variant: 'destructive',
        });
        setIsJoining(false);
        return;
      }
      
      // Join the team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert([
          { team_id: values.teamId, user_id: user.id, role: 'member' }
        ]);
        
      if (joinError) {
        throw joinError;
      }
      
      // Success
      queryClient.invalidateQueries({ queryKey: ['teams', user.id] });
      toast({
        title: 'Team joined',
        description: `You have successfully joined ${team.name}.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: 'Error',
        description: 'Failed to join team. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <LogIn className="mr-2 h-4 w-4" /> Join Existing Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Team</DialogTitle>
          <DialogDescription>
            Enter the team ID to join an existing team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isJoining}>
                {isJoining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Team'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinTeamForm;
