import React from 'react';
import { Entry } from '../../types';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// { name: 'Symptoms', fields: ['symptoms_throbbing', 'symptoms_burning', 'symptoms_dull_ache', 'symptoms_knife_like', 'symptoms_nausea', 'symptoms_light_sensitivity', 'symptoms_pressure', 'symptoms_aura', 'symptoms_tight_band', 'symptoms_neck_ache'] },


interface BasicInfoProps {
  formData: Partial<Entry>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Throbbing</Label>
        <Input type="checkbox" checked={formData.symptoms_throbbing || false} onChange={(e) => handleInputChange('symptoms_throbbing', e.target.checked)} />
      </div>
      <div>
        <Label>Burning</Label>
        <Input type="checkbox" checked={formData.symptoms_burning || false} onChange={(e) => handleInputChange('symptoms_burning', e.target.checked)} />
      </div>
      <div>
        <Label>Dull Ache</Label>
        <Input type="checkbox" checked={formData.symptoms_dull_ache || false} onChange={(e) => handleInputChange('symptoms_dull_ache', e.target.checked)} />
      </div>
      <div>
        <Label>Knife-like</Label>
        <Input type="checkbox" checked={formData.symptoms_knife_like || false} onChange={(e) => handleInputChange('symptoms_knife_like', e.target.checked)} />
      </div>
      <div>
        <Label>Nausea</Label>
        <Input type="checkbox" checked={formData.symptoms_nausea || false} onChange={(e) => handleInputChange('symptoms_nausea', e.target.checked)} />
      </div>
      <div>
        <Label>Light Sensitivity</Label>
        <Input type="checkbox" checked={formData.symptoms_light_sensitivity || false} onChange={(e) => handleInputChange('symptoms_light_sensitivity', e.target.checked)} />
      </div>
      <div>
        <Label>Pressure</Label>
        <Input type="checkbox" checked={formData.symptoms_pressure || false} onChange={(e) => handleInputChange('symptoms_pressure', e.target.checked)} />
      </div>
      <div>
        <Label>Aura</Label>
        <Input type="checkbox" checked={formData.symptoms_aura || false} onChange={(e) => handleInputChange('symptoms_aura', e.target.checked)} />
      </div>
      <div>
        <Label>Tight Band</Label>
        <Input type="checkbox" checked={formData.symptoms_tight_band || false} onChange={(e) => handleInputChange('symptoms_tight_band', e.target.checked)} />
      </div>
      <div>
        <Label>Neck Ache</Label>
        <Input type="checkbox" checked={formData.symptoms_neck_ache || false} onChange={(e) => handleInputChange('symptoms_neck_ache', e.target.checked)} />
      </div>
    </div>
  );
};

export default BasicInfo;