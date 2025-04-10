
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Submission, SubmissionFile } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

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
      },
      enabled: !!teamId,
    });
  };

  // Upload file to storage
  const uploadFile = async (file: File, teamId: string, submissionType: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${teamId}/${submissionType}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('project_files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          setUploadProgress(progress.percent || 0);
        },
      });
      
    if (error) throw error;
    
    return data.path;
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
            version: existingSubmission.version + 1
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
            submitted_by: user.id
          }])
          .select()
          .single();
          
        if (error) throw error;
        return data as Submission;
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
