import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

const LocationAndSearch = () => {
  return (
    <div className="w-full flex justify-between gap-10">
      <div className="flex gap-2 text-sm items-center">
        <MapPin className="text-primary size-4" />{" "}
        <span>New York, NY, USA</span>
      </div>

      <Link href="/app/search">
        <div className="bg-app rounded-sm p-2 flex items-center gap-2 w-80 max-w-full cursor-pointer">
          <Search className="size-4 text-muted-foreground" />{" "}
          <span className="text-muted-foreground">Search</span>
        </div>
      </Link>
    </div>
  );
};

export default LocationAndSearch;
