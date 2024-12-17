import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import airportService from "@/services/airportService";
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
  


function AirportsForm() {

    const columns = [
      {
        header: "Code",
        accessorKey: "code",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "City",
        accessorKey: "city",
      },
      {
        header: "Country",
        accessorKey: "country",
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
                        This action cannot be undone. This will permanently delete this airport.
                    </DialogDescription>
                    </DialogHeader>\
                    <Button onClick={() => deleteAirport(row?.original?.id)}>Delete</Button>
                </DialogContent>
            </Dialog>
          </div>
        ),
      },
    ];
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["airports"],
        queryFn: airportService.getAirports,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    function deleteAirport(id: string) {
        deleteMutation.mutate(id);
    }
    
    const deleteMutation = useMutation({
        mutationFn: (id: string) => airportService.deleteAirport(id),
        onSuccess: () => {
            refetch();
        },
    });


    return (
        <div className="max-w-7xl mx-auto my-8 p-6">
        <Card className="p-4">
            <div className="flex justify-between px-2">
                <h1 className="text-xl font-bold mb-4">Airports List</h1>
                <Link href="/flights/airport/create">Add Airport</Link>
            </div>
            {!isLoading && <DataTable columns={columns} data={data} />}
        </Card>
        </div>
    );
}

export default withAuthGuard(AirportsForm, "Staff");
