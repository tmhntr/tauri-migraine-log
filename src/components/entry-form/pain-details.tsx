import React from 'react';
import { EntryType } from '@/schema';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from '../ui/slider';

// { name: 'Pain Details', fields: ['site_of_pain_front', 'site_of_pain_back', 'site_of_pain_left', 'site_of_pain_right', 'site_of_pain_top', 'headache_severity'] },

const severityToNumber = (severity: EntryType['headache_severity']) => {
  switch (severity) {
    case 'Mild':
      return 1;
    case 'Moderate':
      return 2;
    case 'Severe':
      return 3;
    case 'Extreme':
      return 4;
    default:
        throw new Error('Invalid severity');
  }
}

const numberToSeverity = (number: number) => {
  switch (number) {
    case 1:
      return 'Mild';
    case 2:
      return 'Moderate';
    case 3:
        return 'Severe';
    case 4:
        return 'Extreme';
    default:
        throw new Error('Invalid severity number');
  }
}


interface BasicInfoProps {
  formData: Partial<EntryType>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

const PainDetails: React.FC<BasicInfoProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Site of Pain Front</Label>
        <Input type="checkbox" checked={formData.site_of_pain_front || false} onChange={(e) => handleInputChange('site_of_pain_front', e.target.checked)} />
      </div>
      <div>
        <Label>Site of Pain Back</Label>
        <Input type="checkbox" checked={formData.site_of_pain_back || false} onChange={(e) => handleInputChange('site_of_pain_back', e.target.checked)} />
      </div>
      <div>
        <Label>Site of Pain Left</Label>
        <Input type="checkbox" checked={formData.site_of_pain_left || false} onChange={(e) => handleInputChange('site_of_pain_left', e.target.checked)} />
      </div>
      <div>
        <Label>Site of Pain Right</Label>
        <Input type="checkbox" checked={formData.site_of_pain_right || false} onChange={(e) => handleInputChange('site_of_pain_right', e.target.checked)} />
      </div>
      <div>
        <Label>Site of Pain Top</Label>
        <Input type="checkbox" checked={formData.site_of_pain_top || false} onChange={(e) => handleInputChange('site_of_pain_top', e.target.checked)} />
      </div>
      <div>
        <Label>Headache Severity</Label>
        <Slider
      max={4}
      min={1}
      step={1}
      className={"w-[60%]"}
      value={[severityToNumber(formData.headache_severity || 'Mild')]} 
      onValueChange={(value) => handleInputChange('headache_severity', numberToSeverity(value[0]))}
    />
        {/* <Input type="number" value={formData.headache_severity || ''} onChange={(e) => handleInputChange('headache_severity', e.target.value)} /> */}
      </div>
    </div>
  );
};

export default PainDetails;