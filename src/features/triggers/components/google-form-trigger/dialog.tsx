"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface GoogleFormTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
  onOpenChange,
  open,
}: GoogleFormTriggerDialogProps) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;
  const copyWebhookToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL to clipboard");
    }
  };

  const copyScriptToClipboard = async () => {
    const script = generateGoogleFormScript(webhookUrl);
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Script copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Script to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-svh">
        <DialogHeader>
          <DialogTitle>GoogleForm Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form&apos;s Apps Script to
            trigger this workflow when a form is submitted.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-100 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <InputGroup>
                <InputGroupInput
                  id="webhook-url"
                  value={webhookUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size={"icon-xs"}
                    onClick={copyWebhookToClipboard}
                  >
                    <CopyIcon className="size-4" />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium text-sm">Setup instructions:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open your Google Form</li>
                <li>Click the three dots menu → Script editor</li>
                <li>Copy and past the script below</li>
                <li>Replace WEBHOOK_URL with your webhook URL above</li>
                <li>Save and click &quot;Triggers&quot; → Add Trigger</li>
                <li>Choose: From form → on form submit → Save</li>
              </ol>
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-3">
              <h4 className="font-medium text-sm">Google Apps Script:</h4>
              <Button
                type="button"
                variant="outline"
                onClick={copyScriptToClipboard}
              >
                <CopyIcon className="size-4 mr-2" />
                <span>Copy Google Apps Script</span>
              </Button>
              <p className="text-xs text-muted-foreground ">
                This script includes your webhook URL and handles form
                submissions
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium text-sm">Available Variables</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{googleForm.respondentEmail}}"}
                  </code>
                  — Respondent&apos;s email
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{googleForm.responses['Question Name']}}"}
                  </code>
                  — Specific answer
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{json googleForm.responses}}"}
                  </code>
                  — All responses as JSON
                </li>
              </ul>
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
