import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Wallet, Bitcoin, Zap, Coins, Check, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
export type PaymentMethodType = "credit_card" | "apple_google_pay" | "cash_app" | "bitcoin" | "lightning" | "usdt";
interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: React.ReactNode;
  type: "recurring" | "manual";
  discount?: number;
}
const paymentMethods: PaymentMethod[] = [{
  id: "bitcoin",
  name: "Bitcoin",
  icon: <Bitcoin className="w-5 h-5" />,
  type: "manual",
  discount: 5
}, {
  id: "lightning",
  name: "Lightning Network",
  icon: <Zap className="w-5 h-5" />,
  type: "manual",
  discount: 5
}, {
  id: "usdt",
  name: "USDT",
  icon: <Coins className="w-5 h-5" />,
  type: "manual",
  discount: 5
}, {
  id: "apple_google_pay",
  name: "Apple Pay / Google Pay",
  icon: <Smartphone className="w-5 h-5" />,
  type: "manual"
}, {
  id: "cash_app",
  name: "Cash App",
  icon: <Wallet className="w-5 h-5" />,
  type: "manual"
}, {
  id: "credit_card",
  name: "Credit Card",
  icon: <CreditCard className="w-5 h-5" />,
  type: "recurring"
}];
interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType | null;
  onMethodChange: (method: PaymentMethodType) => void;
}
export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange
}: PaymentMethodSelectorProps) {
  const recurringMethods = paymentMethods.filter(m => m.type === "recurring");
  const manualMethods = paymentMethods.filter(m => m.type === "manual");
  const discountMethods = paymentMethods.filter(m => m.discount);
  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const isManualSelected = manualMethods.some(m => m.id === selectedMethod);
  const isRecurringSelected = recurringMethods.some(m => m.id === selectedMethod);
  return <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>Choose how you'd like to pay your service fees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMethod || ""} onValueChange={value => onMethodChange(value as PaymentMethodType)} className="space-y-6">
          {/* Manual Section */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Badge variant={isManualSelected ? "default" : "secondary"} className={isManualSelected ? "bg-emerald-600 hover:bg-emerald-600" : ""}>
                {isManualSelected && <Check className="w-3 h-3 mr-1" />}
                Manual
              </Badge>
              
            </div>
            <div className="space-y-2">
              {manualMethods.map(method => <PaymentOptionCard key={method.id} method={method} isSelected={selectedMethod === method.id} />)}
            </div>
          </div>

          {/* Recurring/Automatic Section */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Badge variant={isRecurringSelected ? "default" : "secondary"} className={isRecurringSelected ? "bg-emerald-600 hover:bg-emerald-600" : ""}>
                {isRecurringSelected && <Check className="w-3 h-3 mr-1" />}
                Automatic
              </Badge>
              
            </div>
            <div className="space-y-2">
              {recurringMethods.map(method => <PaymentOptionCard key={method.id} method={method} isSelected={selectedMethod === method.id} />)}
            </div>
          </div>
        </RadioGroup>

        {/* Discount Notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <Percent className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-300">5% Discount on Crypto Payments</p>
            <p className="text-amber-700 dark:text-amber-400 mt-1">
              Save 5% on service fees when paying with {discountMethods.map(m => m.name).join(", ")}.
            </p>
          </div>
        </div>

        {/* Selection Confirmation */}
        {selectedMethodData && <div className={cn("flex items-center gap-3 p-4 rounded-lg", selectedMethodData.discount ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" : "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800")}>
            <Check className={cn("w-5 h-5", selectedMethodData.discount ? "text-amber-600" : "text-emerald-600")} />
            <div className="text-sm">
              <span className={cn("font-medium", selectedMethodData.discount ? "text-amber-800 dark:text-amber-300" : "text-emerald-800 dark:text-emerald-300")}>
                {selectedMethodData.name} selected
              </span>
              {selectedMethodData.discount && <span className="text-amber-700 dark:text-amber-400"> — You'll receive a {selectedMethodData.discount}% discount!</span>}
              {selectedMethodData.type === "recurring" && <p className="text-emerald-700 dark:text-emerald-400 mt-1">
                  Your card will be charged automatically when invoices are due.
                </p>}
              {selectedMethodData.type === "manual" && <p className={cn("mt-1", selectedMethodData.discount ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400")}>
                  You'll receive an invoice via email with payment instructions.
                </p>}
            </div>
          </div>}
      </CardContent>
    </Card>;
}
function PaymentOptionCard({
  method,
  isSelected
}: {
  method: PaymentMethod;
  isSelected: boolean;
}) {
  return <Label htmlFor={method.id} className={cn("flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all", isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50")}>
      <RadioGroupItem value={method.id} id={method.id} className="shrink-0" />
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", method.discount ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground")}>
        {method.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{method.name}</span>
          {method.discount && <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 text-xs">
              {method.discount}% off
            </Badge>}
        </div>
      </div>
    </Label>;
}