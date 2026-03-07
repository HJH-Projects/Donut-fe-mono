'use client';

import { create } from 'zustand';

export type GlobalDialogKey =
  | 'closet:addMethod'
  | 'closet:addForm'
  | 'closet:detail'
  | 'closet:deleteConfirm'
  | 'look:add'
  | 'look:edit'
  | 'look:detail'
  | 'look:share'
  | 'look:createLink'
  | 'look:deleteConfirm'
  | 'my:nickname'
  | 'my:settings'
  | 'my:language'
  | 'my:gender'
  | 'share:links'
  | null;

type GlobalDialogState = {
  activeDialog: GlobalDialogKey;
  payload: unknown;
};

type GlobalDialogStore = GlobalDialogState & {
  open: (dialog: Exclude<GlobalDialogKey, null>, payload?: unknown) => void;
  close: (dialog?: Exclude<GlobalDialogKey, null>) => void;
  replace: (dialog: Exclude<GlobalDialogKey, null>, payload?: unknown) => void;
};

const useGlobalDialogStore = create<GlobalDialogStore>((set, get) => ({
  activeDialog: null,
  payload: null,
  open: (dialog, payload) => {
    set({ activeDialog: dialog, payload: payload ?? null });
  },
  close: (dialog) => {
    const current = get();
    if (dialog && current.activeDialog !== dialog) return;
    set({ activeDialog: null, payload: null });
  },
  replace: (dialog, payload) => {
    set({ activeDialog: dialog, payload: payload ?? null });
  },
}));

export function getGlobalDialogState() {
  const { activeDialog, payload } = useGlobalDialogStore.getState();
  return { activeDialog, payload };
}

export function openGlobalDialog(dialog: Exclude<GlobalDialogKey, null>, payload?: unknown) {
  useGlobalDialogStore.getState().open(dialog, payload);
}

export function replaceGlobalDialog(dialog: Exclude<GlobalDialogKey, null>, payload?: unknown) {
  useGlobalDialogStore.getState().replace(dialog, payload);
}

export function closeGlobalDialog(dialog?: Exclude<GlobalDialogKey, null>) {
  useGlobalDialogStore.getState().close(dialog);
}

export function useGlobalDialogState<T>(selector: (current: GlobalDialogState) => T): T {
  return useGlobalDialogStore(selector);
}

export function useGlobalDialogOpen(dialog: Exclude<GlobalDialogKey, null>) {
  return useGlobalDialogState((current) => current.activeDialog === dialog);
}
