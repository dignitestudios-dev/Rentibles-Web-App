"use client";

import { ArrowLeft, ChevronRight, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const VerifyOtpForm = () => {
  return (
    <div className="w-full ">
      <Card className="mb-4 flex items-center justify-between p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Email address</p>
              <p className="text-xs text-gray-500">design@dignitestudios.pk</p>
            </div>
          </div>

          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-orange-500 text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </Card>
      <Card className="mb-4 flex items-center justify-between p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Phone number</p>
              <p className="text-xs text-gray-500">+1 695 201 794</p>
            </div>
          </div>
          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-orange-500 text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyOtpForm;
