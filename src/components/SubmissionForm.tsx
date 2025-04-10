
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmissions } from '@/hooks/useSubmissions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Submission } from '@/types';
import { createSubmissionSchema } from '@/utils/submissionFormSchema';
import { useToast } from '@/hooks/use-toast';

import FileUploadField from '@/components/form/FileUploadField';
import UrlField from '@/components/form/UrlField';
import SubmissionProgress from '@/components/form/SubmissionProgress';
import SubmissionButton from '@/components/form/SubmissionButton';
import FormErrorBoundary from '@/components/form/FormErrorBoundary';

interface SubmissionFormProps {
  teamId: string;
  type: Submission['type'];
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptFiles?: string;
  allowUrl?: boolean;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({
  teamId,
  type,
  title,
  description,
  icon,
  acceptFiles = '.pdf,.doc,.docx',
  allowUrl = false,
}) => {
  const { submitProject, isSubmitting, uploadProgress } = useSubmissions();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const requireFile = type === 'abstract' || type === 'presentation' || type === 'report';
  
  const schema = createSubmissionSchema(type, allowUrl, requireFile);
  
  // Define the form type using zod inference
  type FormValues = z.infer<typeof schema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      ...(allowUrl ? { url: '' } : {})
    },
  });

  const resetForm = () => {
    form.reset();
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    
    // Create a properly typed submission object
    const submissionData = {
      teamId,
      type,
      title: values.title,
      description: values.description || '',
      file: values.file as File | undefined,
      url: allowUrl && 'url' in values ? values.url : undefined,
    };

    submitProject(
      submissionData,
      {
        onSuccess: () => {
          setSubmitSuccess(true);
          toast({
            title: "Success!",
            description: `Your ${title.toLowerCase()} was submitted successfully.`,
          });
          // Close dialog after a short delay to show success state
          setTimeout(() => {
            setOpen(false);
            // Reset form state after dialog is closed
            setTimeout(resetForm, 300);
          }, 1500);
        },
        onError: (error) => {
          setSubmitError(error.message || 'An error occurred during submission.');
          toast({
            title: "Submission failed",
            description: error.message || 'There was a problem submitting your project.',
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen && isSubmitting) return; // Prevent closing while submitting
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center justify-center space-y-2">
          {icon}
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground text-center">{description}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit {title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <FormErrorBoundary>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${type} title`} {...field} />
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
              
              {requireFile && (
                <FileUploadField
                  form={form}
                  label="File Upload"
                  description={`Upload your ${type} file (max 20MB)`}
                  acceptFiles={acceptFiles}
                  required={requireFile && !allowUrl}
                />
              )}
              
              {allowUrl && (
                <UrlField
                  form={form}
                  type={type}
                  required={!requireFile && allowUrl}
                />
              )}
              
              <SubmissionProgress
                isSubmitting={isSubmitting}
                uploadProgress={uploadProgress}
                error={submitError}
              />
              
              <DialogFooter>
                <SubmissionButton 
                  isSubmitting={isSubmitting} 
                  isSuccess={submitSuccess}
                  isError={!!submitError}
                  errorMessage={submitError || ''}
                />
              </DialogFooter>
            </form>
          </Form>
        </FormErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionForm;
