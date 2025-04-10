
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamIdDisplayProps {
  teamId: string;
  teamName: string;
}

const TeamIdDisplay: React.FC<TeamIdDisplayProps> = ({ teamId, teamName }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(teamId);
    setCopied(true);
    toast({
      title: 'Copied',
      description: 'Team ID copied to clipboard',
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Team</CardTitle>
        <CardDescription>
          Share this ID with your classmates so they can join your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-3 rounded-md flex items-center justify-between mb-2">
          <code className="font-mono text-sm">{teamId}</code>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Team name: <span className="font-medium">{teamName}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamIdDisplay;
