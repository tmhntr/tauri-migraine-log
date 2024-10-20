import React from 'react';
import { EntryType } from '@/schema';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// { name: 'Warnings', fields: ['warning_vision', 'warning_numbness', 'warning_aching_neck', 'warning_other'] },


interface BasicInfoProps {
  formData: Partial<EntryType>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
    <div>
        <Label>Warnings</Label>
        <Input type="checkbox" checked={formData.warning_vision || false} onChange={(e) => handleInputChange('warning_vision', e.target.checked)} />
    </div>
    <div>
        <Label>Numbness</Label>
        <Input type="checkbox" checked={formData.warning_numbness || false} onChange={(e) => handleInputChange('warning_numbness', e.target.checked)} />
    </div>
    <div>
        <Label>Aching Neck</Label>
        <Input type="checkbox" checked={formData.warning_aching_neck || false} onChange={(e) => handleInputChange('warning_aching_neck', e.target.checked)} />
    </div>
    <div>
        <Label>Other</Label>
        <Input type="text" value={formData.warning_other || ''} onChange={(e) => handleInputChange('warning_other', e.target.value)} />
    </div>
    </div>
  );
};

export default BasicInfo;