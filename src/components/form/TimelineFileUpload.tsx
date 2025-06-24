
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Upload, FileText, Presentation, Video, Github, Play, Loader2 } from 'lucide-react';
import SecureFileUpload from './SecureFileUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const submissionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  file: z.instanceof(File).optional(),
  url: z.string().url('Invalid URL').optional(),
}).refine((data) => data.file || data.url, {
  message: "Either file or URL is required",
  path: ["file"],
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface TimelineSubmission {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptFiles: string;
  allowUrl: boolean;
  deadline?: string;
}

const submissionTypes: TimelineSubmission[] = [
  {
    id: 'abstract',
    title: 'Project Abstract',
    description: 'Submit your project abstract document',
    icon: <FileText className="h-6 w-6" />,
    acceptFiles: '.pdf,.doc,.docx',
    allowUrl: false,
    deadline: '2024-12-31',
  },
  {
    id: 'presentation',
    title: 'Project Presentation',
    description: 'Upload your presentation slides',
    icon: <Presentation className="h-6 w-6" />,
    acceptFiles: '.ppt,.pptx,.pdf',
    allowUrl: true,
    deadline: '2024-12-31',
  },
  {
    id: 'video',
    title: 'Demo Video',
    description: 'Share your project demo video',
    icon: <Video className="h-6 w-6" />,
    acceptFiles: '.mp4,.avi,.mov,.mkv',
    allowUrl: true,
    deadline: '2024-12-31',
  },
  {
    id: 'github',
    title: 'Source Code',
    description: 'Share your GitHub repository or source code',
    icon: <Github className="h-6 w-6" />,
    acceptFiles: '.zip,.tar,.gz',
    allowUrl: true,
    deadline: '2024-12-31',
  },
  {
    id: 'demo',
    title: 'Live Demo',
    description: 'Share link to your live demo',
    icon: <Play className="h-6 w-6" />,
    acceptFiles: '',
    allowUrl: true,
    deadline: '2024-12-31',
  },
  {
    id: 'report',
    title: 'Final Report',
    description: 'Submit your final project report',
    icon: <FileText className="h-6 w-6" />,
    acceptFiles: '.pdf,.doc,.docx',
    allowUrl: false,
    deadline: '2024-12-31',
  },
];

const TimelineFileUpload: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<TimelineSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: SubmissionFormData) => {
    if (!user || !selectedType) return;

    setIsSubmitting(true);
    try {
      let fileUrl = null;

      // Upload file if provided
      if (values.file) {
        const fileName = `${user.id}/${selectedType.id}/${Date.now()}_${values.file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project_files')
          .upload(fileName, values.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        fileUrl = uploadData.path;
      }

      // Create submission record
      const submissionData = {
        title: values.title.trim(),
        description: values.description?.trim() || '',
        type: selectedType.id,
        team_id: '00000000-0000-0000-0000-000000000000', // Placeholder since we're using simple teams
        submitted_by: user.id,
        file_path: fileUrl,
        url: values.url || null,
      };

      const { error: insertError } = await supabase
        .from('submissions')
        .insert([submissionData]);

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: `Your ${selectedType.title.toLowerCase()} has been submitted successfully.`,
      });

      // Reset form
      form.reset();
      setSelectedType(null);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: error.message || 'There was a problem submitting your project.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDeadlinePassed = (deadline?: string) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline Submissions
          </CardTitle>
          <CardDescription>
            Submit your project deliverables according to the timeline. All files are securely validated before upload.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedType ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissionTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  className={`h-auto p-6 flex flex-col items-center justify-center space-y-3 ${
                    isDeadlinePassed(type.deadline) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
                  }`}
                  onClick={() => !isDeadlinePassed(type.deadline) && setSelectedType(type)}
                  disabled={isDeadlinePassed(type.deadline)}
                >
                  {type.icon}
                  <div className="text-center">
                    <div className="font-medium">{type.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                    {type.deadline && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Deadline: {new Date(type.deadline).toLocaleDateString()}
                      </div>
                    )}
                    {isDeadlinePassed(type.deadline) && (
                      <div className="text-xs text-red-500 mt-1">Deadline Passed</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedType.icon}
                  <div>
                    <h3 className="font-medium">{selectedType.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedType.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedType(null)}>
                  Back
                </Button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter ${selectedType.title.toLowerCase()} title`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add a brief description of your submission" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedType.acceptFiles && (
                    <SecureFileUpload
                      form={form}
                      label="File Upload"
                      description={`Upload your ${selectedType.title.toLowerCase()} file (max 20MB)`}
                      acceptFiles={selectedType.acceptFiles}
                      required={!selectedType.allowUrl}
                    />
                  )}

                  {selectedType.allowUrl && (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter URL (GitHub, YouTube, Drive, etc.)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit {selectedType.title}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineFileUpload;
