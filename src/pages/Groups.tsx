import { useState } from "react";
import { Search, Plus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
  description: string;
  memberCount: number;
}

const sampleGroups: Group[] = [
  { id: 1, name: "Youth Ministry", description: "Ages 13-18", memberCount: 24 },
  { id: 2, name: "Worship Team", description: "Music and praise", memberCount: 12 },
  { id: 3, name: "Bible Study", description: "Wednesday evenings", memberCount: 18 },
  { id: 4, name: "Children's Ministry", description: "Ages 4-12", memberCount: 32 },
];

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>(sampleGroups);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: groups.length + 1,
        name: newGroupName,
        description: newGroupDescription,
        memberCount: 0,
      };
      setGroups([...groups, newGroup]);
      toast.success(`Group "${newGroupName}" created successfully`);
      setNewGroupName("");
      setNewGroupDescription("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Groups</h1>
        <p className="text-muted-foreground">Organize members into ministry groups</p>
      </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Add a new ministry group to organize your congregation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Youth Ministry"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-secondary rounded-lg">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{group.memberCount}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
                <Link to={`/groups/${group.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No groups found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Groups;
