'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { createEvent, updateEvent } from '@/app/actions/events'
import { Event } from '@/lib/types'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const SPORT_TYPES = ['Basketball', 'Soccer', 'Tennis', 'Baseball', 'Football', 'Volleyball', 'Hockey']

const eventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100),
  sport_type: z.string().min(1, 'Sport type is required'),
  date_time: z.string().min(1, 'Date and time is required'),
  description: z.string().max(500).optional(),
  venues: z.array(
    z.object({
      name: z.string().min(1, 'Venue name is required').max(100),
      address: z.string().max(200).optional(),
    })
  ).min(1, 'At least one venue is required'),
})

type EventFormValues = z.infer<typeof eventFormSchema>

interface EventFormProps {
  event?: Event
  mode: 'create' | 'edit'
}

export function EventForm({ event, mode }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name || '',
      sport_type: event?.sport_type || '',
      date_time: event?.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '',
      description: event?.description || '',
      venues: event?.venues?.length
        ? event.venues.map(v => ({ name: v.name, address: v.address || '' }))
        : [{ name: '', address: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'venues',
  })

  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true)

    try {
      const formattedData = {
        ...data,
        date_time: new Date(data.date_time).toISOString(),
        venues: data.venues.filter(v => v.name.trim() !== ''),
      }

      let result
      if (mode === 'edit' && event) {
        result = await updateEvent({ ...formattedData, id: event.id })
      } else {
        result = await createEvent(formattedData)
      }

      if (result.success) {
        toast.success('Success', {
          description: `Event ${mode === 'edit' ? 'updated' : 'created'} successfully`,
        })
        router.push('/dashboard')
        router.refresh()
      } else {
        toast.error('Error', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Event Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Summer Basketball Tournament" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sport Type */}
                <FormField
                  control={form.control}
                  name="sport_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SPORT_TYPES.map((sport) => (
                            <SelectItem key={sport} value={sport}>
                              {sport}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date & Time */}
                <FormField
                  control={form.control}
                  name="date_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time *</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add event details, rules, or other information..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Provide additional context about the event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Venues */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Venues *</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: '', address: '' })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Venue
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Venue {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`venues.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Madison Square Garden" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`venues.${index}.address`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 4 Pennsylvania Plaza, New York, NY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting
                      ? mode === 'edit'
                        ? 'Updating...'
                        : 'Creating...'
                      : mode === 'edit'
                      ? 'Update Event'
                      : 'Create Event'}
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}