const equalHsv = (first, second) => {
  for (let prop in first) {
    if (first[prop] !== second[prop]) return false;
  }

  return true;
};

export default equalHsv;
