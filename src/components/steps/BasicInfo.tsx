import React from 'react';
import { Entry } from '../../types';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

interface BasicInfoProps {
  formData: Partial<Entry>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="episode_date">Episode Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!formData.episode_date && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.episode_date ? format(new Date(formData.episode_date), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.episode_date ? new Date(formData.episode_date) : undefined}
              onSelect={(date) => handleInputChange('episode_date', date ? format(date, 'yyyy-MM-dd') : '')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimated_onset_time">Estimated Onset Time</Label>
        <Input
          type="time"
          id="estimated_onset_time"
          value={formData.estimated_onset_time || ''}
          onChange={(e) => handleInputChange('estimated_onset_time', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimated_onset_period">Estimated Onset Period</Label>
        <Input
          type="text"
          id="estimated_onset_period"
          value={formData.estimated_onset_period || ''}
          onChange={(e) => handleInputChange('estimated_onset_period', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimated_ended_time">Estimated Ended Time</Label>
        <Input
          type="time"
          id="estimated_ended_time"
          value={formData.estimated_ended_time || ''}
          onChange={(e) => handleInputChange('estimated_ended_time', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimated_ended_period">Estimated Ended Period</Label>
        <Input
          type="text"
          id="estimated_ended_period"
          value={formData.estimated_ended_period || ''}
          onChange={(e) => handleInputChange('estimated_ended_period', e.target.value)}
        />
      </div>
    </div>
  );
};

export default BasicInfo;