import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import flightsService from "@/services/flightService"
import router from "next/router"
import { withAuthGuard } from "@/hoc/guard"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import airportService from "@/services/airportService"
import airlineService from "@/services/airlineService"

const formSchema = z.object({
    airline: z.string(),
    flight_number: z.string().min(1).max(10),
    departure_airport: z.string(),
    arrival_airport: z.string(),
    departure_time: z.string().min(1),
    arrival_time: z.string().min(1),
    duration_minutes: z.number().min(0),
    price_per_ticket: z.number().min(0),
})

function AirportForm() {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            airline: "",
            flight_number: "",
            departure_airport: "",
            arrival_airport: "",
            departure_time: "",
            arrival_time: "",
            duration_minutes: 0,
            price_per_ticket: 0,
        },
    })

    const mutation = useMutation({
        mutationFn: flightsService.createFlight,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["flights"] });
            router.push("list")
        },
    })

    const { data: airports, isLoading: airportsLoading } = useQuery({
        queryKey: ["airports"],
        queryFn: airportService.getAirports,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    const { data: airlines, isLoading: airlinesLoading } = useQuery({
        queryKey: ["airline"],
        queryFn: airlineService.getAirlines,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values)
    }

    return(
        <Card className="max-w-2xl w-[96%] mx-auto p-8 rounded-md mt-8">
            <h1 className="text-xl font-bold mb-4">Add Flight</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="airline"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Airline</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Airline" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {airlinesLoading ? (
                                        <SelectItem value="loading">Loading...</SelectItem>
                                    ) : (
                                        airlines?.map((airline: { id: string, name: string }) => (
                                            <SelectItem key={airline.id} value={airline.id.toString()}>
                                                {airline.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="flight_number"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Flight Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Flight Number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <FormField
                        control={form.control}
                        name="departure_airport"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Departure Airport</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Departure Airport" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {airportsLoading ? (
                                            <SelectItem value="None">Loading...</SelectItem>
                                        ) : (
                                            airports?.map((airport: { id: string, name: string }) => (
                                                <SelectItem key={airport.id} value={airport.id.toString()}>
                                                    {airport.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="arrival_airport"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Arrival Airport</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Arrival Airport" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {airportsLoading ? (
                                            <SelectItem value="None">Loading...</SelectItem>
                                        ) : (
                                            airports?.map((airport: { id: string, name: string }) => (
                                                <SelectItem key={airport.id} value={airport.id.toString()}>
                                                    {airport.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <FormField
                        control={form.control}
                        name="departure_time"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Departure Time</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="arrival_time"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Arrival Time</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration (Minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="price_per_ticket"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price per Ticket</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </Card>
    )
}

export default withAuthGuard(AirportForm, "Staff")