
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface PaymentMethodCardProps {
  card: {
    last4: string;
    type: string;
    isDefault: boolean;
  };
  onRemove: () => void;
  onSetDefault: () => void;
}

export function PaymentMethodCard({
  card,
  onRemove,
  onSetDefault,
}: PaymentMethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 border-2 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {card.type.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">
                {card.type.charAt(0).toUpperCase() + card.type.slice(1)} ****
                {card.last4}
              </p>
              {card.isDefault && (
                <Badge variant="secondary" className="mt-1">
                  Default
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!card.isDefault && (
                <DropdownMenuItem onClick={onSetDefault}>
                  Set as default
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onRemove} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}
