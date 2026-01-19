export function between(str, startChar, endChar) {
  const strDiv = str.split(startChar)[1];
  const strDiv2 = strDiv.split(endChar)[0];

  return strDiv2;
}