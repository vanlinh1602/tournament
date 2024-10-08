import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Tournament } from '@/features/tournament/type';
import { User } from '@/features/user/types';
import { cn } from '@/lib/utils';
import { translations } from '@/locales/translations';

type Props = {
  onClose: () => void;
  onConfirm: (data: Partial<Tournament>) => void;
  data?: Tournament;
  user: User;
};

const EditTournament = ({ onClose, onConfirm, data, user }: Props) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    name: z.string().min(1),
    date: z.object({
      from: z.date(),
      to: z.date().optional(),
    }),
    organizer: z.string().min(1),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || '',
      date: {
        from: new Date(data?.date.from || Date.now()),
        to: data?.date.to ? new Date(data.date.to) : undefined,
      },
      organizer: data?.organizer.name || '',
      description: data?.description || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tournamentUpdate: Partial<Tournament> = {
      ...data,
      name: values.name,
      date: {
        from: values.date.from.getTime(),
        to: values.date.to?.getTime(),
      },
      organizer: {
        id: user.email,
        name: values.organizer,
      },
      description: values.description,
    };
    if (!tournamentUpdate.status) {
      tournamentUpdate.status = 'set-up';
    }
    onConfirm(tournamentUpdate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {data?.id
              ? t(translations.actions.edit)
              : t(translations.actions.create)}{' '}
            {t(translations.pages.tournament).toLowerCase()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    {t(translations.name)}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t(translations.name)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          id="date"
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, 'd/L/y')} -{' '}
                                {format(field.value.to, 'd/L/y')}
                              </>
                            ) : (
                              format(field.value.from, 'd/L/y')
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        defaultMonth={field.value?.from}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    {t(translations.organizer)}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t(translations.organizer)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    {t(translations.descriptions)}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(translations.descriptions)}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t(translations.actions.submit)}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditTournament;
