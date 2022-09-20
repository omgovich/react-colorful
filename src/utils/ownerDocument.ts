export const getOwnerDocument = (node: HTMLElement | null): ShadowRoot | Document | null => {
  let parent = node && node.parentNode;
  const ownerDocument = node && node.ownerDocument;
  while (parent) {
    if (parent instanceof ShadowRoot) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return ownerDocument;
};
