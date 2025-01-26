import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import flightService from "@/services/flightService";
import { withAuthGuard } from "@/hoc/guard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
  


function FlightForm() {

    const columns = [
      {
        header: "Airline",
        accessorKey: "airline.name",
      },
      {
        header: "Flight Number",
        accessorKey: "flight_number",
      },
      {
        header: "Departure Airport",
        accessorKey: "departure_airport.name",
      },
      {
        header: "Arrival Airport",
        accessorKey: "arrival_airport.name",
      },
      {
        header: "Departure Time",
        accessorKey: "departure_time",
      },
      {
        header: "Arrival Time",
        accessorKey: "arrival_time",
      },
      {
        header: "Action",
        cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            <Link
              href={`${row.original.id}/update`}
              className="text-blue-500 hover:underline"
            >
              Edit
            </Link>
            <Dialog>
                <DialogTrigger className="text-red-500">Delete</DialogTrigger>
                <DialogContent className="bg-slate-50">
                    <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete this flight.
                    </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => deleteFlight(row?.original?.id)}>Delete</Button>
                </DialogContent>
            </Dialog>
          </div>
        ),
      },
    ];
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["flights"],
        queryFn: () => flightService.getAllFlights(),
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    function deleteFlight(id: string) {
        deleteMutation.mutate(id);
    }
    
    const deleteMutation = useMutation({
        mutationFn: (id: string) => flightService.deleteFlight(id),
        onSuccess: () => {
            refetch();
        },
    });


    return (
        <div  className="max-w-7xl mx-auto p-6 mt-8">
        <Card className="p-4">
            <div className="flex justify-between px-2">
                <h1 className="text-xl font-bold mb-4">Flight List</h1>
                <Link href="/flights/flight/create">Add Flight</Link>
            </div>
            {!isLoading && <DataTable columns={columns} data={data} />}
        </Card>
        </div>
    );
}

export default withAuthGuard(FlightForm, "Staff");
