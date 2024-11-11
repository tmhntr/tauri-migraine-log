import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useWarnings } from "../../hooks/queries";

interface WarningsProps {
  onChange: (values: { warningIds: number[], warningOther: string | null }) => void;
  defaultValues?: {
    warningIds: number[];
    warningOther: string | null;
  };
}

export function Warnings({ onChange, defaultValues }: WarningsProps) {
  const { data: warnings = [] } = useWarnings();
  const [selectedWarnings, setSelectedWarnings] = useState<number[]>(
    defaultValues?.warningIds || []
  );
  const [otherWarning, setOtherWarning] = useState<string | null>(
    defaultValues?.warningOther || null
  );

  const handleWarningChange = (warningId: number, checked: boolean) => {
    const newSelectedWarnings = checked
      ? [...selectedWarnings, warningId]
      : selectedWarnings.filter(id => id !== warningId);
    
    setSelectedWarnings(newSelectedWarnings);
    onChange({ warningIds: newSelectedWarnings, warningOther: otherWarning });
  };

  const handleOtherWarningChange = (value: string) => {
    setOtherWarning(value || null);
    onChange({ warningIds: selectedWarnings, warningOther: value || null });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Warning Signs</Label>
        <div className="grid grid-cols-2 gap-4">
          {warnings.map((warning) => (
            <div key={warning.id} className="flex items-center space-x-2">
              <Checkbox
                id={`warning-${warning.id}`}
                checked={selectedWarnings.includes(warning.id)}
                onCheckedChange={(checked) => 
                  handleWarningChange(warning.id, checked as boolean)
                }
              />
              <Label htmlFor={`warning-${warning.id}`}>{warning.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="warning-other">Other Warning Signs</Label>
        <Textarea
          id="warning-other"
          value={otherWarning || ''}
          onChange={(e) => handleOtherWarningChange(e.target.value)}
          placeholder="Describe any other warning signs..."
        />
      </div>
    </div>
  );
}