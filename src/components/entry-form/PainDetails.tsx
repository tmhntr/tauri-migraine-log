import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { usePainSites } from "../../hooks/queries";

interface PainDetailsProps {
  onChange: (values: { 
    painSiteIds: number[],
    headacheSeverity: string | null 
  }) => void;
  defaultValues?: {
    painSiteIds: number[];
    headacheSeverity: string | null;
  };
}

export function PainDetails({ onChange, defaultValues }: PainDetailsProps) {
  const { data: painSites = [] } = usePainSites();
  const [selectedPainSites, setSelectedPainSites] = useState<number[]>(
    defaultValues?.painSiteIds || []
  );
  const [severity, setSeverity] = useState<string | null>(
    defaultValues?.headacheSeverity || null
  );

  const handlePainSiteChange = (painSiteId: number, checked: boolean) => {
    const newSelectedPainSites = checked
      ? [...selectedPainSites, painSiteId]
      : selectedPainSites.filter(id => id !== painSiteId);
    
    setSelectedPainSites(newSelectedPainSites);
    onChange({ painSiteIds: newSelectedPainSites, headacheSeverity: severity });
  };

  const handleSeverityChange = (value: string) => {
    setSeverity(value);
    onChange({ painSiteIds: selectedPainSites, headacheSeverity: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Site of Pain</Label>
        <div className="grid grid-cols-2 gap-4">
          {painSites.map((painSite) => (
            <div key={painSite.id} className="flex items-center space-x-2">
              <Checkbox
                id={`pain-site-${painSite.id}`}
                checked={selectedPainSites.includes(painSite.id)}
                onCheckedChange={(checked) => 
                  handlePainSiteChange(painSite.id, checked as boolean)
                }
              />
              <Label htmlFor={`pain-site-${painSite.id}`}>{painSite.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Headache Severity</Label>
        <Select
          value={severity || ''}
          onValueChange={handleSeverityChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mild">Mild</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Severe">Severe</SelectItem>
            <SelectItem value="Extreme">Extreme</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}