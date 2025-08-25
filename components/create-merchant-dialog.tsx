"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { createMerchant, CreateMerchantData } from "@/app/actions/merchant";

const DEFAULT_MERCHANT_DATA: CreateMerchantData = {
  merchant_name: "",
  merchant_details: {
    primary_contact_person: "",
    primary_email: "",
    primary_phone: "",
    address: {
      line1: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      first_name: "",
      last_name: "",
    },
  },
  bank_accounts: [
    {
      bank_name: "",
      bank_code: "",
      account_number: "",
      account_name: "",
      account_currency: "",
      is_default: true,
    },
  ],
};

export function CreateMerchantSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMerchantData>(
    DEFAULT_MERCHANT_DATA
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createMerchant(formData);

      if (result.success) {
        toast.success("Merchant created successfully!", {
          description: "The new merchant has been added to your account.",
        });
        setIsOpen(false);
        // Reset form if needed
        setFormData(DEFAULT_MERCHANT_DATA);
      } else {
        toast.error("Failed to create merchant", {
          description: result.error,
        });
      }
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Merchant
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Merchant</SheetTitle>
          <SheetDescription>
            Add a new merchant to your account. Fill in all the required
            information below.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="merchant_name">Merchant Name *</Label>
              <Input
                id="merchant_name"
                value={formData.merchant_name}
                onChange={(e) =>
                  setFormData({ ...formData, merchant_name: e.target.value })
                }
                placeholder="Enter merchant name"
                required
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Details</h3>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_person">
                Primary Contact Person *
              </Label>
              <Input
                id="primary_contact_person"
                value={formData.merchant_details.primary_contact_person}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    merchant_details: {
                      ...formData.merchant_details,
                      primary_contact_person: e.target.value,
                    },
                  })
                }
                placeholder="Enter contact person name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_email">Primary Email *</Label>
              <Input
                id="primary_email"
                type="email"
                value={formData.merchant_details.primary_email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    merchant_details: {
                      ...formData.merchant_details,
                      primary_email: e.target.value,
                    },
                  })
                }
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_phone">Primary Phone *</Label>
              <Input
                id="primary_phone"
                type="tel"
                value={formData.merchant_details.primary_phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    merchant_details: {
                      ...formData.merchant_details,
                      primary_phone: e.target.value,
                    },
                  })
                }
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.merchant_details.address.first_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchant_details: {
                        ...formData.merchant_details,
                        address: {
                          ...formData.merchant_details.address,
                          first_name: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="First name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.merchant_details.address.last_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchant_details: {
                        ...formData.merchant_details,
                        address: {
                          ...formData.merchant_details.address,
                          last_name: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="line1">Address Line 1 *</Label>
              <Input
                id="line1"
                value={formData.merchant_details.address.line1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    merchant_details: {
                      ...formData.merchant_details,
                      address: {
                        ...formData.merchant_details.address,
                        line1: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.merchant_details.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchant_details: {
                        ...formData.merchant_details,
                        address: {
                          ...formData.merchant_details.address,
                          city: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="City"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.merchant_details.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchant_details: {
                        ...formData.merchant_details,
                        address: {
                          ...formData.merchant_details.address,
                          state: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={formData.merchant_details.address.zip}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchant_details: {
                        ...formData.merchant_details,
                        address: {
                          ...formData.merchant_details.address,
                          zip: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="ZIP code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.merchant_details.address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      merchant_details: {
                        ...formData.merchant_details,
                        address: {
                          ...formData.merchant_details.address,
                          country: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Country"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bank Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bank Account Information</h3>

            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name *</Label>
              <Input
                id="bank_name"
                value={formData.bank_accounts[0].bank_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bank_accounts: [
                      {
                        ...formData.bank_accounts[0],
                        bank_name: e.target.value,
                      },
                    ],
                  })
                }
                placeholder="Bank name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_code">Bank Code *</Label>
                <Input
                  id="bank_code"
                  value={formData.bank_accounts[0].bank_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_accounts: [
                        {
                          ...formData.bank_accounts[0],
                          bank_code: e.target.value,
                        },
                      ],
                    })
                  }
                  placeholder="Bank code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_currency">Currency *</Label>
                <Input
                  id="account_currency"
                  value={formData.bank_accounts[0].account_currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bank_accounts: [
                        {
                          ...formData.bank_accounts[0],
                          account_currency: e.target.value,
                        },
                      ],
                    })
                  }
                  placeholder="Currency"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number *</Label>
              <Input
                id="account_number"
                value={formData.bank_accounts[0].account_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bank_accounts: [
                      {
                        ...formData.bank_accounts[0],
                        account_number: e.target.value,
                      },
                    ],
                  })
                }
                placeholder="Account number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_name">Account Name *</Label>
              <Input
                id="account_name"
                value={formData.bank_accounts[0].account_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bank_accounts: [
                      {
                        ...formData.bank_accounts[0],
                        account_name: e.target.value,
                      },
                    ],
                  })
                }
                placeholder="Account holder name"
                required
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 py-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Merchant"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
