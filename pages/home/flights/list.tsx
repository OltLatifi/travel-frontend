import flightService from "@/services/flightService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Airport {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
}

interface Airline {
  id: number;
  name: string;
  IATA_code: string;
}

interface Flight {
  id: number;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  price_per_ticket: number;
  departure_airport: Airport;
  arrival_airport: Airport;
  airline: Airline;
  created_at: string;
  updated_at: string;
}

function FlightList() {
    const { data, isLoading } = useQuery({
        queryKey: ["flights"],
        queryFn: flightService.getAllFlights,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    const groupedFlights = data?.reduce((groups: Record<string, Flight[]>, flight: Flight) => {
        const date = new Date(flight.departure_time);
        const today = new Date();
        const diffTime = date.getTime() - today.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let dateLabel = '';
        if (diffDays === 0) dateLabel = 'Today';
        else if (diffDays === 1) dateLabel = 'Tomorrow';
        else if (diffDays === 2) dateLabel = 'Day after tomorrow';
        else dateLabel = date.toLocaleDateString();

        if (!groups[dateLabel]) {
            groups[dateLabel] = [];
        }
        groups[dateLabel].push(flight);
        return groups;
    }, {});


    console.log(groupedFlights);

    return ( 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Upcoming Flights</h1>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    Object.entries(groupedFlights || {}).map(([date, flights]) => (
                        <div key={date} className="mt-12 mb-8 bg-gray-50 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-700 p-3 rounded-lg">{date}</h2>
                            <hr />
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
                                {Array.isArray(flights) && flights.map((flight: Flight) => (
                                    <Link href={`/home/flights/${flight.id}`} key={flight.id} >
                                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-semibold text-blue-600">{flight.flight_number}</span>
                                            <span className="text-sm font-medium text-gray-500">{flight.airline.name}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="text-center">
                                                <p className="text-xl font-bold">{flight.departure_airport.code}</p>
                                                <p className="text-sm text-gray-600">{flight.departure_airport.city}</p>
                                                <p className="text-sm font-medium">
                                                    {new Date(flight.departure_time).toLocaleTimeString([], { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <div className="w-24 h-px bg-gray-300 mb-2"></div>
                                                <span className="text-sm text-gray-500">
                                                    {Math.floor(flight.duration_minutes / 60)}h {flight.duration_minutes % 60}m
                                                </span>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-xl font-bold">{flight.arrival_airport.code}</p>
                                                <p className="text-sm text-gray-600">{flight.arrival_airport.city}</p>
                                                <p className="text-sm font-medium">
                                                    {new Date(flight.arrival_time).toLocaleTimeString([], { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <span className="text-lg font-bold text-green-600">
                                                ${(flight.price_per_ticket/100).toFixed(2)}
                                            </span>
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

    );
}

export default FlightList;