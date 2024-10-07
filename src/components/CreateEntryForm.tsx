import React, { useState } from 'react';
import { Entry } from '../types';
import { addEntry } from '../db';
import { useNavigate } from 'react-router-dom';
import BasicInfo from './steps/BasicInfo';
import PainDetails from './steps/PainDetails';
import Symptoms from './steps/Symptoms';
import Warnings from './steps/Warnings';
import Factors from './steps/Factors';
import OtherDetails from './steps/OtherDetails';

const CreateEntryForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Entry>>({});
  const navigate = useNavigate();

  const steps = [
    { name: 'Basic Info', component: BasicInfo },
    { name: 'Pain Details', component: PainDetails },
    { name: 'Symptoms', component: Symptoms },
    { name: 'Warnings', component: Warnings },
    { name: 'Factors', component: Factors },
    { name: 'Other Details', component: OtherDetails },
  ];

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEntry(formData);
    console.log('Entry added successfully');
    navigate('/');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{steps[currentStep].name}</h2>
      <CurrentStepComponent
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <div>
        {currentStep > 0 && (
          <button type="button" onClick={() => setCurrentStep(prev => prev - 1)}>
            Previous
          </button>
        )}
        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={() => setCurrentStep(prev => prev + 1)}>
            Next
          </button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </div>
    </form>
  );
};

export default CreateEntryForm;
