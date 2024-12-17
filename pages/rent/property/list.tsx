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
import propertyService from "@/services/propertyService";

function PropertyList() {
    const columns = [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Location",
            accessorKey: "location",
        },
        {
            header: "Price/Night",
            accessorKey: "price_per_night",
            cell: ({ row }: { row: any }) => (
                <div>${row.original.price_per_night}</div>
            ),
        },
        {
            header: "Max Guests",
            accessorKey: "max_guests",
        },
        {
            header: "Property Type",
            accessorKey: "property_type",
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
                                    This action cannot be undone. This will permanently delete this property.
                                </DialogDescription>
                            </DialogHeader>
                            <Button onClick={() => deleteProperty(row?.original?.id)}>Delete</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            ),
        },
    ];

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["properties"],
        queryFn: propertyService.getProperty,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    function deleteProperty(id: string) {
        deleteMutation.mutate(id);
    }
    
    const deleteMutation = useMutation({
        mutationFn: (id: string) => propertyService.deleteProperty(id),
        onSuccess: () => {
            refetch();
        },
    });

    return (
        <div className="max-w-7xl mx-auto p-6 mt-8">
            <Card className="p-4">
                <div className="flex justify-between px-2">
                    <h1 className="text-xl font-bold mb-4">Property List</h1>
                    <Link href="/rent/property/create">Add Property</Link>
                </div>
                {!isLoading && <DataTable columns={columns} data={data} />}
            </Card>
        </div>
    );
}

export default withAuthGuard(PropertyList, "Host");
