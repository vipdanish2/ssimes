
import React, { useState } from 'react';
import { useTimelineEvents } from '@/hooks/useTimelineEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  event_date: z.string().min(1, { message: "Event date is required." }),
});

type EventFormValues = z.infer<typeof eventSchema>;

const TimelineManagement = () => {
  const { 
    allEvents, 
    isLoadingAll, 
    createEvent, 
    isCreating, 
    updateEvent, 
    isUpdating, 
    deleteEvent, 
    isDeleting 
  } = useTimelineEvents();
  
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      event_date: '',
    },
  });

  const onSubmit = (values: EventFormValues) => {
    if (editingEvent) {
      // For updates, we ensure title and event_date are provided
      updateEvent({
        id: editingEvent.id,
        updates: {
          title: values.title,
          event_date: values.event_date,
          description: values.description,
        },
      });
    } else {
      createEvent(values);
    }
    setOpen(false);
    setEditingEvent(null);
    form.reset();
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    form.setValue('title', event.title);
    form.setValue('description', event.description || '');
    form.setValue('event_date', event.event_date.split('T')[0]); // Format for date input
    setOpen(true);
  };

  const handleToggleActive = (event: any) => {
    updateEvent({
      id: event.id,
      updates: { is_active: !event.is_active },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this timeline event?')) {
      deleteEvent(id);
    }
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    form.reset();
    setOpen(true);
  };

  if (isLoadingAll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline Management</CardTitle>
          <CardDescription>Loading timeline events...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Timeline Management</CardTitle>
          <CardDescription>Manage project timeline events and milestones</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allEvents.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No timeline events found. Create your first event to get started.
            </div>
          ) : (
            allEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-md border"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Date: {format(new Date(event.event_date), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={event.is_active}
                    onCheckedChange={() => handleToggleActive(event)}
                    disabled={isUpdating}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(event)}
                    disabled={isUpdating}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(event.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineManagement;
