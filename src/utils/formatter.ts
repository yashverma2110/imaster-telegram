const bold = (str: string, inHTML: boolean = false) => {
  if (inHTML) {
    return `<strong>${str}</strong>`;
  }

  return `*${str}*`;
};

const italic = (str: string, inHTML: boolean = false) => {
  if (inHTML) {
    return `<i>${str}</i>`;
  }

  return `_${str}_`;
};

export { bold, italic };
