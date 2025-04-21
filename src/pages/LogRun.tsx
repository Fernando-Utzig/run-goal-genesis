
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  distance: z.number().min(0.01, "Distance must be greater than 0"),
  duration: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Duration must be in HH:MM:SS format"),
  date: z.date(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LogRun = () => {
  const [calculatedPace, setCalculatedPace] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distance: undefined,
      duration: "00:00:00",
      date: new Date(),
      notes: "",
    },
  });

  const calculatePace = (distance: number, duration: string) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const paceSeconds = totalSeconds / distance;
    const paceMinutes = Math.floor(paceSeconds / 60);
    const remainingSeconds = Math.floor(paceSeconds % 60);
    return `${paceMinutes}:${remainingSeconds.toString().padStart(2, "0")} min/km`;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('runs')
        .insert([{
          userId: 'user-1', // This should come from auth context in a real app
          distance: data.distance,
          duration: durationToSeconds(data.duration),
          date: data.date.toISOString(),
          notes: data.notes,
          status: 'Completed'
        }]);

      if (error) throw error;

      toast('Success!', {
        description: 'Your run has been logged.',
      });
    } catch (error) {
      console.error('Error saving run:', error);
      toast('Error', {
        description: 'Failed to save run. Please try again.',
      });
    }
  };

  const durationToSeconds = (duration: string): number => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Update pace whenever distance or duration changes
  const handleInputChange = () => {
    const distance = form.watch("distance");
    const duration = form.watch("duration");
    
    if (distance && duration.match(/^\d{2}:\d{2}:\d{2}$/)) {
      setCalculatedPace(calculatePace(distance, duration));
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Log a New Run</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="5.0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                          handleInputChange();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (HH:MM:SS)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00:25:30"
                        pattern="\d{2}:\d{2}:\d{2}"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleInputChange();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {calculatedPace && (
                <div className="text-sm text-gray-600">
                  Pace: {calculatedPace}
                </div>
              )}

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any notes about your run..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white"
              >
                Save Run
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LogRun;
