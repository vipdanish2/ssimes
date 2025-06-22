
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useTimelineEvents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all active timeline events (visible to all users)
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['timeline-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as TimelineEvent[];
    },
  });

  // Get all timeline events (admin only)
  const { data: allEvents, isLoading: isLoadingAll } = useQuery({
    queryKey: ['timeline-events-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as TimelineEvent[];
    },
    enabled: user?.role === 'admin',
  });

  // Create timeline event
  const createEventMutation = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description?: string;
      event_date: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('timeline_events')
        .insert([{
          ...eventData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      queryClient.invalidateQueries({ queryKey: ['timeline-events-all'] });
      toast({
        title: 'Success',
        description: 'Timeline event created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create timeline event',
        variant: 'destructive',
      });
    },
  });

  // Update timeline event
  const updateEventMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<TimelineEvent>;
    }) => {
      const { data, error } = await supabase
        .from('timeline_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      queryClient.invalidateQueries({ queryKey: ['timeline-events-all'] });
      toast({
        title: 'Success',
        description: 'Timeline event updated successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update timeline event',
        variant: 'destructive',
      });
    },
  });

  // Delete timeline event
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      queryClient.invalidateQueries({ queryKey: ['timeline-events-all'] });
      toast({
        title: 'Success',
        description: 'Timeline event deleted successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete timeline event',
        variant: 'destructive',
      });
    },
  });

  return {
    events: events || [],
    allEvents: allEvents || [],
    isLoading,
    isLoadingAll,
    error,
    createEvent: createEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    updateEvent: updateEventMutation.mutate,
    isUpdating: updateEventMutation.isPending,
    deleteEvent: deleteEventMutation.mutate,
    isDeleting: deleteEventMutation.isPending,
  };
}
