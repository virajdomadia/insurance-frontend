"use client";

import * as React from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000;

type State = {
  toasts: ToastProps[];
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: any) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast].slice(-TOAST_LIMIT),
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
}

function toast({ title, description, variant }: Omit<ToastProps, "id">) {
  const id = Math.random().toString(36).substring(2, 9);

  dispatch({
    type: "ADD_TOAST",
    toast: { id, title, description, variant },
  });

  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: id });
  }, TOAST_REMOVE_DELAY);
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toast,
    toasts: state.toasts,
  };
}
