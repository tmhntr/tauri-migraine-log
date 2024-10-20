import React from 'react';
import { EntryType } from '@/schema';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface BasicInfoProps {
  formData: Partial<EntryType>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

const OtherDetails: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
        <div>
            <Label>Weather</Label>
            <Input type="text" value={formData.weather || ''} onChange={(e) => handleInputChange('weather', e.target.value)} />
        </div>
        <div>
            <Label>Temperature High</Label>
            <Input type="text" value={formData.temperature_high || ''} onChange={(e) => handleInputChange('temperature_high', e.target.value)} />
        </div>
        <div>
            <Label>Temperature Low</Label>
            <Input type="text" value={formData.temperature_low || ''} onChange={(e) => handleInputChange('temperature_low', e.target.value)} />
        </div>
        <div>
            <Label>Hydration Oz</Label>
            <Input type="text" value={formData.hydration_oz || ''} onChange={(e) => handleInputChange('hydration_oz', e.target.value)} />
        </div>
        <div>
            <Label>Recent Duration of Sleep</Label>
            <Input type="text" value={formData.recent_duration_of_sleep || ''} onChange={(e) => handleInputChange('recent_duration_of_sleep', e.target.value)} />
        </div>
        <div>
            <Label>Total Hours of Migraine</Label>
            <Input type="text" value={formData.total_hours_of_migraine || ''} onChange={(e) => handleInputChange('total_hours_of_migraine', e.target.value)} />
        </div>
    </div>
  );
};

export default OtherDetails;