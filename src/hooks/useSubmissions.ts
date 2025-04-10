
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionFile } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';
import { FileOptions } from '@supabase/storage-js';

export function useSubmissions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get team submissions
  const getTeamSubmissions = (teamId: string) => {
    return useQuery({
      queryKey: ['submissions', teamId],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('team_id', teamId)
            .order('submitted_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching submissions:', error);
            return [];
          }
          
          return data as Submission[];
        } catch (error) {
          console.error('Error in getTeamSubmissions:', error);
          return [];
        }
      },
      enabled: !!teamId,
    });
  };

  // Upload file to storage
  const uploadFile = async (file: File, teamId: string, submissionType: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${teamId}/${submissionType}/${fileName}`;
    
    // Create custom options with progress tracking
    const options: FileOptions = {
      cacheControl: '3600',
      upsert: false
    };
    
    try {
      // Use upload with progress tracking
      const { data, error } = await supabase.storage
        .from('project_files')
        .upload(filePath, file, options);
        
      // Track progress manually if needed
      setUploadProgress(100); // Set to 100% when complete
      
      if (error) throw error;
      
      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadProgress(0);
      throw error;
    }
  };

  // Create or update submission
  const submitProjectMutation = useMutation({
    mutationFn: async ({ 
      teamId, 
      type, 
      title, 
      description, 
      file, 
      url 
    }: { 
      teamId: string;
      type: Submission['type'];
      title: string;
      description?: string;
      file?: File;
      url?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        let filePath = undefined;
        
        // If file is provided, upload it first
        if (file) {
          filePath = await uploadFile(file, teamId, type);
        }
        
        // Check if submission already exists
        const { data: existingSubmission, error: checkError } = await supabase
          .from('submissions')
          .select('*')
          .eq('team_id', teamId)
          .eq('type', type)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (existingSubmission) {
          // Update existing submission
          const { data, error } = await supabase
            .from('submissions')
            .update({ 
              title, 
              description, 
              file_path: filePath || existingSubmission.file_path,
              url: url || existingSubmission.url,
              submitted_by: user.id,
              version: (existingSubmission.version || 1) + 1
            })
            .eq('id', existingSubmission.id)
            .select()
            .single();
            
          if (error) throw error;
          return data as Submission;
        } else {
          // Create new submission
          const { data, error } = await supabase
            .from('submissions')
            .insert([{
              team_id: teamId,
              type,
              title,
              description,
              file_path: filePath,
              url,
              submitted_by: user.id,
              version: 1
            }])
            .select()
            .single();
            
          if (error) throw error;
          return data as Submission;
        }
      } catch (error) {
        console.error('Error in submitProjectMutation:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.teamId] });
      setUploadProgress(0);
      toast({
        title: 'Submission successful',
        description: `Your ${variables.type} has been submitted successfully.`,
      });
    },
    onError: (error) => {
      console.error('Error submitting project:', error);
      setUploadProgress(0);
      toast({
        title: 'Error',
        description: 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Get public URL for file
  const getFileUrl = (filePath: string) => {
    if (!filePath) return '';
    
    const { data } = supabase.storage
      .from('project_files')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  return {
    getTeamSubmissions,
    submitProject: submitProjectMutation.mutate,
    isSubmitting: submitProjectMutation.isPending,
    uploadProgress,
    getFileUrl,
  };
}
