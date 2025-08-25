"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchMerchants, Merchant } from "@/app/actions/merchant";
import { createOrder, CreateOrderData, Order } from "@/app/actions/order";
import { SidebarMenuButton } from "./ui/sidebar";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function CreateTransactionDialog() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"create" | "result">("create");
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState("0.00");
  const [description, setDescription] = useState("");

  const handleCreateTransaction = async () => {
    if (!selectedMerchant) return;

    const merchant = merchants.find((m) => m.name === selectedMerchant);
    if (!merchant) return;

    const defaultBankAccount = merchant.bank_accounts.find((b) => b.is_default);
    if (!defaultBankAccount) {
      toast.error("No default bank account found for this merchant");
      return;
    }

    const payload: CreateOrderData = {
      amount,
      currency: "MNT",
      description,
      transaction_type: "payment",
      bank_account_id: defaultBankAccount.id,
    };

    try {
      setLoading(true);

      const response = await createOrder(merchant, payload);
      setLoading(false);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      setOrder(response.data);
      setStep("result");
    } catch (error) {
      console.log("error", JSON.stringify(error));
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
      return;
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep("create");
    setOrder(null);
    setSelectedMerchant(null);
  };

  useEffect(() => {
    (async () => {
      const merchants = await fetchMerchants();
      setMerchants(merchants);
    })();
  }, [open]);

  return (
    <>
      <SidebarMenuButton
        onClick={() => setOpen(true)}
        tooltip="Create Transaction"
        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
      >
        <IconCirclePlusFilled />
        <span>Create Transaction</span>
      </SidebarMenuButton>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {step === "create" && (
            <>
              <DialogHeader>
                <DialogTitle>Create Transaction</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Merchant</Label>
                  <Select onValueChange={setSelectedMerchant}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      {merchants.map((m) => (
                        <SelectItem key={m.name} value={m.name}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateTransaction}
                  disabled={!selectedMerchant}
                >
                  {loading ? "Loading..." : "Create Transaction"}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "result" && order && (
            <>
              <DialogHeader>
                <DialogTitle>Transaction Created</DialogTitle>
              </DialogHeader>
              <div className="space-y-1 py-2">
                <div>
                  Payment Code:{" "}
                  <span className="font-semibold">
                    {order.payment_code || "-"}
                  </span>
                </div>
                <div>
                  Amount:{" "}
                  <span className="font-semibold">
                    {order.amount} {order.currency}
                  </span>
                </div>
                {/* <div>
                  Status:{" "}
                  <span className="font-semibold">
                    {order.status || "Pending"}
                  </span>
                </div> */}
                <div className="flex justify-center mt-6 p-2 border border-gray-300 rounded-lg">
                  <Image
                    src={`data:image/png;base64,${order.raw_data.qr_code}`}
                    alt="QR Code"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleClose}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
