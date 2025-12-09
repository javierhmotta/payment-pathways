import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, AlertCircle, Receipt, Check, Clock, FileText, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { AddCardDialog } from "@/components/AddCardDialog";
import { PaymentMethodSelector, PaymentMethodType } from "@/components/PaymentMethodSelector";
import { toast } from "sonner";

// Mock data for payment history
const mockPayments = [{
  id: 1,
  date: "2024-03-15",
  amount: 299.99,
  method: "Credit Card",
  type: "Service Fee",
  status: "Paid",
  last4: "5408",
  description: "Monthly hosting service fee - March 2024"
}, {
  id: 2,
  date: "2024-03-01",
  amount: 1499.99,
  method: "Bitcoin",
  type: "Rig Order",
  status: "Pending",
  txId: "1A1zP1...",
  description: "Mining rig purchase - 1x S19 Pro"
}, {
  id: 3,
  date: "2024-02-15",
  amount: 299.99,
  method: "Wire Transfer",
  type: "Service Fee",
  status: "Paid",
  description: "Monthly hosting service fee - February 2024"
}];
const PaymentHistoryEntry = ({
  payment
}: {
  payment: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return <div className="border-b last:border-0">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            {payment.method === "Credit Card" ? <CreditCard className="w-5 h-5 text-gray-600" /> : payment.method === "Bitcoin" ? <Wallet className="w-5 h-5 text-gray-600" /> : <FileText className="w-5 h-5 text-gray-600" />}
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
            <Badge variant={payment.status === "Paid" ? "default" : payment.status === "Pending" ? "secondary" : "destructive"}>
              {payment.status}
            </Badge>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
        </div>
      </div>
      {isExpanded && <div className="p-4 bg-gray-50 text-sm space-y-3">
          <div>
            <span className="font-medium">Description:</span>
            <p className="text-gray-600 mt-1">{payment.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              View Invoice
            </Button>
            {payment.status === "Pending" && <Button size="sm" className="flex items-center gap-2">
                Pay Now
              </Button>}
          </div>
        </div>}
    </div>;
};
const PaymentSummary = ({
  payments
}: {
  payments: any[];
}) => {
  const totals = payments.reduce((acc, payment) => ({
    serviceFees: acc.serviceFees + (payment.type === "Service Fee" ? payment.amount : 0),
    rigOrders: acc.rigOrders + (payment.type === "Rig Order" ? payment.amount : 0),
    total: acc.total + payment.amount
  }), {
    serviceFees: 0,
    rigOrders: 0,
    total: 0
  });
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
    </div>;
};
const PaymentHistory = () => {
  const [filter, setFilter] = useState({
    type: "all",
    status: "all"
  });
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc"
  });
  const filteredPayments = mockPayments.filter(payment => (filter.type === "all" || payment.type === filter.type) && (filter.status === "all" || payment.status === filter.status)).sort((a, b) => {
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
  return <div className="space-y-6">
      <PaymentSummary payments={mockPayments} />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View and manage your payment records</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSort('date')} className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Sort by Date
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
              <select className="ml-2 bg-transparent border-none outline-none" value={filter.type} onChange={e => setFilter(f => ({
              ...f,
              type: e.target.value
            }))}>
                <option value="all">All Types</option>
                <option value="Service Fee">Service Fees</option>
                <option value="Rig Order">Rig Orders</option>
              </select>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Status
              <select className="ml-2 bg-transparent border-none outline-none" value={filter.status} onChange={e => setFilter(f => ({
              ...f,
              status: e.target.value
            }))}>
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="divide-y">
          {filteredPayments.map(payment => <PaymentHistoryEntry key={payment.id} payment={payment} />)}
          {filteredPayments.length === 0 && <div className="py-8 text-center text-gray-500">
              No payments found matching your filters
            </div>}
        </CardContent>
      </Card>
    </div>;
};
const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>("credit_card");
  const [savedCards, setSavedCards] = useState([{
    id: 1,
    last4: "5408",
    type: "visa",
    isDefault: true
  }]);
  const [showAddCard, setShowAddCard] = useState(false);
  const handleMethodChange = (method: PaymentMethodType) => {
    setSelectedMethod(method);
    toast.success(`Payment method updated to ${method.replace(/_/g, ' ')}`);
  };
  const handleAddCard = (cardDetails: any) => {
    setSavedCards([...savedCards, cardDetails]);
    toast.success("Card added successfully");
  };
  const handleRemoveCard = (cardId: number) => {
    setSavedCards(savedCards.filter(card => card.id !== cardId));
    toast.success("Card removed");
  };
  const handleSetDefault = (cardId: number) => {
    setSavedCards(savedCards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
    toast.success("Default card updated");
  };
  return (
    <div className="space-y-6">
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={handleMethodChange}
        savedCards={savedCards}
        onAddCard={() => setShowAddCard(true)}
        onRemoveCard={handleRemoveCard}
        onSetDefaultCard={handleSetDefault}
      />
      <AddCardDialog open={showAddCard} onOpenChange={setShowAddCard} onAddCard={handleAddCard} />
    </div>
  );
};
const Index = () => {
  const [activeTab, setActiveTab] = useState("methods");
  return <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
          
        </motion.div>

        <Tabs defaultValue="methods" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
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
    </div>;
};
export default Index;