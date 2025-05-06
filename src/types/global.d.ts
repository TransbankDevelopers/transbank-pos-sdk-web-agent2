interface ElectronAPI {
  onUpdateClientCount: (callback: (count: number) => void) => void;
  onUpdateClientLog: (callback: (data: string) => void) => void;
  onUpdatePosStatus: (callback: (posConnected: boolean) => void) => void;
}

interface ErrorApi {
  onError: (
    callback: ({ errorTitle: string, errorMessage: string }) => void
  ) => void;
  closeApp: () => void;
}

interface Window {
  electronAPI: ElectronAPI;
  errorAPI: ErrorApi;
}
