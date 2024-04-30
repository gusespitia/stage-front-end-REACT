import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const FormSchema2 = z.object({
  locked: z.boolean().default("false").optional(),
});

const Swithc = () => {
  const [estado, setEstado] = useState(false);
  const formulario = useForm({
    resolver: zodResolver(FormSchema2),
    defaultValues: {
      locked: false,
    },
  });

  const onSubmit2 = (data) => {
    console.log("Form data:", data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  const handleSwitchChange = (newValue) => {
    setEstado(newValue);
    formulario.handleSubmit(onSubmit2)();
  };

  return (
    <div>
      <Form {...formulario}>
        <form onSubmit={formulario.handleSubmit(onSubmit2)}>
          <FormField
            control={formulario.control}
            name="marketing_emails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(newValue) => {
                      field.onChange(newValue);
                      handleSwitchChange(newValue);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <button className="hidden" type="submit" disabled={!estado}>
            Submit
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Swithc;
