const prefix="CommonChat"
const secondaryPrefix="ReserveChat"
const expiry=10*60*1000
const key= `${prefix}-1`
const secondaryCacheLimit= 200

module.exports={prefix,expiry, key,secondaryPrefix,secondaryCacheLimit}