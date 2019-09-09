import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";

export const useTextInput = props => {
  const store = useLocalStore(
    sources => ({
      fullWidth: true,
      margin: "normal",
      variant: "outlined",
      value: "",
      ...sources,
      onChange(e) {
        this.value = e.target.value;
      }
    }),
    props
  );
  return store;
};

export default function TextField({ inputProps }) {
  return useObserver(() => <input type='text' {...inputProps} />);
}