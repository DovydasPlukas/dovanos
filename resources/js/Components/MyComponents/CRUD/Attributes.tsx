import AssignAttributes from './Attributes/AssignAttributes';
import CreateAttributes from './Attributes/CreateAttributes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Toaster } from "@/Components/ui/toaster";

export default function Attributes() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-6">Atributų valdymas</h1>
        <Tabs defaultValue="assign" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assign">Priskirti atributus</TabsTrigger>
            <TabsTrigger value="create">Kurti atributus</TabsTrigger>
          </TabsList>
          <TabsContent value="assign">
            <AssignAttributes />
          </TabsContent>
          <TabsContent value="create">
            <CreateAttributes />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
}