import { ModeToggle } from "@/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ThemeSettingsPage() {
  return (
    <div>
      <Card className="mx-auto max-w-md  bg-background border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>Theme Config</CardTitle>
          <CardDescription>Choose your prefered theme</CardDescription>
        </CardHeader>
        <CardContent>
          <ModeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
