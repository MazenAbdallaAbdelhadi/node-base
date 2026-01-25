import { Input } from "@/components/ui/input";

import { FormBase, FormControlFunc } from "./form-base";

export const FormInput: FormControlFunc<{
  type?: React.ComponentProps<"input">["type"];
  placeholder?: string;
}> = ({ type = "text", placeholder, ...props }) => {
  return (
    <FormBase {...props}>
      {(field) => <Input type={type} placeholder={placeholder} {...field} />}
    </FormBase>
  );
};
