export const toTheNearestThousandth = (num) => {
  return Math.round(num * 1000) / 1000
}

 export const randoMize = (max) => {
  return toTheNearestThousandth(Math.random() * Math.floor(max))
}