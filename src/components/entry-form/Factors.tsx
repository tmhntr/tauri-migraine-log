// { name: 'Factors', fields: ['factors_brought_on', 'factors_relieve'] },
import { EntryType } from '@/schema';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FactorsProps {
  formData: Partial<EntryType>;
  handleInputChange: (name: string, value: string | boolean) => void;
}

export function Factors({ formData, handleInputChange }: FactorsProps) {
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
