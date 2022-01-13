const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const maxSize = Math.max(image.width, image.height)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea
  canvas.height = safeArea

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2)

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  )
  const data = ctx.getImageData(0, 0, safeArea, safeArea)

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  )

  // As Base64 string
  return canvas.toDataURL('image/jpeg');

  // As a blob
  // return new Promise(resolve => {
  //   canvas.toBlob(file => {
  //     resolve(URL.createObjectURL(file))
  //   }, 'image/jpeg')
  // })
}

export default async function finishCroppedImage(imageSrc, pixelCrop, rotation = 0) {
  const imageCropped = await getCroppedImg(imageSrc, pixelCrop, rotation)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const canvasCopy = document.createElement("canvas")
  const copyContext = canvasCopy.getContext("2d")
  const MAX_WIDTH_CROP = 900
  const MAX_HEIGHT_CROP = 900
  const qualityToExport = 0.8
  const img = await createImage(imageCropped)
  ctx.drawImage(img, img.width, img.height)

  let ratio = 1
  if (img.width > MAX_WIDTH_CROP) {
    ratio = MAX_WIDTH_CROP / img.width
  } else if (img.height > MAX_HEIGHT_CROP) {
    ratio = MAX_HEIGHT_CROP / img.height
  }

  // Draw original image in second canvas
  canvasCopy.width = img.width
  canvasCopy.height = img.height
  copyContext.drawImage(img, 0, 0)

  // Copy and resize second canvas to first canvas
  canvas.width = img.width * ratio
  canvas.height = img.height * ratio

  ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', qualityToExport)
}