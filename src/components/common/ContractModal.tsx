/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getBookingDateTimeString,
  getReturnDateTimeString,
  getTotalAmountString,
} from "@/src/utils/helperFunctions/pdfFunction/rentalPDFUtils";

type productTypes = {
  productName: string;
  productId: string;
  pickupTime: number;
  dropOffTime: number;
  quantity: number;
  selectionMode: "day" | "hour" | null;
  dateRange: { from?: Date | undefined; to?: Date | undefined } | undefined;
  timeSlots: { startEpoch: number; endEpoch: number }[];
  hourlyPrice: number;
  dailyPrice: number;
  renterName: string;
  ownerName: string;
};

interface ContractModalProps {
  open: boolean;
  onClose: () => void;
  product: productTypes;
}

export default function ContractModal({
  open,
  onClose,
  product,
}: ContractModalProps) {
  const {
    productName = "",
    productId = "",
    quantity = 1,
    pickupTime,
    dropOffTime,
    hourlyPrice,
    dailyPrice,
    selectionMode,
    dateRange,
    timeSlots = [],
    renterName = "",
    ownerName = "",
  } = product;
  const bookingDateTime = getBookingDateTimeString(
    selectionMode,
    dateRange,
    timeSlots,
    pickupTime,
    dropOffTime,
  );
  const returnDateTime = getReturnDateTimeString(
    selectionMode,
    dateRange,
    timeSlots,
    dropOffTime,
  );
  const totalAmount = getTotalAmountString(
    selectionMode,
    dateRange,
    timeSlots,
    quantity,
    dailyPrice,
    hourlyPrice,
  );

  const [signature, setSignature] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        {/* HEADER */}
        <div className="bg-gray-300 relative p-6">
          <div className="absolute top-0 right-0 w-40 h-18 bg-orange-500 skew-x-[40deg]" />
          <h2 className="text-xl font-bold">Rentibles Contract</h2>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <h3 className="text-lg font-semibold">Rental Policy</h3>
          <p>
            Welcome to Rentibles! We are committed to providing high-quality
            rental items and ensuring a smooth rental experience for all users.
            This Rental Policy outlines the responsibilities of both renters and
            lenders regarding the care, maintenance, and proper handling of
            rented items through the Rentibles platform.
          </p>
          <p>
            Please read this policy carefully, as you will be required to agree
            to these terms before completing any rental transaction.
          </p>
          <p>
            By signing this Rental Policy, you acknowledge that you understand
            and agree to comply with the terms and conditions regarding the
            proper care, maintenance, return, and listing of rental items
            through the Rentibles platform.
          </p>

          <h4 className="font-semibold mt-4">RenTer</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Inspection Upon Receipt:</strong> Upon receiving your
              rented item, it is your responsibility to thoroughly inspect it
              for any damage, defects, or missing parts. You must report any
              issues to the owner of the item immediately at time of pickup or
              within one hour of pickup. Failure to report issues will be deemed
              as your acknowledgment that the item was received in good
              condition.
            </li>
            <li>
              <strong>Proper Use and Maintenance:</strong> You agree to use the
              rented item only for its intended purpose and to follow any
              provided instructions or guidelines for its operation and care.
              You are responsible for maintaining the item in the condition in
              which it was rented. Specifically:
              <ul className="list-disc list-inside ml-6">
                <li>Keep the item clean and in good working order.</li>
                <li>Avoid excessive wear and tear beyond normal use.</li>
                <li>Do not modify, disassemble, or alter the item.</li>
                <li>
                  Store the item properly when not in use to prevent damage or
                  degradation.
                </li>
              </ul>
            </li>
            <li>
              <strong>Damage and Loss:</strong> You are responsible for any
              damage, loss, or theft of the rented item while it is in your
              possession. If an item is returned damaged or is lost, you will be
              charged for repair costs or the replacement value of the item.
              <ul className="list-disc list-inside ml-6">
                <li>
                  <strong>Damage Reporting:</strong> If the item becomes damaged
                  during your rental period, you must immediately inform the
                  property owner through the Rentibles mobile app.
                </li>
                <li>
                  <strong>Lost or Stolen Items:</strong> If an item is lost or
                  stolen while in your possession, you must notify the property
                  owner immediately. You may be required to pay up to the full
                  replacement cost.
                </li>
              </ul>
            </li>
            <li>
              <strong>Returning Items:</strong> You agree to return the rented
              item by the agreed-upon return date/time. Late returns will incur
              additional rental fees, and continued failure to return may result
              in legal action.
            </li>
            <li>
              <strong>Cleaning and Maintenance Before Return:</strong> Items
              must be cleaned, in good working order, and returned with all
              accessories and packaging materials. Failure may result in
              additional fees.
            </li>
            <li>
              <strong>Security Deposit (If Applicable):</strong> High-value
              items may require a deposit, refundable upon safe return.
            </li>
            <li>
              <strong>Prohibited Uses:</strong> Items must not be used for
              illegal, dangerous, or unauthorized activities.
            </li>
            <li>
              <strong>Cancellation and Refund Policy:</strong> Notify Rentibles
              at least one hour before the rental period begins for a full
              refund. Late cancellations may incur fees.
            </li>
            <li>
              <strong>Insurance:</strong> Proof of insurance may be required for
              high-value items.
            </li>
            <li>
              <strong>Indemnification:</strong> You agree to indemnify and hold
              harmless Rentibles from claims or damages arising from improper
              use.
            </li>
            <li>
              <strong>Termination of Rental Agreement:</strong> Rentibles
              reserves the right to terminate agreements if policies are
              violated.
            </li>
            <li>
              <strong>Legal Jurisdiction:</strong> Governed by the laws of Erie
              County, New York.
            </li>
          </ol>

          <h4 className="font-semibold mt-6">Lender</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>
                Responsibilities and Accountability of the Lender:
              </strong>{" "}
              To ensure fairness and transparency in rental transactions,
              lenders (property owners) are required to adhere to the following
              responsibilities.
            </li>
            <li>
              <strong>Accurate Description of Items:</strong> The lender must
              provide honest descriptions of the item being rented, including
              condition, functionality, and any pre-existing damage.
              Discrepancies must be promptly addressed.
            </li>
            <li>
              <strong>Proper Maintenance of Items:</strong> Items must be safe,
              clean, and operable before being listed. Defective or unsafe items
              must not be rented.
            </li>
            <li>
              <strong>Timely Communication:</strong> Lenders must respond
              promptly to renter-reported issues such as damage, malfunction, or
              assistance requests.
            </li>
            <li>
              <strong>Verification of Legitimacy:</strong> Lenders must confirm
              ownership or authorized control of listed items. Misrepresentation
              may result in termination and legal consequences.
            </li>
            <li>
              <strong>Accountability for Scams or Fraud:</strong> Fraudulent
              activities such as listing non-existent items, misrepresenting
              condition, or demanding unauthorized payments are strictly
              prohibited. Rentibles may suspend or remove violators.
            </li>
            <li>
              <strong>Dispute Resolution Cooperation:</strong> Lenders must
              cooperate with Rentibles’ dispute resolution process and provide
              documentation of item condition before and after rentals.
            </li>
            <li>
              <strong>Return Acceptance:</strong> Lenders must be available to
              accept item returns at the agreed time and location. Failure may
              result in penalties.
            </li>
            <li>
              <strong>No Unauthorized Charges:</strong> All payments must occur
              within the Rentibles platform. External charges or deposits are
              prohibited.
            </li>
            <li>
              <strong>Consequences of Breach:</strong> Violations may result in
              penalties, removal from the platform, or legal action.
            </li>
            <li>
              <strong>Refunds for Non-Functional or Damaged Items:</strong> If
              an item is unusable at pickup and reported within one hour, the
              renter is eligible for a full refund, and the lender forfeits
              payment.
            </li>
          </ol>

          <h4 className="font-semibold mt-4">Limitation of Liability</h4>
          <p>
            Rentibles acts solely as a platform to facilitate rental
            transactions between renters and lenders. Rentibles is not directly
            responsible for mishaps, injuries, losses, or disputes arising from
            rentals. Rentibles does not guarantee the quality, safety, or
            legality of items listed. Issues must be resolved between renter and
            lender, with Rentibles serving only as a mediator.
          </p>

          <h4 className="font-semibold mt-4">Acknowledgment and Signature</h4>
          <p>
            By signing this Rental Policy, you acknowledge that you have read,
            understood, and agree to comply with the terms set forth above.
          </p>
          <ul className="list-disc list-inside ml-6">
            <li>
              <strong>Renters:</strong> Responsible for maintaining items,
              returning them in good condition, and covering costs for damage,
              loss, or late returns.
            </li>
            <li>
              <strong>Lenders:</strong> Responsible for accurate descriptions,
              proper maintenance, and timely resolution of issues or disputes.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">Item/Booking Details</h3>
          <p>
            The following section specifies the item being rented, along with
            relevant booking and return details:
          </p>

          <div className="space-y-2">
            <p>
              Item Name:{" "}
              <span className=" border-b border-black px-2 ">
                {productName}
              </span>
            </p>
            <p>
              Short Code (Order ID):
              <span className=" border-b border-black px-2 ">{productId}</span>
            </p>
            <p>
              Quantity:{" "}
              <span className=" border-b border-black px-2 ">{quantity}</span>
            </p>
            <p>
              Booking Date & Time:{" "}
              <span className=" border-b border-black px-2 ">
                {bookingDateTime}
              </span>
            </p>
            <p>
              Return Date & Time:
              <span className=" border-b border-black px-2 ">
                {returnDateTime}
              </span>
            </p>
            <p>
              Total Amount:{" "}
              <span className=" border-b border-black px-2 ">
                {totalAmount}
              </span>
            </p>
          </div>

          <p className="mt-4">
            Both parties agree to adhere to the terms of this policy to ensure a
            transparent and fair rental experience.
          </p>

          {/* SIGNATURE SECTION */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <p>Renter's Name: </p>
              <div className="border-b border-black h-10 flex items-center">
                <span
                  className="text-xl"
                  style={{ fontFamily: "Dancing Script" }}
                >
                  {ownerName}
                </span>
              </div>
            </div>

            <div>
              <p>Lender/Store's Name:</p>
              <div className="border-b border-black h-10 flex items-center">
                <span
                  className="text-xl"
                  style={{ fontFamily: "Dancing Script" }}
                >
                  {renterName}
                </span>
              </div>
            </div>

            <div>
              <p>Renter's Signature: </p>
              <div className="border-b border-black h-10 flex items-center">
                <span
                  className="text-xl"
                  style={{ fontFamily: "Dancing Script" }}
                >
                  {signature}
                </span>
              </div>
            </div>

            <div>
              <p>Lender's Signature:</p>

              {/* Live Signature Preview */}
              <div className="border-b border-black h-10 flex items-center">
                <span
                  className="text-xl"
                  style={{ fontFamily: "Dancing Script" }}
                >
                  {signature}
                </span>
              </div>

              {/* Input */}
              <Input
                placeholder="Type your signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <p>
                Date:{" "}
                <span className=" border-b border-black px-2 ">
                  {new Date().toLocaleDateString()}
                </span>
              </p>
            </div>

            <div>
              <p>
                Date:{" "}
                <span className=" border-b border-black px-2 ">
                  {new Date().toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* CONTACT */}
          <div className="mt-10 text-xs text-gray-600">
            <p>For any questions or concerns:</p>
            <ul className="list-disc ml-4">
              <li>Email: info@rentibles.com</li>
              <li>
                Address: Rentibles LLC 382 NE 191ST ST NUM 857346, Miami, FL
                33179
              </li>
            </ul>

            <p className="mt-3">
              By agreeing to this policy, you ensure a respectful and successful
              rental experience.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-300 relative h-16">
          <div className="absolute bottom-0 right-0 w-40 h-16 bg-orange-500 skew-x-[-20deg]" />
        </div>

        {/* ACTION */}
        <div className="p-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
