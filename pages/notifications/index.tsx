import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import propertyService from "@/services/propertyService";
import { Card } from "@/components/ui/card";
import { Bell, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Notification {
    id: number;
    content: string;
    read_status: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const queryClient = useQueryClient();
    const { mutate: markAsRead } = useMutation({
        mutationFn: (id: number) => propertyService.markNotificationAsRead(id.toString()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => propertyService.getNotifications(),
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-500">Loading notifications...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto my-12 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Notifications</h1>
                    <p className="text-gray-500 mt-2">Stay updated with your property activities</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-gray-500">
                        {notifications?.length} {notifications?.length === 1 ? 'notification' : 'notifications'} total
                    </div>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="all">All Notifications</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {notifications?.map((notification: Notification) => (
                        <Card 
                            key={notification.id} 
                            className={`p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer ${
                                !notification.read_status ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-primary" />
                                        {!notification.read_status && (
                                            <Badge variant="secondary">New</Badge>
                                        )}
                                    </div>
                                    <p className="text-gray-800">{notification.content}</p>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-sm text-gray-500">
                                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(notification.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="unread" className="space-y-4">
                    {notifications?.filter((n: { read_status: any; }) => !n.read_status).map((notification: Notification) => (
                        <Card 
                            key={notification.id} 
                            className="p-6 hover:shadow-lg transition-shadow duration-200 bg-gray-50"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-primary" />
                                        <Badge variant="secondary">New</Badge>
                                    </div>
                                    <p className="text-gray-800">{notification.content}</p>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-sm text-gray-500">
                                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(notification.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {notifications?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No notifications found</p>
                    <p className="text-gray-400 mt-2">New notifications will appear here</p>
                </div>
            )}
        </div>
    );
} 