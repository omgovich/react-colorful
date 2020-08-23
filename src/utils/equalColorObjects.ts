const equalColorObjects = (
  first: Record<string, unknown>,
  second: Record<string, unknown>
): boolean => {
  if (first === second) return true;

  for (const prop in first) {
    if (first[prop] !== second[prop]) return false;
  }

  return true;
};

export default equalColorObjects;
