"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import SettingsBackButton from "../_components/SettingsBackButton";

export default function BlockedUsersPage() {
  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      username: "@johnsmith",
      blockedDate: "Feb 14, 2026",
    },
    {
      id: 2,
      name: "Jane Doe",
      username: "@janedoe",
      blockedDate: "Feb 10, 2026",
    },
    {
      id: 3,
      name: "Mike Johnson",
      username: "@mikej",
      blockedDate: "Jan 28, 2026",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUnblock = async (id: number) => {
    setIsLoading(true);
    // TODO: Add unblock logic
    setTimeout(() => {
      setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
      setIsLoading(false);
    }, 500);
  };

  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SettingsBackButton />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Blocked Users
      </h2>
      <p className="text-muted-foreground mb-6">
        Manage users you have blocked
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Blocked Users List */}
      {filteredUsers.length > 0 ? (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Blocked on {user.blockedDate}
                </p>
              </div>

              <Button
                onClick={() => handleUnblock(user.id)}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Unblock
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {blockedUsers.length === 0
              ? "You have not blocked any users"
              : "No blocked users match your search"}
          </p>
        </div>
      )}
    </div>
  );
}
