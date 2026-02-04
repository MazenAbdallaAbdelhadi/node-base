"use client";
import { useEffect } from "react";
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
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { FormInput, FormSelect, FormTextarea } from "@/components/hook-form";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-za-z0-9*$]/, {
      error:
        "Varibale name must start with a letter or underScore and contain letters, numbers, and underscores",
    }),
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
  defaultValues?: Partial<IHttpRequestFormSchema>;
}

export const HttpRequestDialog = ({
  onOpenChange,
  open,
  onSubmit,
  defaultValues = {},
}: HttpRequestDialogProps) => {
  const form = useForm<IHttpRequestFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint,
      method: defaultValues.method || "GET",
      body: defaultValues.body,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultValues.endpoint,
        method: defaultValues.method,
        body: defaultValues.body,
        variableName: defaultValues.variableName,
      });
    }
  }, [defaultValues, form, open]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchVariableName = form.watch("variableName");

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
            <FormInput
              control={form.control}
              name="variableName"
              label="Variable Name"
              placeholder="myApiCall"
              description={`Use this name to reference the result in other nodes: {{${watchVariableName || "myApiCall"}.httpResponse.data}}`}
            />

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
                placeholder={`{ \n\t"userId": "{{httpResponse.data.id}}",\n\t"name": "{{httpResponse.data.name}}"\n}`}
                description={`JSON with template variable. Use {{"variables"}} for simple values or {{json variable}} to stringify objects`}
                className="max-h-25"
              />
            )}

            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};
