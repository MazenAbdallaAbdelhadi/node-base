"use client";
import { useEffect } from "react";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { FormInput, FormSelect, FormTextarea } from "@/components/hook-form";

import { CredentialType } from "@/generated/prisma/enums";

import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";

export const AVAILABLE_MODELS = [
  "gpt-4.1-mini",
  "gpt-4.1",
  "gpt-4o",
  "gpt-5-mini",
  "gpt-5-chat-latest",
  "gpt-5.1",
  "gpt-5-pro",
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-za-z0-9*$]/, {
      error:
        "Varibale name must start with a letter or underScore and contain letters, numbers, and underscores",
    }),
  model: z.enum(AVAILABLE_MODELS),
  credentialId: z.string().min(1, "Credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { error: "User prompt is required" }),
});
export type IOpenAiFormSchema = z.infer<typeof formSchema>;

interface OpenAiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: IOpenAiFormSchema) => void;
  defaultValues?: Partial<IOpenAiFormSchema>;
}

export const OpenAiDialog = ({
  onOpenChange,
  open,
  onSubmit,
  defaultValues = {},
}: OpenAiDialogProps) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.OPENAI);

  const form = useForm<IOpenAiFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialId: defaultValues.credentialId || "",
      variableName: defaultValues.variableName || "",
      model: defaultValues.model || AVAILABLE_MODELS[0],
      userPrompt: defaultValues.userPrompt || "",
      systemPrompt: defaultValues.systemPrompt,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        credentialId: defaultValues.credentialId || "",
        variableName: defaultValues.variableName || "",
        model: defaultValues.model || AVAILABLE_MODELS[0],
        userPrompt: defaultValues.userPrompt || "",
        systemPrompt: defaultValues.systemPrompt,
      });
    }
  }, [defaultValues, form, open]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchVariableName = form.watch("variableName");

  const handleSubmit = (values: IOpenAiFormSchema) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-svh">
        <DialogHeader>
          <DialogTitle>OpenAI Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col w-full"
        >
          <ScrollArea className="max-h-100 p-4">
            <FieldGroup>
              <FormInput
                control={form.control}
                name="variableName"
                label="Variable Name"
                placeholder="myApiCall"
                description={`Use this name to reference the result in other nodes: {{${watchVariableName || "myApiCall"}.aiResponse}}`}
              />

              <FormSelect
                control={form.control}
                name="model"
                label="Model"
                placeholder="Select a model"
                description="The Open AI model to use for completion"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                control={form.control}
                name="credentialId"
                label="Open AI Credential"
                placeholder="Select a Credential"
                disabled={isLoadingCredentials || !credentials?.length}
              >
                {credentials?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={"/openai.svg"}
                        alt={"OpenAI"}
                        width={16}
                        height={16}
                      />
                      <span>{option.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </FormSelect>

              <FormTextarea
                control={form.control}
                name="systemPrompt"
                label="System Prompt (Optional)"
                placeholder={`You are a helpful assustant.`}
                description={`Sets the behavior of the assistant. Use "{{variables}}" for simple value or {{json variable}} to stringify objects`}
                className="max-h-20 font-mono text-sm"
              />

              <FormTextarea
                control={form.control}
                name="userPrompt"
                label="User Prompt"
                placeholder={`Sunnarize this text: {{json httpResponse.data}}`}
                description={`The prompt to send to the AI. Use {{variables}} for simple values or {{json variable}} to stringify objects`}
                className="max-h-30 font-mono text-sm"
              />
            </FieldGroup>
            <ScrollBar />
          </ScrollArea>

          <DialogFooter className="pe-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
