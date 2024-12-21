import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { User, Calendar, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import flightService from "@/services/flightService";
import {QRCodeSVG} from 'qrcode.react';

interface Ticket {
  customer_name: string;
  seats: number;
  amount: number;
  completed: boolean;
  created_at: string;
  flight: {
    flight_number: string;
    airline: {
      name: string;
    };
    departure_airport: {
      name: string;
      code: string;
    };
    arrival_airport: {
      name: string;
      code: string;
    };
    departure_time: string;
    arrival_time: string;
    price_per_ticket: number;
  };
}

function FlightTicket() {
    const { data: tickets, isLoading } = useQuery({
        queryKey: ["tickets"],
        queryFn: () => flightService.getTickets(),
    });

    if (tickets?.length === 0) return (
        <div className="max-w-7xl mx-auto my-12 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Flight Tickets</h1>
                <p className="text-gray-500 mt-2">Manage and track your upcoming journeys</p>
                </div>
            </div>
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-gray-500">No tickets found</p>
            </div>
        </div>
    );

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-500">Loading ticket details...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto my-12 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Flight Tickets</h1>
                    <p className="text-gray-500 mt-2">Manage and track your upcoming journeys</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tickets?.map((ticket: Ticket) => (
                    <Card 
                        key={ticket.flight.flight_number} 
                        className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg text-primary">{ticket.flight.flight_number}</h3>
                                        <Badge variant={ticket.completed ? "default" : "secondary"}>
                                            {ticket.completed ? 'Completed' : 'Pending'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">{ticket.flight.airline.name}</p>
                                </div>
                                <p className="font-bold text-2xl text-primary">${ticket.amount/100}</p>
                            </div>

                            <div className="flex gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span className="font-medium">{ticket.customer_name}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">Seats: {ticket.seats}</p>
                                    </div>

                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(ticket.flight.departure_time).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="w-32">
                                    <QRCodeSVG 
                                        value={`${ticket.flight.flight_number}-${ticket.customer_name}-${ticket.seats}-${ticket.amount/100}`}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default FlightTicket;