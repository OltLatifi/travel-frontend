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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propertyService from "@/services/propertyService";
import { withAuthGuard } from "@/hoc/guard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().min(2).max(500),
    location: z.string().min(2).max(255),
    price_per_night: z.number().min(1),
    max_guests: z.number().min(1),
    property_type: z.string().min(1),
});

function UpdateForm() {
    const router = useRouter();
    const { id } = router.query;
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["property", id],
        queryFn: () => propertyService.getPropertyById(id as string),
        enabled: !!id,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            price_per_night: 0,
            max_guests: 1,
            property_type: "",
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                description: data.description,
                location: data.location,
                price_per_night: data.price_per_night,
                max_guests: data.max_guests,
                property_type: data.property_type,
            });
        }
    }, [data, form]);

    const mutation = useMutation({
        mutationFn: (updatedData: z.infer<typeof formSchema>) =>
            propertyService.updateProperty(id as string, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            router.push("/rent/property/list");
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <Card className="max-w-2xl w-[96%] mx-auto p-8 rounded-md mt-8">
            <h1 className="text-xl font-bold mb-4">Update Property</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price_per_night"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price per Night</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="max_guests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maximum Guests</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="property_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a property type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Apartment">Apartment</SelectItem>
                                                <SelectItem value="House">House</SelectItem>
                                                <SelectItem value="Hotel">Hotel</SelectItem>
                                                <SelectItem value="Hostel">Hostel</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default withAuthGuard(UpdateForm, "Host");
