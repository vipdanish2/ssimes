
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  event_date: z.string().min(1, { message: "Event date is required." }),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface TimelineEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: any;
  onSubmit: (values: EventFormValues) => void;
  isCreating: boolean;
  isUpdating: boolean;
}

const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
  open,
  onOpenChange,
  editingEvent,
  onSubmit,
  isCreating,
  isUpdating
}) => {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: editingEvent?.title || '',
      description: editingEvent?.description || '',
      event_date: editingEvent?.event_date ? editingEvent.event_date.split('T')[0] : '',
    },
  });

  // Reset form when editingEvent changes
  React.useEffect(() => {
    if (editingEvent) {
      form.setValue('title', editingEvent.title);
      form.setValue('description', editingEvent.description || '');
      form.setValue('event_date', editingEvent.event_date.split('T')[0]);
    } else {
      form.reset();
    }
  }, [editingEvent, form]);

  const handleSubmit = (values: EventFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Timeline Event' : 'Create Timeline Event'}
          </DialogTitle>
          <DialogDescription>
            {editingEvent 
              ? 'Update the timeline event details.'
              : 'Create a new timeline event that will be visible to all students.'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project submission deadline" {...field} />
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
                      placeholder="Additional details about this event..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingEvent ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingEvent ? 'Update Event' : 'Create Event'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineEventForm;
