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
import airlineService from "@/services/airlineService"
import router from "next/router"
import { withAuthGuard } from "@/hoc/guard"

const formSchema = z.object({
    IATA_code: z.string().max(3),
    name: z.string().min(2).max(50),
})

function AirlineForm() {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            IATA_code: "",
            name: "",
        },
    })

    const mutation = useMutation({
        mutationFn: airlineService.createAirline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["airline"] });
            router.push("list")
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
                    name="IATA_code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>IATA Code</FormLabel>
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
                            <Input  {...field} />
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

export default withAuthGuard(AirlineForm, "Staff")