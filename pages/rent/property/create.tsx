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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import propertyService from "@/services/propertyService"
import router from "next/router"
import { withAuthGuard } from "@/hoc/guard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().min(2).max(500),
    location: z.string().min(2).max(255),
    price_per_night: z.number().min(1),
    max_guests: z.number().min(1),
    property_type: z.string().min(1),
    images:  z.instanceof(FileList).optional()
})

function PropertyForm() {
    const queryClient = useQueryClient();
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
    })

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'images' && value instanceof FileList) {
                    Array.from(value).forEach(file => {
                        formData.append('images', file);
                    });
                } else {
                    formData.append(key, String(value));
                }
            });

            return propertyService.createProperty(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            router.push("list");
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values)
    }

    return(
        <Card className="max-w-2xl w-[96%] mx-auto p-8 rounded-md mt-8">
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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                                <FormLabel>Property Images</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        onChange={(e) => onChange(e.target.files)}
                                    />
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

export default withAuthGuard(PropertyForm, "Host")