
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Team, TeamMember } from '@/types';

export function useTeams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's teams (simplified for performance)
  const { data: teams, isLoading: teamsLoading, error } = useQuery({
    queryKey: ['teams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data: teamMembers, error: membersError } = await supabase
          .from('team_members')
          .select(`
            team_id,
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
          .eq('role', 'leader');

        if (membersError) throw membersError;

        const userTeams = teamMembers?.map(member => member.teams).filter(Boolean) || [];
        return userTeams as Team[];
      } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Get team members for a specific team (optimized)
  const getTeamMembers = (teamId: string) => {
    return useQuery({
      queryKey: ['team-members', teamId],
      queryFn: async () => {
        const { data: members, error: membersError } = await supabase
          .from('team_members')
          .select('id, team_id, user_id, role, joined_at')
          .eq('team_id', teamId);

        if (membersError) throw membersError;

        if (!members || members.length === 0) {
          return [];
        }

        const userIds = members.map(member => member.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email, role')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const membersWithProfiles = members.map(member => {
          const profile = profiles?.find(p => p.id === member.user_id);
          return {
            ...member,
            user: profile || {
              id: member.user_id,
              name: 'Unknown User',
              email: 'unknown@example.com',
              role: 'student'
            }
          };
        });

        return membersWithProfiles as (TeamMember & { user: any })[];
      },
      enabled: !!teamId,
      staleTime: 2 * 60 * 1000, // 2 minutes cache
    });
  };

  return {
    teams: teams || [],
    teamsLoading,
    error,
    getTeamMembers,
  };
}
