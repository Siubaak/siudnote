export const encode = (s: string) => {
  try {
    return btoa(encodeURIComponent(s))
  } catch (err) {
    return s
  }
}

export const decode = (s: string) => {
  try {
    return decodeURIComponent(atob(s))
  } catch (err) {
    return s
  }
}
