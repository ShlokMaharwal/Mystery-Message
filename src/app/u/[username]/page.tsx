'use client';

import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';

export default function SendMessagePage() {
  const params = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  // Check if user is accepting messages
  useEffect(() => {
    const checkAcceptingMessages = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/is-accepting-messages/${params.username}`
        );
        setIsAcceptingMessages(response.data.isAcceptingMessages ?? false);
      } catch (error) {
        console.error('Error checking message status:', error);
        setIsAcceptingMessages(false);
      } finally {
        setIsFetchingStatus(false);
      }
    };

    checkAcceptingMessages();
  }, [params.username]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: params.username,
        content: data.content,
      });

      toast.success(response.data.message);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to send message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Send Message to {params.username}</CardTitle>
          <CardDescription>
            Share your thoughts anonymously
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingStatus ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isAcceptingMessages ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <textarea
                        {...field}
                        placeholder="Write your message here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                This user is not accepting messages at the moment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
