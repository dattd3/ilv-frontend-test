import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";

export const useCheckbox = props => {
  const store = useLocalStore(
    sources => ({
      checked: false,
      ...sources,
      onChange(e) {
        this.checked = e.target.checked;
      }
    }),
    props
  );
  return store;
};

export default function Checkbox({ inputProps }) {
  return useObserver(() => <input type="checkbox" {...inputProps} />);
}
