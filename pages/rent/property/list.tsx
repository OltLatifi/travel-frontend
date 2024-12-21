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
import { Pencil, Trash2, Plus } from "lucide-react";

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
                <div className="font-medium">${row.original.price_per_night}</div>
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
            header: "Available",
            accessorKey: "available",
            cell: ({ row }: { row: any }) => (
                <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        row.original.available 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                    }`}>
                        {row.original.available ? "Available" : "Unavailable"}
                    </span>
                    {!row.original.available && (
                        <Button 
                            className="ml-2" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => makeAvailableMutation.mutate(row.original.id)}
                        >
                            Make Available
                        </Button>
                    )}
                </div>
            ),
        },
        {
            header: "Action",
            cell: ({ row }: { row: any }) => (
                <div className="flex space-x-3">
                    <Link
                        href={`${row.original.id}/update`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Pencil className="h-4 w-4" />
                    </Link>
                    <Dialog>
                        <DialogTrigger className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Are you absolutely sure?</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    This action cannot be undone. This will permanently delete this property.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2 mt-4">
                                <DialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogTrigger>
                                <Button 
                                    variant="destructive" 
                                    onClick={() => deleteProperty(row?.original?.id)}
                                >
                                    Delete Property
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            ),
        },
    ];

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["properties"],
        queryFn: propertyService.getProperty,
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

    const makeAvailableMutation = useMutation({
        mutationFn: (id: string) => propertyService.makePropertyAvailable(id),
        onSuccess: () => {
            refetch();
        },
    });

    return (
        <div className="max-w-7xl mx-auto p-6 mt-8">
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Property List</h1>
                    <Button asChild variant="default">
                        <Link href="/rent/property/create">
                            <span className="flex items-center">
                                <Plus className="w-5 h-5 mr-2" />
                                Add Property
                            </span>
                        </Link>
                    </Button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                ) : (
                    <DataTable columns={columns} data={data} />
                )}
            </Card>
        </div>
    );
}

export default withAuthGuard(PropertyList, "Host");
