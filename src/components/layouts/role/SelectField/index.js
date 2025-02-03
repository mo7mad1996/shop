import * as Select from "@/components/ui/native-select";
import { Field } from "@/components/ui/field";

export default function SelectField(props) {
  if (!props.items || !props.items.length)
    return (
      <div>
        Please append the <q>items</q> list
      </div>
    );

  return (
    <Field
      className="my-3"
      required={props.required || false}
      label={props.label}
    >
      <Select.NativeSelectRoot
        className="border border-[#e5e7eb] rounded px-1 bg-white"
        {...props}
        {...props.register}
      >
        <Select.NativeSelectField
          {...props.register}
          defaultValue={props.defaultValue ? props.defaultValue : undefined}
        >
          {props.items.map((item, n) => (
            <option value={item.value || ""} key={n}>
              {item.label}
            </option>
          ))}
        </Select.NativeSelectField>
      </Select.NativeSelectRoot>
    </Field>
  );
}
