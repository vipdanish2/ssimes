
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmissionButtonProps {
  isSubmitting: boolean;
}

const SubmissionButton: React.FC<SubmissionButtonProps> = ({ isSubmitting }) => {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </Button>
  );
};

export default SubmissionButton;
