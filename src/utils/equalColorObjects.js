const equalColorObjects = (first, second) => {
  if (first === second) return true;

  for (let prop in first) {
    if (first[prop] !== second[prop]) return false;
  }

  return true;
};

export default equalColorObjects;
