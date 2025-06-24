
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Users, Save } from 'lucide-react';

const teamFormSchema = z.object({
  teamName: z.string()
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'),
  member1Name: z.string()
    .min(2, 'Member name must be at least 2 characters')
    .max(50, 'Member name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Member name can only contain letters and spaces'),
  member2Name: z.string()
    .max(50, 'Member name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Member name can only contain letters and spaces')
    .optional(),
  member3Name: z.string()
    .max(50, 'Member name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Member name can only contain letters and spaces')
    .optional(),
  member4Name: z.string()
    .max(50, 'Member name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Member name can only contain letters and spaces')
    .optional(),
});

type TeamFormData = z.infer<typeof teamFormSchema>;

const SimpleTeamForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingTeam, setExistingTeam] = useState<any>(null);

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: '',
      member1Name: '',
      member2Name: '',
      member3Name: '',
      member4Name: '',
    },
  });

  // Load existing team data
  React.useEffect(() => {
    const loadExistingTeam = async () => {
      if (!user) return;
      
      try {
        // Use any type to bypass TypeScript checking since types haven't been regenerated
        const { data, error } = await (supabase as any)
          .from('team_names')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setExistingTeam(data);
          form.reset({
            teamName: data.team_name || '',
            member1Name: data.member1_name || '',
            member2Name: data.member2_name || '',
            member3Name: data.member3_name || '',
            member4Name: data.member4_name || '',
          });
        }
      } catch (error) {
        console.log('No existing team found');
      }
    };

    loadExistingTeam();
  }, [user, form]);

  const onSubmit = async (values: TeamFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Sanitize input values
      const sanitizedData = {
        team_name: values.teamName.trim(),
        member1_name: values.member1Name.trim(),
        member2_name: values.member2Name?.trim() || null,
        member3_name: values.member3Name?.trim() || null,
        member4_name: values.member4Name?.trim() || null,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (existingTeam) {
        // Update existing team
        result = await (supabase as any)
          .from('team_names')
          .update(sanitizedData)
          .eq('id', existingTeam.id)
          .eq('user_id', user.id);
      } else {
        // Create new team
        result = await (supabase as any)
          .from('team_names')
          .insert([sanitizedData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success!",
        description: existingTeam 
          ? "Team information updated successfully." 
          : "Team information saved successfully.",
      });

      if (!existingTeam) {
        // Reload to get the new team data
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error saving team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save team information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Information
        </CardTitle>
        <CardDescription>
          Enter your team name and member details. You can update this information anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member1Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Leader / Member 1 *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team leader name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member2Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member 2 name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member3Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member 3 name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member4Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member 4</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member 4 name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {existingTeam ? 'Update Team Information' : 'Save Team Information'}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SimpleTeamForm;
