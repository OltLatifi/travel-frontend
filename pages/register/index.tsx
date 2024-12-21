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
import { useMutation } from "@tanstack/react-query";
import userService from "@/services/userService";
import router from "next/router";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(100),
    confirmPassword: z.string(),
    user_type: z.enum(["Traveler", "Host"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function SignUpForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            user_type: "Traveler",
        },
    });

    const mutation = useMutation({
        mutationFn: userService.signUp,
        onSuccess: () => {
            router.push("/login");
        },
        onError: (error: any) => {
            console.log(error)
            if (error.response?.data?.username[0] === "A user with that username already exists.") {
                form.setError('username', {
                    type: 'manual',
                    message: 'Username already exists'
                });
            }
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { confirmPassword, ...signUpData } = values;
        mutation.mutate(signUpData);
    }

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign up to get started
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="JohnDoe" 
                                            {...field}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="password"
                                            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="password"
                                            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="user_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">User Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                                                <SelectValue placeholder="Select user type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Traveler">Traveler</SelectItem>
                                            <SelectItem value="Host">Host</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full py-2 bg-primary hover:bg-primary/90 transition-colors"
                        >
                            Sign up
                        </Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
} 