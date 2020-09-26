const idList: number[] = [];
const defaultLength = 10;

export default function newId(length = defaultLength): number {
  const newIdInt = Math.floor(
    Math.pow(defaultLength, length - 1) + Math.random() * (length - 1) * Math.pow(defaultLength, length - 1)
  );

  if (!idList.includes(newIdInt)) {
    idList.push(newIdInt);

    return newIdInt;
  }

  return newId();
}
