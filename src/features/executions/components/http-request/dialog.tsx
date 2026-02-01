"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { FormInput, FormSelect, FormTextarea } from "@/components/hook-form";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const formSchema = z.object({
  endpoint: z.url({ error: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
  // .refine() TODO:
});
export type IHttpRequestFormSchema = z.infer<typeof formSchema>;

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: IHttpRequestFormSchema) => void;
  defaultEndpoint?: string;
  defualtMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  defualtBody?: string;
}

export const HttpRequestDialog = ({
  onOpenChange,
  open,
  onSubmit,
  defaultEndpoint = "",
  defualtMethod = "GET",
  defualtBody = "",
}: HttpRequestDialogProps) => {
  const form = useForm<IHttpRequestFormSchema>({
    resolver: zodResolver(formSchema), 
    defaultValues: {
      endpoint: defaultEndpoint,
      method: defualtMethod,
      body: defualtBody,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultEndpoint,
        method: defualtMethod,
        body: defualtBody,
      });
    }
  }, [defaultEndpoint, defualtBody, defualtMethod, form, open]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: IHttpRequestFormSchema) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP Request node.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FormSelect
              control={form.control}
              name="method"
              label="Method"
              placeholder="HTTP Method"
              description="The HTTP method to use for this request"
            >
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </FormSelect>

            <FormInput
              control={form.control}
              name="endpoint"
              label="Endpoint URL"
              placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
              description={`Static url or use {{"variables"}} for simple values or {{json variable}} to stringify objects`}
            />

            {showBodyField && (
              <FormTextarea
                control={form.control}
                name="body"
                label="Body"
                placeholder={`{ \n\t"userId": "{{httpResponse.data.id}}",\n\t"name": "{{httpResponse.data.name}}",\n\t"items": "{{httpResponse.data.items}}",\n}`}
                description={`JSON with template variable. Use {{"variables"}} for simple values or {{json variable}} to stringify objects`}
              />
            )}
          </FieldGroup>

          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
