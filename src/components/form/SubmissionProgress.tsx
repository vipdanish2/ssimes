
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface SubmissionProgressProps {
  isSubmitting: boolean;
  uploadProgress: number;
}

const SubmissionProgress: React.FC<SubmissionProgressProps> = ({
  isSubmitting,
  uploadProgress
}) => {
  if (!isSubmitting || uploadProgress <= 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Progress value={uploadProgress} />
      <p className="text-sm text-center text-muted-foreground">
        Uploading: {Math.round(uploadProgress)}%
      </p>
    </div>
  );
};

export default SubmissionProgress;
