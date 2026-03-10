"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Send,
} from "lucide-react";
import type { Newsletter } from "../entities/newsletter";
import { useRouter } from "next/navigation";

interface NewsletterListProps {
  initialData: Newsletter[];
  subscriberCount: number;
}

export default function NewsletterList({ initialData, subscriberCount }: NewsletterListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  });

  const resetForm = () => {
    setFormData({ subject: "", body: "" });
    setEditingId(null);
  };

  const handleEdit = (nl: Newsletter) => {
    if (nl.status === "sent") return;
    setFormData({ subject: nl.subject, body: nl.body });
    setEditingId(nl.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/marketing/newsletters/${id}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    });
  };

  const handleSend = async (id: string) => {
    if (!confirm(`Send this campaign to ${subscriberCount} subscribers?`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/marketing/newsletters/${id}/send`, {
        method: "POST",
      });
      if (res.ok) router.refresh();
      else {
        const data = await res.json();
        alert(data.error || "Failed to send");
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const url = editingId 
        ? `/api/admin/marketing/newsletters/${editingId}`
        : "/api/admin/marketing/newsletters";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsOpen(false);
        resetForm();
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Compose and send emails to your {subscriberCount} active subscribers.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if(!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "New"} Newsletter</DialogTitle>
                <DialogDescription>
                  Write your message. Use HTML for rich formatting.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Welcome to Nextura! 🚀"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body">Email Body (HTML)</Label>
                  <Textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="<h1>Hello!</h1><p>Thanks for joining...</p>"
                    className="min-h-[300px] font-mono text-sm"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Update Draft" : "Save as Draft"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No campaigns yet.
                </TableCell>
              </TableRow>
            ) : (
              initialData.map((nl) => (
                <TableRow key={nl.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {nl.subject}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      nl.status === "sent" ? "default" : 
                      nl.status === "sending" ? "outline" :
                      nl.status === "failed" ? "destructive" : "secondary"
                    }>
                      {nl.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{nl.status === "sent" ? nl.sentCount : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(nl.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {nl.status === "draft" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Send Now"
                          onClick={() => handleSend(nl.id)}
                          disabled={isPending}
                        >
                          <Send className="h-4 w-4 text-emerald-500" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleEdit(nl)}
                            disabled={nl.status === "sent" || nl.status === "sending"}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(nl.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
