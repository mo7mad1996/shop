import * as Select from "@/components/ui/select";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Field } from "@/components/ui/field";
import { createListCollection } from "@chakra-ui/react";

export default function SelectField(props) {
  if (!props.items || !props.items.length)
    return (
      <div>
        Please append the <q>items</q> list
      </div>
    );

  const collection = createListCollection({ items: props.items });

  return (
    <Field
      className="my-3"
      required={props.required || false}
      label={props.label}
    >
      <Select.SelectRoot
        collection={collection}
        // defaultValue={props.items[0].value}
        input={<OutlinedInput />}
        unstyled={false}
        // {...props}
        // {...props.register}
      >
        <Select.SelectTrigger>
          <Select.SelectValueText placeholder="Select movie" />
        </Select.SelectTrigger>

        <Select.SelectContent>
          {props.items.map((item, n) => (
            <Select.SelectItem item={item.value || ""} key={n}>
              {item.label}
            </Select.SelectItem>
          ))}
        </Select.SelectContent>
      </Select.SelectRoot>
    </Field>
  );
}

/* 
"use client";

import { Button, Stack, createListCollection } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";

export default function SelectField() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start">
        <Field
          label="Rating"
          invalid={!!errors.framework}
          errorText={errors.framework?.message}
          width="320px"
        >
          <Controller
            control={control}
            name="framework"
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={frameworks}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select movie" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.items.map((movie) => (
                    <SelectItem item={movie} key={movie.value}>
                      {movie.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>

        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

const frameworks = createListCollection({
  items: [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
});
*/
