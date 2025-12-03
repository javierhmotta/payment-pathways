
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, AlertCircle, Receipt, Check, Clock, FileText, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { AddCardDialog } from "@/components/AddCardDialog";
import { toast } from "sonner";

// Mock data for payment history
const mockPayments = [
  {
    id: 1,
    date: "2024-03-15",
    amount: 299.99,
    method: "Credit Card",
    type: "Service Fee",
    status: "Paid",
    last4: "5408",
    description: "Monthly hosting service fee - March 2024"
  },
  {
    id: 2,
    date: "2024-03-01",
    amount: 1499.99,
    method: "Bitcoin",
    type: "Rig Order",
    status: "Pending",
    txId: "1A1zP1...",
    description: "Mining rig purchase - 1x S19 Pro"
  },
  {
    id: 3,
    date: "2024-02-15",
    amount: 299.99,
    method: "Wire Transfer",
    type: "Service Fee",
    status: "Paid",
    description: "Monthly hosting service fee - February 2024"
  }
];

const PaymentHistoryEntry = ({ payment }: { payment: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b last:border-0">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            {payment.method === "Credit Card" ? (
              <CreditCard className="w-5 h-5 text-gray-600" />
            ) : payment.method === "Bitcoin" ? (
              <Wallet className="w-5 h-5 text-gray-600" />
            ) : (
              <FileText className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <div className="font-medium">{payment.type}</div>
            <div className="text-sm text-gray-500">
              {new Date(payment.date).toLocaleDateString()} via {payment.method}
              {payment.last4 && <span> ending in {payment.last4}</span>}
              {payment.txId && <span> (TX: {payment.txId})</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium">${payment.amount.toFixed(2)}</div>
            <Badge 
              variant={payment.status === "Paid" ? "default" : 
                      payment.status === "Pending" ? "secondary" : "destructive"}
            >
              {payment.status}
            </Badge>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 bg-gray-50 text-sm space-y-3">
          <div>
            <span className="font-medium">Description:</span>
            <p className="text-gray-600 mt-1">{payment.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              View Invoice
            </Button>
            {payment.status === "Pending" && (
              <Button size="sm" className="flex items-center gap-2">
                Pay Now
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentSummary = ({ payments }: { payments: any[] }) => {
  const totals = payments.reduce((acc, payment) => ({
    serviceFees: acc.serviceFees + (payment.type === "Service Fee" ? payment.amount : 0),
    rigOrders: acc.rigOrders + (payment.type === "Rig Order" ? payment.amount : 0),
    total: acc.total + payment.amount
  }), { serviceFees: 0, rigOrders: 0, total: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-500">Total Service Fees</div>
          <div className="text-2xl font-semibold mt-1">${totals.serviceFees.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-500">Total Rig Orders</div>
          <div className="text-2xl font-semibold mt-1">${totals.rigOrders.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-500">Total Payments</div>
          <div className="text-2xl font-semibold mt-1">${totals.total.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const PaymentHistory = () => {
  const [filter, setFilter] = useState({ type: "all", status: "all" });
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  const filteredPayments = mockPayments
    .filter(payment => 
      (filter.type === "all" || payment.type === filter.type) &&
      (filter.status === "all" || payment.status === filter.status)
    )
    .sort((a, b) => {
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (sortConfig.key === "date") {
        return direction * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      return direction * (a[sortConfig.key] - b[sortConfig.key]);
    });

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc"
    }));
  };

  return (
    <div className="space-y-6">
      <PaymentSummary payments={mockPayments} />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View and manage your payment records</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSort('date')}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort by Date
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
              <select 
                className="ml-2 bg-transparent border-none outline-none"
                value={filter.type}
                onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
              >
                <option value="all">All Types</option>
                <option value="Service Fee">Service Fees</option>
                <option value="Rig Order">Rig Orders</option>
              </select>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Status
              <select 
                className="ml-2 bg-transparent border-none outline-none"
                value={filter.status}
                onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="divide-y">
          {filteredPayments.map((payment) => (
            <PaymentHistoryEntry key={payment.id} payment={payment} />
          ))}
          {filteredPayments.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No payments found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PaymentMethods = () => {
  const [savedCards, setSavedCards] = useState([{
    id: 1,
    last4: "5408",
    type: "visa",
    isDefault: true
  }]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isManualPayment, setIsManualPayment] = useState(false);

  const handleAddCard = (cardDetails: any) => {
    setSavedCards([...savedCards, cardDetails]);
    setIsManualPayment(false);
    toast.success("Payment method added successfully");
  };

  const handleRemoveCard = (cardId: number) => {
    setSavedCards(savedCards.filter(card => card.id !== cardId));
    toast.success("Payment method removed");
  };

  const handleSetDefault = (cardId: number) => {
    setSavedCards(savedCards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    setIsManualPayment(false);
    toast.success("Default payment method updated");
  };

  const handleSelectManualPay = () => {
    setIsManualPayment(true);
    toast.success("Manual payment method selected successfully");
  };

  const handleSelectAutoPay = () => {
    if (savedCards.some(card => card.isDefault)) {
      setIsManualPayment(false);
      toast.success("Automatic payment method selected successfully");
    } else {
      toast.error("Please add a card or set a default card first");
    }
  };

  const defaultCard = savedCards.find(card => card.isDefault);

  return (
    <Tabs defaultValue={isManualPayment ? "manual" : "autopay"} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
        <TabsTrigger value="autopay" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Credit Card Payment
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Other Payment Options
        </TabsTrigger>
      </TabsList>

      <TabsContent value="autopay" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Cards</CardTitle>
            <CardDescription>
              Cards will be charged automatically when service fee invoices are due
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedCards.map(card => (
              <PaymentMethodCard 
                key={card.id} 
                card={card} 
                onRemove={() => handleRemoveCard(card.id)} 
                onSetDefault={() => handleSetDefault(card.id)} 
              />
            ))}
            <Button onClick={() => setShowAddCard(true)} variant="outline" className="w-full mt-4">
              Add New Credit Card
            </Button>
            
            {!isManualPayment ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
                <div className="text-sm">
                  {defaultCard ? (
                    <>Credit Card Payment is currently selected. Card ending in {defaultCard.last4} will be charged when service fee invoices are due.</>
                  ) : (
                    <>Credit Card Payment is currently selected. Please set a default card.</>
                  )}
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleSelectAutoPay}
                className="w-full"
              >
                Select Credit Card Payment
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manual" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Other Payment Options</CardTitle>
            <CardDescription>
              Pay service fee invoices manually using your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Receipt className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-lg mb-2">How Manual Payments Work</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">1.</span>
                      When a service fee invoice is due, you'll receive it via email
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">2.</span>
                      Open the Zaprite invoice and choose your preferred payment method:
                      <ul className="ml-6 mt-2 space-y-1 text-gray-500">
                        <li>• Bitcoin (BTC)</li>
                        <li>• Lightning Network</li>
                        <li>• ACH Transfer</li>
                        <li>• Wire Transfer</li>
                      </ul>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">3.</span>
                      Follow the provided instructions to complete your payment
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {isManualPayment ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
                <div className="text-sm">
                  Other Payment Options is currently selected. You'll receive service fee invoice payment instructions via email.
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleSelectManualPay}
                className="w-full"
              >
                Select Other Payment Options
              </Button>
            )}

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                No setup needed - you'll be able to choose your preferred payment method when processing each service fee invoice through Zaprite.
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <AddCardDialog open={showAddCard} onOpenChange={setShowAddCard} onAddCard={handleAddCard} />
    </Tabs>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("methods");

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
          <p className="mt-2 text-gray-600">Manage your service fee payments and view payment history</p>
        </motion.div>

        <Tabs defaultValue="methods" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Options
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Payment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="methods" className="mt-6">
            <PaymentMethods />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <PaymentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
