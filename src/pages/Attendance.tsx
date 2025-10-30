import { useState } from "react";
import { Search, CheckCircle, Circle, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

// Sample data
const sampleMembers = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Mary Johnson" },
  { id: 3, name: "David Williams" },
  { id: 4, name: "Sarah Brown" },
  { id: 5, name: "Michael Davis" },
  { id: 6, name: "Jennifer Wilson" },
  { id: 7, name: "Robert Taylor" },
  { id: 8, name: "Lisa Anderson" },
];

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [serviceDate] = useState(new Date().toLocaleDateString());

  const filteredMembers = sampleMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (memberId: number) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSaveAttendance = () => {
    toast.success(`Attendance saved for ${selectedMembers.size} members`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Record Attendance</h1>
        <p className="text-muted-foreground">Mark who attended today's service</p>
      </div>
      {/* Service Info */}
      <Card className="shadow-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Service Information
            </CardTitle>
            <CardDescription>Sunday Morning Service - {serviceDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{selectedMembers.size}</p>
                <p className="text-sm text-muted-foreground">Members marked present</p>
              </div>
              <Button onClick={handleSaveAttendance} disabled={selectedMembers.size === 0}>
                Save Attendance
              </Button>
            </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="grid gap-4 md:grid-cols-2">
          {filteredMembers.map((member) => {
            const isSelected = selectedMembers.has(member.id);
            return (
              <Card
                key={member.id}
                className={`cursor-pointer shadow-soft hover:shadow-medium transition-all ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => toggleMember(member.id)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12 bg-gradient-secondary">
                    <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSelected ? "Present" : "Absent"}
                    </p>
                  </div>
                  {isSelected ? (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </CardContent>
              </Card>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-1">No members found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Attendance;
