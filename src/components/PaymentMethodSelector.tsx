import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Bitcoin, Zap, Coins, Check, Percent, Landmark, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
const AppleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>;
export type PaymentMethodType = "credit_card" | "apple_pay" | "google_pay" | "cash_app" | "bitcoin" | "lightning" | "usdt" | "wire" | "ach";
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
  id: "apple_pay",
  name: "Apple Pay",
  icon: <AppleIcon />,
  type: "manual"
}, {
  id: "google_pay",
  name: "Google Pay",
  icon: <GoogleIcon />,
  type: "manual"
}, {
  id: "cash_app",
  name: "Cash App",
  icon: <Wallet className="w-5 h-5" />,
  type: "manual"
}, {
  id: "wire",
  name: "Wire Transfer",
  icon: <Landmark className="w-5 h-5" />,
  type: "manual"
}, {
  id: "ach",
  name: "ACH",
  icon: <Building2 className="w-5 h-5" />,
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
        

        {/* Selection Confirmation */}
        {selectedMethodData}
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