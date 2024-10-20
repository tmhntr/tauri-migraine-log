import React, { useState } from "react";
import { addEntry } from "@/db";
import BasicInfo from "./BasicInfo";
import PainDetails from "./PainDetails";
import Symptoms from "./Symptoms";
import Warnings from "./Warnings";
import Factors from "./Factors";
import OtherDetails from "./OtherDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { EntryType } from "@/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { X } from "lucide-react";

const CreateEntryForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<EntryType>>({});

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const navigate = useNavigate({ from: "/create" });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = await addEntry(formData);
    console.log("Entry added successfully");
    navigate({ to: "/entries/$entryId", params: { entryId: `${id}` } });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({ to: "/" });
  };

  const tabs = [
    "basic-info",
    "pain",
    "symptoms",
    "warnings",
    "factors",
    "other",
  ];

  const [tabState, setTabState] = useState("basic-info");

  const nextTab = () => {
    const currentIndex = tabs.indexOf(tabState);
    if (currentIndex < tabs.length - 1) {
      setTabState(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const currentIndex = tabs.indexOf(tabState);
    if (currentIndex > 0) {
      setTabState(tabs[currentIndex - 1]);
    }
  };

  return (
    <Card className="max-w-prose mx-auto">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Create New Entry</CardTitle>
            <CardDescription>
              Add in key information about the migraine episode that you want to
              record.
            </CardDescription>
          </div>
          <Button variant={"ghost"} className="w-10 h-10 p-0 rounded-full" type="reset">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic-info" className="" value={tabState} onValueChange={setTabState}>
            <TabsList>
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="pain">Pain</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
              <TabsTrigger value="factors">Factors</TabsTrigger>
              <TabsTrigger value="other">Other details</TabsTrigger>
            </TabsList>
            <TabsContent value="basic-info">
              <BasicInfo
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
            <TabsContent value="pain">
              <PainDetails
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
            <TabsContent value="symptoms">
              <Symptoms
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
            <TabsContent value="warnings">
              <Warnings
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
            <TabsContent value="factors">
              <Factors
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
            <TabsContent value="other">
              <OtherDetails
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          <div className="flex gap-2">
            {tabs.indexOf(tabState) > 0  && <Button variant={"secondary"} onClick={prevTab} type="button">
              Previous
            </Button>}
            {tabs.indexOf(tabState) < tabs.length - 1 && <Button variant={"secondary"} onClick={nextTab} type="button">
              Next
            </Button>}
          </div>
          <Button type="submit">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateEntryForm;
