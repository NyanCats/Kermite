import { EMPTY_OBJECT } from 'qx/qxinternal_petit_dom_060/h';
import { getFunctionComponentWrapperCached } from './functionComponentWrapper';
import { qxInterposeProps } from './qxInterposeProps';
import { jsx as petit_dom_jsx } from './qxinternal_petit_dom_060';
import { IProps, VNode } from './qxinternal_petit_dom_060/types';

export function jsx(
  type: string | Function,
  props: IProps,
  ...children: VNode[]
): VNode {
  props = props || EMPTY_OBJECT;

  const skip = props && 'qxIf' in props && !props.qxIf;
  if (skip) {
    return null;
  }

  qxInterposeProps(props, type);

  if (typeof type === 'function') {
    type = getFunctionComponentWrapperCached(type);
  }

  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      if (children[i] === undefined || (children[i] as any) === false) {
        children[i] = null;
      }
    }
  }

  if (children.length > 1) {
    props = { ...props, children };
  } else if (children.length === 1) {
    props = { ...props, children: children[0] };
  }

  return petit_dom_jsx(type, props, props.key);
}
