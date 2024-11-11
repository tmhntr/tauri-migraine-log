import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useSymptoms } from "../../hooks/queries";

interface SymptomsProps {
  onChange: (symptomIds: number[]) => void;
  defaultValues?: {
    symptomIds: number[];
  };
}

export function Symptoms({ onChange, defaultValues }: SymptomsProps) {
  const { data: symptoms = [] } = useSymptoms();
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>(
    defaultValues?.symptomIds || []
  );

  const handleSymptomChange = (symptomId: number, checked: boolean) => {
    const newSelectedSymptoms = checked
      ? [...selectedSymptoms, symptomId]
      : selectedSymptoms.filter(id => id !== symptomId);
    
    setSelectedSymptoms(newSelectedSymptoms);
    onChange(newSelectedSymptoms);
  };

  return (
    <div className="space-y-4">
      <Label>Symptoms</Label>
      <div className="grid grid-cols-2 gap-4">
        {symptoms.map((symptom) => (
          <div key={symptom.id} className="flex items-center space-x-2">
            <Checkbox
              id={`symptom-${symptom.id}`}
              checked={selectedSymptoms.includes(symptom.id)}
              onCheckedChange={(checked) => 
                handleSymptomChange(symptom.id, checked as boolean)
              }
            />
            <Label htmlFor={`symptom-${symptom.id}`}>{symptom.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}