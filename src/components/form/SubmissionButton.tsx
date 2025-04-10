
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SubmissionButtonProps {
  isSubmitting: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const SubmissionButton: React.FC<SubmissionButtonProps> = ({ 
  isSubmitting, 
  isSuccess = false,
  isError = false,
  errorMessage = 'Error submitting'
}) => {
  return (
    <Button 
      type="submit" 
      disabled={isSubmitting || isSuccess}
      variant={isError ? "destructive" : isSuccess ? "outline" : "default"}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Submitted
        </>
      ) : isError ? (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Try Again
        </>
      ) : (
        'Submit'
      )}
    </Button>
  );
};

export default SubmissionButton;
