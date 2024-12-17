import { useQuery } from "@tanstack/react-query";
import propertyService from "@/services/propertyService";
import { Card } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PaymentsHistory() {
    const { data: payments, isLoading } = useQuery({
        queryKey: ["payments"],
        queryFn: () => propertyService.getPayments(),
    });


    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-500">Loading payments...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto my-12 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Payment History</h1>
                    <p className="text-gray-500 mt-2">Track your property earnings and bookings</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-gray-500">
                        {payments?.length} {payments?.length === 1 ? 'payment' : 'payments'} total
                    </div>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="all">All Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {payments?.map((payment: any) => (
                        <Card key={payment.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg text-primary">{payment.property.name}</h3>
                                        <Badge variant="outline">{payment.status || 'Completed'}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {payment.customer_name}
                                        </p>
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {payment.nights} {payment.nights === 1 ? 'night' : 'nights'}
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            <p className="flex items-center gap-1">
                                                <span>📍</span> {payment.property.location}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <span>🏠</span> {payment.property.property_type}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="font-bold text-2xl text-primary">{payment.amount / 100}$</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(payment.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(payment.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>

                {/* Add other TabsContent components for 'recent' and 'monthly' views */}
            </Tabs>

            {payments?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No payments found</p>
                    <p className="text-gray-400 mt-2">Payments will appear here once you receive them</p>
                </div>
            )}
        </div>
    );
} 