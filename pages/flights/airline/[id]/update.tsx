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
import airlineService from "@/services/airlineService";
import { withAuthGuard } from "@/hoc/guard";
import { useEffect } from "react";
import { useRouter } from "next/router";

const formSchema = z.object({
    IATA_code: z.string().max(3),
    name: z.string().min(2).max(50),
})

function UpdateForm() {
    const router = useRouter();
    const { id } = router.query;
    const queryClient = useQueryClient();


    const { data, isLoading } = useQuery({
        queryKey: ["airline", id],
        queryFn: () => airlineService.getAirlineById(id as string),
        enabled: !!id,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            IATA_code: "",
            name: "",
        },
    });

    useEffect(() => {
        if (data) {
        form.reset({
            IATA_code: data.IATA_code,
            name: data.name,
        });
        }
    }, [data, form]);

    const mutation = useMutation({
        mutationFn: (updatedData: z.infer<typeof formSchema>) =>
            airlineService.updateAirline(id as string, updatedData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["airline"] });
            router.push("/flights/airline/list");
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <Card className="max-w-2xl w-[96%] mx-auto p-8 rounded-md mt-8">
        <h1 className="text-xl font-bold mb-4">Update Airline</h1>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="IATA_code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">
                Submit
                </Button>
            </form>
            </Form>
        )}
        </Card>
    );
}

export default withAuthGuard(UpdateForm, "Staff");
