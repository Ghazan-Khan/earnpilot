import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenerateIncomePlan } from "@workspace/api-client-react";
import { type IncomePlan } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  income: z.coerce.number().min(1, "Income must be greater than 0"),
  skill: z.string().min(2, "Skill is required"),
  time: z.enum(["1h", "2h", "3h+"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function InputForm({ 
  onSubmit, 
  onSuccess,
  onError 
}: { 
  onSubmit: () => void;
  onSuccess: (plan: IncomePlan) => void;
  onError: () => void;
}) {
  const mutation = useGenerateIncomePlan();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 0,
      skill: "",
      time: "2h",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit();
    mutation.mutate({ data: values }, {
      onSuccess: (data) => {
        onSuccess(data);
      },
      onError: () => {
        onError();
      }
    });
  };

  return (
    <Card className="max-w-xl mx-auto bg-card border-card-border shadow-2xl relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-base">Current Monthly Income (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                      <Input 
                        placeholder="e.g. 4000" 
                        type="number"
                        className="pl-8 h-12 bg-input border-border text-lg focus-visible:ring-primary focus-visible:border-primary"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-base">Your Most Valuable Skill</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Graphic Design, Copywriting, Coding" 
                      className="h-12 bg-input border-border text-lg focus-visible:ring-primary focus-visible:border-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-base">Available Time Per Day</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-input border-border text-lg focus:ring-primary focus:border-primary">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-popover-border">
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="2h">2 Hours</SelectItem>
                      <SelectItem value="3h+">3+ Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            {mutation.isError && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive-foreground">Failed to generate your plan. Please try again.</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
            >
              Analyze My Income
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
