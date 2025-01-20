"use client";

import { useEffect, useState } from "react";
import css from "./style.module.scss";

function InputField(props) {
  const [id, setId] = useState("");

  useEffect(() => {
    setId(Math.random() + "input_id");
  }, []);

  return (
    <div className={css["form-input"]}>
      <input {...props} id={id} autoComplete="off" {...props.register} />
      <label htmlFor={id}>
        {props.icon}
        {props.title}
      </label>
    </div>
  );
}

export default InputField;
