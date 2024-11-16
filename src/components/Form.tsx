import React from "react";

interface FormProps {
  fields: Array<{ name: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }>;
  onSubmit: (e: React.FormEvent) => void;
  buttonText: string;
}

function Form({ fields, onSubmit, buttonText }: FormProps) {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field, index) => (
        <label key={index} htmlFor={field.name}>
          {field.name}:
          <input id={field.name} type={field.type} value={field.value} onChange={field.onChange} />
        </label>
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default Form;
