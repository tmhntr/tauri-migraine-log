// { name: 'Factors', fields: ['factors_brought_on', 'factors_relieve'] },

import React from 'react';
import { EntryType } from '@/schema';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicInfoProps {
  formData: Partial<EntryType>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

const Factors: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
        <div>
            <Label>Factors Brought On</Label>
            <Input type="text" value={formData.factors_brought_on || ''} onChange={(e) => handleInputChange('factors_brought_on', e.target.value)} />
        </div>
        <div>
            <Label>Factors Relieve</Label>
            <Input type="text" value={formData.factors_relieve || ''} onChange={(e) => handleInputChange('factors_relieve', e.target.value)} />
        </div>
    </div>
  );
};

export default Factors;