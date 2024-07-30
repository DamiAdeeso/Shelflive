import { FormControl, InputLabel, Select } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

function SelectForm({
  name,
  label,
  control,
  defaultValue,
  children,
  rules,
  optional,
}) {
  const labelId = `${name}-label`;
  return (
    <FormControl size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        render={({ field }) => {
          return (
            <Select
              labelId={labelId}
              label={label}
              value={field.value}
              onChange={(e) => {
                const data = e.target.value;
                field.onChange(data);
              }}
            >
              {children}
            </Select>
          );
        }}
        name={name}
        defaultValue={defaultValue}
        control={control}
        rules={{
          required: optional ? false : true,
          ...rules,
        }}
      />
    </FormControl>
  );
}

export default SelectForm;
