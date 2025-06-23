
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Resource } from '@/types';

export function useResources() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all active resources for students
  const { data: resources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get all resources for admin
  const { data: allResources = [], isLoading: allResourcesLoading } = useQuery({
    queryKey: ['all-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!user && user.role === 'admin',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create resource (admin only)
  const createResourceMutation = useMutation({
    mutationFn: async (resourceData: {
      title: string;
      description?: string;
      file_url?: string;
      resource_type: string;
    }) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('resources')
        .insert([{
          ...resourceData,
          created_by: user.id,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['all-resources'] });
      toast({
        title: 'Success',
        description: 'Resource created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create resource',
        variant: 'destructive',
      });
    },
  });

  // Update resource (admin only)
  const updateResourceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Resource> }) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('resources')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['all-resources'] });
      toast({
        title: 'Success',
        description: 'Resource updated successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update resource',
        variant: 'destructive',
      });
    },
  });

  // Delete resource (admin only)
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['all-resources'] });
      toast({
        title: 'Success',
        description: 'Resource deleted successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete resource',
        variant: 'destructive',
      });
    },
  });

  return {
    resources,
    allResources,
    resourcesLoading,
    allResourcesLoading,
    createResource: createResourceMutation.mutate,
    isCreatingResource: createResourceMutation.isPending,
    updateResource: updateResourceMutation.mutate,
    isUpdatingResource: updateResourceMutation.isPending,
    deleteResource: deleteResourceMutation.mutate,
    isDeletingResource: deleteResourceMutation.isPending,
  };
}
