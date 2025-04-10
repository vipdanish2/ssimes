
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TimelineEvent } from '@/types';

export const useTimeline = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all timeline events
  const fetchTimelineEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        throw error;
      }

      setTimelineEvents(data as TimelineEvent[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timeline events');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch timeline events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new timeline event
  const createTimelineEvent = async (eventData: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .insert({
          ...eventData,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Timeline event created successfully',
      });

      // Refresh timeline events
      fetchTimelineEvents();
      return data[0] as TimelineEvent;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create timeline event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update an existing timeline event
  const updateTimelineEvent = async (id: string, eventData: Partial<TimelineEvent>) => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Timeline event updated successfully',
      });

      // Refresh timeline events
      fetchTimelineEvents();
      return data[0] as TimelineEvent;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update timeline event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete a timeline event
  const deleteTimelineEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Timeline event deleted successfully',
      });

      // Refresh timeline events
      fetchTimelineEvents();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete timeline event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Load timeline events on component mount
  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  return {
    timelineEvents,
    isLoading,
    error,
    fetchTimelineEvents,
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
  };
};
