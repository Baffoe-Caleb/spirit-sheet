import { useState } from "react";
import { Search, UserPlus, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Sample data
const sampleMembers = [
  { id: 1, name: "John Smith", phone: "(555) 123-4567", email: "john@example.com" },
  { id: 2, name: "Mary Johnson", phone: "(555) 234-5678", email: "mary@example.com" },
  { id: 3, name: "David Williams", phone: "(555) 345-6789", email: "david@example.com" },
  { id: 4, name: "Sarah Brown", phone: "(555) 456-7890", email: "sarah@example.com" },
  { id: 5, name: "Michael Davis", phone: "(555) 567-8901", email: "michael@example.com" },
  { id: 6, name: "Jennifer Wilson", phone: "(555) 678-9012", email: "jennifer@example.com" },
  { id: 7, name: "Robert Taylor", phone: "(555) 789-0123", email: "robert@example.com" },
  { id: 8, name: "Lisa Anderson", phone: "(555) 890-1234", email: "lisa@example.com" },
];

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = sampleMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold mb-2">Member Directory</h1>
        <p className="text-muted-foreground">Manage your congregation members</p>
      </div>
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
        </Button>
      </div>

      {/* Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 bg-gradient-secondary">
                    <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>Active Member</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
              </CardContent>
          </Card>
        ))}
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

export default Members;
