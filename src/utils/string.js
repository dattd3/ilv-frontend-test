export function urlify(text) {
  if (!text) return "";
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '" target="_blank">' + url + "</a>";
  });
}

export function isJsonString(str) { // Kiểm tra có phải string là kiểu json (object not array) hay không
  if (!str?.trim()) return false

  try {
    const obj = JSON.parse(str)
    return (typeof obj === "object" && !Array.isArray(obj) && obj !== null)
  } catch (e) {
    return false
  }

  // if (str && 
  //   /^[\],:{}\s]*$/.test(
  //     str
  //       .replace(/\\["\\\/bfnrtu]/g, "@")
  //       .replace(
  //         /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
  //         "]"
  //       )
  //       .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
  //   )
  // ) {
  //   return true;
  // }
  // return false;
}
