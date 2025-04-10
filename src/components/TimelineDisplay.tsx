
import React from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { TimelineEvent } from '@/types';
import { Card } from '@/components/ui/card';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { format, isPast, isFuture, isToday } from 'date-fns';
import { Loader2 } from 'lucide-react';

const TimelineDisplay: React.FC = () => {
  const { timelineEvents, isLoading } = useTimeline();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Filter only active events
  const activeEvents = timelineEvents.filter(event => event.is_active);

  if (activeEvents.length === 0) {
    return (
      <Card className="dashboard-card p-6">
        <div className="flex justify-center items-center h-24">
          <p className="text-muted-foreground">No timeline events available.</p>
        </div>
      </Card>
    );
  }

  const getEventStatus = (event: TimelineEvent) => {
    const eventDate = new Date(event.event_date);
    
    if (isPast(eventDate) && !isToday(eventDate)) {
      return {
        status: 'completed',
        icon: <CheckCircle2 size={24} className="text-emerald-500" />,
        className: 'bg-emerald-500/10 text-emerald-500',
        label: 'Completed'
      };
    } else if (isToday(eventDate)) {
      return {
        status: 'today',
        icon: <Clock size={24} className="text-amber-500" />,
        className: 'bg-amber-500/10 text-amber-500',
        label: 'Today'
      };
    } else {
      return {
        status: 'upcoming',
        icon: <Calendar size={24} className="text-primary" />,
        className: 'bg-primary/10 text-primary',
        label: 'Upcoming'
      };
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-border"></div>
        
        {activeEvents.map((event, index) => {
          const { icon, className, label } = getEventStatus(event);
          const isLast = index === activeEvents.length - 1;
          
          return (
            <div key={event.id} className={`relative flex gap-4 ${isLast ? '' : 'pb-8'}`}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 z-10 bg-secondary">
                {icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {format(new Date(event.event_date), 'MMMM d, yyyy')}
                </p>
                {event.description && (
                  <div className="bg-secondary p-3 rounded-md text-sm mb-3">
                    <p>{event.description}</p>
                  </div>
                )}
                <div className={`mt-2 ${className} px-3 py-1 rounded-full text-xs inline-flex items-center`}>
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TimelineDisplay;
