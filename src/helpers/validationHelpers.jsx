export const validateEmail = email => {
  const validRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/ //   /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-z]{2,8}(.[a-z]{2,8})?/g
  return validRegex.test(email)
}

export const formatDate = date => {
  const newDate = new Date(date.split('T')[0].split('-'))
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  console.log(newDate)
  return newDate.toLocaleDateString('es-ES', options)
}
