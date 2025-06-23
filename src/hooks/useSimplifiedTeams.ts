
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Team, TeamMemberName } from '@/types';

export function useSimplifiedTeams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's team (only one team per leader)
  const { data: userTeam, isLoading: teamLoading } = useQuery({
    queryKey: ['user-team', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        const { data: teamMember, error } = await supabase
          .from('team_members')
          .select(`
            team_id,
            role,
            teams!inner (
              id,
              name,
              created_at,
              updated_at,
              creator_id,
              mentor_id
            )
          `)
          .eq('user_id', user.id)
          .eq('role', 'leader')
          .maybeSingle();

        if (error) throw error;
        return teamMember?.teams as Team | null;
      } catch (error) {
        console.error('Error fetching user team:', error);
        return null;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get team member names
  const { data: teamMemberNames = [], isLoading: membersLoading } = useQuery({
    queryKey: ['team-member-names', userTeam?.id],
    queryFn: async () => {
      if (!userTeam) return [];

      const { data, error } = await supabase
        .from('team_member_names')
        .select('*')
        .eq('team_id', userTeam.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TeamMemberName[];
    },
    enabled: !!userTeam,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Create team
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
      queryClient.invalidateQueries({ queryKey: ['user-team', user?.id] });
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

  // Add team member name
  const addMemberNameMutation = useMutation({
    mutationFn: async ({ memberName }: { memberName: string }) => {
      if (!userTeam) throw new Error('No team found');

      const { error } = await supabase
        .from('team_member_names')
        .insert([{
          team_id: userTeam.id,
          member_name: memberName,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-member-names', userTeam?.id] });
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

  // Remove team member name
  const removeMemberNameMutation = useMutation({
    mutationFn: async ({ memberId }: { memberId: string }) => {
      const { error } = await supabase
        .from('team_member_names')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-member-names', userTeam?.id] });
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

  return {
    userTeam,
    teamMemberNames,
    teamLoading,
    membersLoading,
    createTeam: createTeamMutation.mutate,
    isCreatingTeam: createTeamMutation.isPending,
    addMemberName: addMemberNameMutation.mutate,
    isAddingMember: addMemberNameMutation.isPending,
    removeMemberName: removeMemberNameMutation.mutate,
    isRemovingMember: removeMemberNameMutation.isPending,
  };
}
