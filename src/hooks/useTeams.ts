
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Team, TeamMember } from '@/types';

export function useTeams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's teams
  const { data: teams, isLoading: teamsLoading, error } = useQuery({
    queryKey: ['teams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Get teams where user is a member
        const { data: teamMembers, error: membersError } = await supabase
          .from('team_members')
          .select(`
            team_id,
            teams:team_id (
              id,
              name,
              created_at,
              updated_at,
              creator_id,
              mentor_id
            )
          `)
          .eq('user_id', user.id);

        if (membersError) throw membersError;

        // Extract teams from the join result
        const userTeams = teamMembers?.map(member => member.teams).filter(Boolean) || [];
        return userTeams as Team[];
      } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Create a new team
  const createTeamMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{
          name,
          creator_id: user.id,
        }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team leader
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: team.id,
          user_id: user.id,
          role: 'leader',
        }]);

      if (memberError) throw memberError;

      return team as Team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', user?.id] });
      toast({
        title: 'Success',
        description: 'Team created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create team',
        variant: 'destructive',
      });
    },
  });

  // Join a team by ID
  const joinTeamMutation = useMutation({
    mutationFn: async ({ teamId }: { teamId: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Check if team exists
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('id', teamId)
        .single();

      if (teamError) throw new Error('Team not found');

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('You are already a member of this team');
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          user_id: user.id,
          role: 'member',
        }]);

      if (memberError) throw memberError;

      return team;
    },
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ['teams', user?.id] });
      toast({
        title: 'Success',
        description: `Successfully joined ${team.name}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to join team',
        variant: 'destructive',
      });
    },
  });

  // Add team member by email
  const addTeamMemberMutation = useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string; email: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        throw new Error('User not found with this email address');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', profile.id)
        .single();

      if (existingMember) {
        throw new Error('User is already a member of this team');
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          user_id: profile.id,
          role: 'member',
        }]);

      if (memberError) throw memberError;

      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: 'Success',
        description: 'Team member added successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add team member',
        variant: 'destructive',
      });
    },
  });

  // Remove team member
  const removeTeamMemberMutation = useMutation({
    mutationFn: async ({ memberId, teamId }: { memberId: string; teamId: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: 'Success',
        description: 'Team member removed successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove team member',
        variant: 'destructive',
      });
    },
  });

  // Get team members for a specific team
  const getTeamMembers = (teamId: string) => {
    return useQuery({
      queryKey: ['team-members', teamId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('team_members')
          .select(`
            id,
            team_id,
            user_id,
            role,
            joined_at,
            profiles!team_members_user_id_fkey (
              id,
              name,
              email,
              role
            )
          `)
          .eq('team_id', teamId);

        if (error) throw error;

        return data.map(member => ({
          ...member,
          user: member.profiles,
        })) as (TeamMember & { user: any })[];
      },
      enabled: !!teamId,
    });
  };

  return {
    teams: teams || [],
    teamsLoading,
    error,
    createTeam: createTeamMutation.mutate,
    isCreatingTeam: createTeamMutation.isPending,
    joinTeam: joinTeamMutation.mutate,
    isJoiningTeam: joinTeamMutation.isPending,
    addTeamMember: addTeamMemberMutation.mutate,
    isAddingMember: addTeamMemberMutation.isPending,
    removeTeamMember: removeTeamMemberMutation.mutate,
    isRemovingMember: removeTeamMemberMutation.isPending,
    getTeamMembers,
  };
}
