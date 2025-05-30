
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Team, TeamMember } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useTeams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Get user's teams
  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['teams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: teamMemberships, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);
        
      if (membershipError) {
        console.error('Error fetching team memberships:', membershipError);
        return [];
      }
      
      if (!teamMemberships?.length) return [];
      
      const teamIds = teamMemberships.map(tm => tm.team_id);
      
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds);
        
      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        return [];
      }
      
      return teams as Team[];
    },
    enabled: !!user,
  });

  // Get team members
  const getTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          user:user_id (
            id,
            email,
            name,
            role
          )
        `)
        .eq('team_id', teamId);
        
      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }
      
      return data as (TeamMember & { user: any })[];
    } catch (error) {
      console.error('Error in getTeamMembers:', error);
      throw error;
    }
  };

  // Create a new team
  const createTeamMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        // Create the team
        const { data: team, error: teamError } = await supabase
          .from('teams')
          .insert([
            { name, creator_id: user.id }
          ])
          .select()
          .single();
          
        if (teamError) {
          console.error('Team creation error:', teamError);
          throw teamError;
        }
        
        if (!team) throw new Error('Failed to create team');
        
        // Add the creator as a team member with leader role
        const { error: memberError } = await supabase
          .from('team_members')
          .insert([
            { team_id: team.id, user_id: user.id, role: 'leader' }
          ]);
          
        if (memberError) {
          console.error('Member creation error:', memberError);
          throw memberError;
        }
        
        return team as Team;
      } catch (error) {
        console.error('Error in createTeamMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', user?.id] });
      toast({
        title: 'Team created',
        description: 'Your team has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Error creating team:', error);
      toast({
        title: 'Error',
        description: 'Failed to create team. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Add a member to a team
  const addTeamMemberMutation = useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string, email: string }) => {
      try {
        // Instead of querying auth.users directly (which is not allowed),
        // we'll use the Supabase Auth API to create an invite or send a notification
        // For now, we'll implement a simplified version assuming we can get the user ID
        
        // This is a placeholder implementation - in a real app, you would:
        // 1. Create an invitations table in your public schema
        // 2. Store the invitation with the team_id and email
        // 3. Send an email to the user with a link to accept the invitation
        // 4. When the user accepts, you would add them to the team_members table
        
        // For demo purposes, let's assume we have a user with this email
        const { data: userData, error: userError } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('user_id', user?.id)
          .single();

        if (userError) {
          throw new Error('User not found with that email');
        }
        
        if (!userData) {
          throw new Error('User data not found');
        }
        
        // Then add the user to the team
        const { data, error } = await supabase
          .from('team_members')
          .insert([
            { team_id: teamId, user_id: userData.user_id, role: 'member' }
          ])
          .select();
          
        if (error) throw error;
        
        return data[0] as TeamMember;
      } catch (error) {
        console.error('Error in addTeamMemberMutation:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', variables.teamId] });
      toast({
        title: 'Member added',
        description: 'Team member has been added successfully.',
      });
    },
    onError: (error) => {
      console.error('Error adding team member:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add team member.',
        variant: 'destructive',
      });
    },
  });

  // Remove a member from a team
  const removeTeamMemberMutation = useMutation({
    mutationFn: async ({ memberId, teamId }: { memberId: string, teamId: string }) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      return memberId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', variables.teamId] });
      toast({
        title: 'Member removed',
        description: 'Team member has been removed.',
      });
    },
    onError: (error) => {
      console.error('Error removing team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove team member.',
        variant: 'destructive',
      });
    },
  });

  return {
    teams,
    teamsLoading,
    loading,
    getTeamMembers,
    createTeam: createTeamMutation.mutate,
    isCreatingTeam: createTeamMutation.isPending,
    addTeamMember: addTeamMemberMutation.mutate,
    isAddingMember: addTeamMemberMutation.isPending,
    removeTeamMember: removeTeamMemberMutation.mutate,
    isRemovingMember: removeTeamMemberMutation.isPending,
  };
}
