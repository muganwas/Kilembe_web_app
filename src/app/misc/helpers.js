const width = window.innerWidth;
// const height = window.innerHeight;

export const isMobile = (winWidth = width) => {
  if (winWidth < 500) return true;
  else return false;
}
export const isSmallMobile = (winWidth = width) => {
  if (winWidth < 411) return true;
  else return false;
}
export const shortName = name => {
  const shortname = name ? name.split(' ')[0] : '';
  return shortname;
}
export const nameTooLong = name => {
  const nameLength = name.length;
  if (nameLength > 28) return true;
  else return false;
}
export const firstLetters = name => {
  let resultingName;
  const nameArr = name ? name.split('') : [];
  const nameArrLength = nameArr.length;
  if (nameArrLength > 3) {
    const newArr = nameArr.splice(0,3);
    resultingName = newArr.join('') + "...";
  } 
  else {
    resultingName = name;
  }
  return resultingName;
}