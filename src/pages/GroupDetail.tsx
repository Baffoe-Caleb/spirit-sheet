import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Search, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const groupsData = {
  "1": {
    name: "Youth Ministry",
    description: "Ages 13-18",
    leader: "Sarah Johnson",
    meetingTime: "Fridays at 7:00 PM",
    members: [
      { id: 1, name: "John Smith", phone: "(555) 123-4567", email: "john@example.com" },
      { id: 2, name: "Mary Johnson", phone: "(555) 234-5678", email: "mary@example.com" },
      { id: 3, name: "David Williams", phone: "(555) 345-6789", email: "david@example.com" },
    ],
  },
  "2": {
    name: "Worship Team",
    description: "Music and praise",
    leader: "Michael Davis",
    meetingTime: "Sundays at 9:00 AM",
    members: [
      { id: 4, name: "Sarah Brown", phone: "(555) 456-7890", email: "sarah@example.com" },
      { id: 5, name: "Michael Davis", phone: "(555) 567-8901", email: "michael@example.com" },
    ],
  },
  "3": {
    name: "Bible Study",
    description: "Wednesday evenings",
    leader: "Robert Taylor",
    meetingTime: "Wednesdays at 7:30 PM",
    members: [
      { id: 6, name: "Jennifer Wilson", phone: "(555) 678-9012", email: "jennifer@example.com" },
      { id: 7, name: "Robert Taylor", phone: "(555) 789-0123", email: "robert@example.com" },
      { id: 8, name: "Lisa Anderson", phone: "(555) 890-1234", email: "lisa@example.com" },
    ],
  },
  "4": {
    name: "Children's Ministry",
    description: "Ages 4-12",
    leader: "Lisa Anderson",
    meetingTime: "Sundays at 10:00 AM",
    members: [
      { id: 1, name: "John Smith", phone: "(555) 123-4567", email: "john@example.com" },
      { id: 2, name: "Mary Johnson", phone: "(555) 234-5678", email: "mary@example.com" },
    ],
  },
};

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const group = id ? groupsData[id as keyof typeof groupsData] : null;

  if (!group) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Group not found</p>
            <Link to="/groups">
              <Button className="mt-4">Back to Groups</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredMembers = group.members.filter((member) =>
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
      <Link to="/groups" className="inline-flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Link>

      {/* Group Header */}
      <Card className="shadow-soft mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{group.name}</CardTitle>
              <CardDescription className="text-base">{group.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {group.members.length} Members
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Group Leader</p>
              <p className="font-medium">{group.leader}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Meeting Time</p>
              <p className="font-medium">{group.meetingTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Members</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

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

export default GroupDetail;
