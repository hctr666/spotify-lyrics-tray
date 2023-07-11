export const setLocalValue = (key, value) => {
  localStorage.setItem(key, value)
}

export const getLocalValue = key => {
  localStorage.getItem(key)
}

export const removeLocalValue = key => {
  localStorage.removeItem(key)
}
