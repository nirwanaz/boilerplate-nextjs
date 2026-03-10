"use client";

import { useTransition } from "react";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Mail } from "lucide-react";
import type { Subscriber } from "../../newsletter/entities/subscriber";
import { useRouter } from "next/navigation";

interface SubscriberListProps {
  initialData: Subscriber[];
}

export default function SubscriberList({ initialData }: SubscriberListProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/marketing/subscribers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    });
  };

  const handleUnsubscribe = async (id: string) => {
    if (!confirm("Unsubscribe this user manually?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/marketing/subscribers/${id}/unsubscribe`, {
        method: "POST",
      });
      if (res.ok) router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your newsletter audience ({initialData.length} total).
          </p>
        </div>
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No subscribers found.
                </TableCell>
              </TableRow>
            ) : (
              initialData.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell>{s.name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {s.source || "website"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.status === "active" ? "default" : "secondary"}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(s.subscribedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {s.status === "active" && (
                          <DropdownMenuItem onClick={() => handleUnsubscribe(s.id)}>
                            Unsubscribe
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
