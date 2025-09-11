import {
    Select as MuiSelect,
    type SelectProps,
    FormControl,
    InputLabel,
    FormHelperText,
    type SelectChangeEvent,
} from "@mui/material";
import { Field, type FieldInputProps, type FieldMetaProps } from "formik";
import { type ReactNode } from "react";

interface FormikSelectProps extends Omit<SelectProps, "name" | "value" | "onChange" | "onBlur" | "children"> {
    name: string;
    label: string;
    children: ReactNode;
}

interface FieldHelperProps {
    field: FieldInputProps<any>;
    form: {
        setFieldValue: (name: string, value: any) => void;
        setFieldTouched: (name: string, isTouched?: boolean) => void;
    };
    meta: FieldMetaProps<any>;
}

export const FormikSelect = ({ name, label, children, ...props }: FormikSelectProps) => {
    return (
        <Field name={name}>
            {({ field, form, meta }: FieldHelperProps) => {
                const hasError = Boolean(meta.touched && meta.error);
                const handleChange = (event: SelectChangeEvent<unknown>) => {
                    form.setFieldValue(name, event.target.value);
                };

                return (
                    <FormControl fullWidth error={hasError} size={props.size}>
                        <InputLabel id={`${name}-label`}>{label}</InputLabel>
                        <MuiSelect
                            {...field}
                            {...props}
                            labelId={`${name}-label`}
                            label={label}
                            error={hasError}
                            onChange={handleChange}
                            onBlur={() => form.setFieldTouched(name, true)}
                        >
                            {children}
                        </MuiSelect>
                        {hasError && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
                    </FormControl>
                );
            }}
        </Field>
    );
};

export default FormikSelect;
