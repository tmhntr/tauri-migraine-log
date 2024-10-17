import React, { useState } from 'react';
import { Entry } from '../types';
import { addEntry } from '../db';
// import { useNavigate } from 'react-router-dom';
import BasicInfo from './steps/BasicInfo';
import PainDetails from './steps/PainDetails';
import Symptoms from './steps/Symptoms';
import Warnings from './steps/Warnings';
import Factors from './steps/Factors';
import OtherDetails from './steps/OtherDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const CreateEntryForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Entry>>({});
  // const navigate = useNavigate();

  
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
    // navigate('/');
  };
  
  

  return (
    <form onSubmit={handleSubmit} className='flex flex-col p-4 bg-white border-slate-500 border rounded-md mx-auto'>
      <Tabs defaultValue="basic-info" className="">
        <TabsList>
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="pain">Pain</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
          <TabsTrigger value="factors">Factors</TabsTrigger>
          <TabsTrigger value="other">Other details</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info"><BasicInfo formData={formData} handleInputChange={handleInputChange} /></TabsContent>
        <TabsContent value="pain"><PainDetails formData={formData} handleInputChange={handleInputChange} /></TabsContent>
        <TabsContent value="symptoms"><Symptoms formData={formData} handleInputChange={handleInputChange} /></TabsContent>
        <TabsContent value="warnings"><Warnings formData={formData} handleInputChange={handleInputChange} /></TabsContent>
        <TabsContent value="factors"><Factors formData={formData} handleInputChange={handleInputChange} /></TabsContent>
        <TabsContent value="other"><OtherDetails formData={formData} handleInputChange={handleInputChange} /></TabsContent>
      </Tabs>

    </form>
  );
};

export default CreateEntryForm;
