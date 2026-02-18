"use client";

import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome to Settings
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select an option from the sidebar to manage your account settings,
          preferences, and security options.
        </p>

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <p>✓ Update your notification preferences</p>
          <p>✓ Change your password</p>
          <p>✓ Manage payment information</p>
          <p>✓ Get customer support</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;