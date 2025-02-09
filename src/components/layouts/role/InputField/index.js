import { Input } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import * as NumberInput from "@/components/ui/number-input";

const InputField = (props) => {
  if (props.type == "password")
    return (
      <Field
        className="my-3"
        required={props.required || false}
        label={props.label}
      >
        <PasswordInput
          placeholder={props.placeholder}
          className="border border-[#e5e7eb] rounded px-1"
          {...props}
          {...props.register}
        />
      </Field>
    );
  if (props.type == "number")
    return (
      <Field
        className="my-3"
        required={props.required || false}
        label={props.label}
      >
        <NumberInput.NumberInputRoot
          defaultValue="0"
          placeholder={props.placeholder}
          className="border border-[#e5e7eb] rounded px-1 w-full"
          {...props}
          {...props.register}
        >
          <NumberInput.NumberInputField />
        </NumberInput.NumberInputRoot>
      </Field>
    );

  return (
    <Field
      className="my-3"
      required={props.required || false}
      label={props.label}
    >
      <Input
        placeholder={props.placeholder}
        className="border border-[#e5e7eb] rounded px-1"
        {...props}
        {...props.register}
        onBlur={(e) => {
          if (typeof props.onBlur === "function") {
            props.onBlur(e);
          }
        }}
      />
    </Field>
  );
};
export default InputField;
