import { atom, useRecoilState, useSetRecoilState } from 'recoil'

export type Action =
  | 'toc'
  | 'search'
  | 'annotation'
  | 'typography'
  | 'image'
  | 'timeline'
  | 'theme'
// | 'translate'
export const actionState = atom<Action | undefined>({
  key: 'action',
  default: undefined,
})

export function useSetAction() {
  return useSetRecoilState(actionState)
}

export function useAction() {
  return useRecoilState(actionState)
}
