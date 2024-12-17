import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import propertyService from "@/services/propertyService";
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
}

interface PropertyResponse {
  results: Property[];
  nextPage: number | null;
}

export default function Home() {
    const loadMoreRef = useRef(null);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<PropertyResponse>({
        queryKey: ["all-properties"],
        queryFn: async ({ pageParam = 1 }) => {
            return propertyService.getAllProperty(pageParam as number);
        },
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1, 
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreRef, hasNextPage, fetchNextPage]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Find Your Perfect Stay
                </h1>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-pulse text-gray-600">Loading properties...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.pages?.map((page, pageIndex) =>
                            page.results.map((property, propertyIndex) => (
                                <Link
                                    href={`/home/property/${property.id}`}
                                    key={`${pageIndex}-${propertyIndex}`}
                                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            {property.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {property.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-primary-600 font-bold text-lg">
                                                ${property.price_per_night}
                                                <span className="text-sm text-gray-500 font-normal"> /night</span>
                                            </p>
                                            <span className="text-sm text-primary-600 hover:text-primary-700">
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
                <div ref={loadMoreRef} className="h-10 mt-8" />
            </div>
        </div>
    );
}
    
