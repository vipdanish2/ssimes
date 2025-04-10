
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, AlertTriangle } from 'lucide-react';

interface SubmissionProgressProps {
  isSubmitting: boolean;
  uploadProgress: number;
  error?: string | null;
}

const SubmissionProgress: React.FC<SubmissionProgressProps> = ({
  isSubmitting,
  uploadProgress,
  error = null
}) => {
  if (error) {
    return (
      <div className="space-y-2 p-3 border border-destructive rounded-md bg-destructive/10">
        <div className="flex items-center text-destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <p className="text-sm font-medium">Upload failed</p>
        </div>
        <p className="text-xs text-destructive">{error}</p>
      </div>
    );
  }

  if (!isSubmitting || uploadProgress <= 0) {
    return null;
  }

  return (
    <div className="space-y-2 p-3 border rounded-md bg-blue-50 dark:bg-blue-950/20">
      <div className="flex items-center text-primary">
        <UploadCloud className="h-4 w-4 mr-2 animate-pulse" />
        <p className="text-sm font-medium">Uploading file</p>
      </div>
      <Progress value={uploadProgress} className="h-2" />
      <p className="text-xs text-center text-muted-foreground">
        {uploadProgress < 100 
          ? `Uploading: ${Math.round(uploadProgress)}%` 
          : 'Processing submission...'}
      </p>
    </div>
  );
};

export default SubmissionProgress;
