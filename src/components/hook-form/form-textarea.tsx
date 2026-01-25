import { Textarea } from "@/components/ui/textarea";

import { FormBase, FormControlFunc } from "./form-base";

export const FormTextarea: FormControlFunc<{ placeholder?: string }> = ({ placeholder, ...props }) => {
  return <FormBase {...props}>{(field) => <Textarea {...field} placeholder={placeholder} />}</FormBase>;
};
