import React from 'react';
import { Entry } from '../../types';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

// { name: 'Warnings', fields: ['warning_vision', 'warning_numbness', 'warning_aching_neck', 'warning_other'] },


interface BasicInfoProps {
  formData: Partial<Entry>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
    <div>
        <Label>Warnings</Label>
        <Input type="checkbox" value={formData.warning_vision || false} onChange={(e) => handleInputChange('warning_vision', e.target.checked)} />
    </div>
    <div>
        <Label>Numbness</Label>
        <Input type="checkbox" value={formData.warning_numbness || false} onChange={(e) => handleInputChange('warning_numbness', e.target.checked)} />
    </div>
    <div>
        <Label>Aching Neck</Label>
        <Input type="checkbox" value={formData.warning_aching_neck || false} onChange={(e) => handleInputChange('warning_aching_neck', e.target.checked)} />
    </div>
    <div>
        <Label>Other</Label>
        <Input type="text" value={formData.warning_other || ''} onChange={(e) => handleInputChange('warning_other', e.target.value)} />
    </div>
    </div>
  );
};

export default BasicInfo;