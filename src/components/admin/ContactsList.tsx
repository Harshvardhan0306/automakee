
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Phone, Mail, User, Calendar, MessageSquare, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ContactsList() {
  const { contacts, isLoading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  
  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      (contact.phone && contact.phone.toLowerCase().includes(query)) ||
      contact.message.toLowerCase().includes(query)
    );
  });
  
  const currentContact = contacts.find(contact => contact.id === selectedContact);
  
  const handleViewContact = (id: string) => {
    setSelectedContact(id);
  };
  
  const closeDialog = () => {
    setSelectedContact(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>
            View and manage contact form submissions from your website.
          </CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border p-4 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone || "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {contact.message}
                      </TableCell>
                      <TableCell>{contact.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewContact(contact.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No contacts found matching your search."
                  : "No contact submissions yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Contact Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the contact submission
            </DialogDescription>
          </DialogHeader>
          
          {currentContact && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-primary/10 rounded-lg p-5 flex-1">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{currentContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{currentContact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{currentContact.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-5 flex-1">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Submission Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Submission Date</p>
                      <p className="font-medium">{currentContact.date.toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentContact.date.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline" className="mt-1">New</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border/50 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Message
                </h3>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {currentContact.message}
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeDialog}>Close</Button>
                <Button>Mark as Responded</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
