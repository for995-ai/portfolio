import { createContext, useContext } from 'react';

/** 3D 舞台是否啟用中（就緒且未降級）；2D 元件據此切換呈現 */
export const Stage3DContext = createContext(false);

export function useStage3D(): boolean {
  return useContext(Stage3DContext);
}
