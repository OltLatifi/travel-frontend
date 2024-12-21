import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import flightService from "@/services/flightService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    seats: z.coerce.number().min(1, "Must book at least 1 seat"),
    customerName: z.string().min(2, "Name must be at least 2 characters"),
});

import { stripePromise } from "@/config/stripe";
import useUserStore from "@/stores/userStore";
import { useEffect } from "react";

function CheckoutForm({ flightId, seats, customerName, amount }: {
    flightId: number;
    seats: number;
    customerName: string;
    amount: number;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!stripe || !elements) throw new Error('Stripe not initialized');
            
            const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement)!,
                billing_details: {
                    name: customerName,
                },
            });

            if (paymentMethodError) {
                throw new Error(paymentMethodError.message);
            }

            const intent = await flightService.createBooking(
                flightId, 
                seats, 
                amount, 
                customerName,
                paymentMethod.id
            );
        },
        onError: (error) => {
            console.error('Payment failed:', error);
            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: error instanceof Error ? error.message : "Something went wrong with your payment",
            });
        },
        onSuccess: () => {
            toast({
                title: "Payment Successful",
                description: "Your booking has been confirmed!",
            });
            router.push("/")
        },
    });

    return (
        <div className="space-y-4">
            <CardElement className="p-3 border rounded-md" />
            <Button 
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="w-full py-6 text-lg bg-[#5469d4] hover:bg-[#4456b9]"
            >
                {mutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                ) : (
                    "Pay Now"
                )}
            </Button>
        </div>
    );
}

export default function FlightBooking() {
    const router = useRouter();
    const userStore = useUserStore();
    const { id } = router.query;

    useEffect(() => {
        if (!userStore.isLoggedIn) {
            router.push("/login");
        }
    }, [userStore.isLoggedIn, router]);

    const {
        data: flight,
        isLoading,
        error
    } = useQuery({
        queryKey: ["flight", id],
        queryFn: () => flightService.getFlightById(id as string),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            seats: 1,
            customerName: "",
        },
    });

    const seats = form.watch("seats");
    let totalPrice = flight?.price_per_ticket ? 
        isNaN(seats) ? 0 : flight.price_per_ticket * seats 
        : 0;

    totalPrice = totalPrice/100;

    function onSubmit(values: z.infer<typeof formSchema>) {
        // The form submission is now handled by the CheckoutForm component
    }

    if (isLoading) return <p>Loading flight...</p>;
    if (error) return <p>Error loading flight</p>;
    if (!flight) return <p>No flight found</p>;

    return (
        <Elements stripe={stripePromise}>
            <div className="w-[96%] max-w-7xl mx-auto p-6 mt-8">
                <Card className="p-8 shadow-lg">
                    <div className="space-y-6">
                        {/* Flight Header */}
                        <div className="border-b pb-6">
                            <h1 className="text-3xl font-bold mb-2">
                                Flight {flight.flight_number}
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {flight.airline.name}
                            </p>
                        </div>

                        {/* Flight Details */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            {/* Left Column - Flight Info */}
                            <div className="flex-1 space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Flight Details</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <span className="text-gray-600">From:</span>
                                            <span className="font-bold">
                                                {flight.departure_airport.city} ({flight.departure_airport.code})
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-gray-600">To:</span>
                                            <span className="font-bold">
                                                {flight.arrival_airport.city} ({flight.arrival_airport.code})
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-gray-600">Departure:</span>
                                            <span className="font-bold">
                                                {new Date(flight.departure_time).toLocaleString()}
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-gray-600">Price per seat:</span>
                                            <span className="font-bold text-lg">
                                                ${flight.price_per_ticket/100}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column - Booking Form */}
                            <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <h3 className="text-xl font-semibold mb-4">Book Your Flight</h3>
                                        
                                        <FormField
                                            control={form.control}
                                            name="customerName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">Your Name</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            className="text-lg"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="seats"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">
                                                        Number of Seats
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number"
                                                            min="1"
                                                            className="text-lg"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? 0 : e.target.valueAsNumber;
                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="bg-white p-4 rounded-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Price per seat</span>
                                                <span>${flight.price_per_ticket/100}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Seats</span>
                                                <span>{seats || 0}</span>
                                            </div>
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold">Total Price</span>
                                                    <span className="text-xl font-bold">${totalPrice}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Add CheckoutForm after the price summary */}
                                        <CheckoutForm 
                                            flightId={parseInt(id as string)}
                                            seats={seats}
                                            customerName={form.getValues("customerName")}
                                            amount={totalPrice}
                                        />
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Elements>
    );
}
    
