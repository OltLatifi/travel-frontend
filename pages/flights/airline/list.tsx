import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import airlineService from "@/services/airlineService";
  


function AirlineForm() {

    const columns = [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "IATA Code",
        accessorKey: "IATA_code",
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
                        This action cannot be undone. This will permanently delete this airline.
                    </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => deleteAirline(row?.original?.id)}>Delete</Button>
                </DialogContent>
            </Dialog>
          </div>
        ),
      },
    ];
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["airline"],
        queryFn: airlineService.getAirlines,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    function deleteAirline(id: string) {
        deleteMutation.mutate(id);
    }
    
    const deleteMutation = useMutation({
        mutationFn: (id: string) => airlineService.deleteAirline(id),
        onSuccess: () => {
            refetch();
        },
    });


    return (
        <div className="p-6">
        <Card className="p-4">
            <div className="flex justify-between px-2">
                <h1 className="text-xl font-bold mb-4">Airline List</h1>
                <Link href="/flights/airline/create">Add Airline</Link>
            </div>
            {!isLoading && <DataTable columns={columns} data={data} />}
        </Card>
        </div>
    );
}

export default withAuthGuard(AirlineForm, "Staff");
