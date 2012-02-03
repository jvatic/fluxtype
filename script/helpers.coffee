Math.factors = (n)->
  f = []
  for i in [n...0]
    f.push i if n%i == 0
  f

Math.aspect_ratio = (dimensions...)->
  common_factor = dimensions.factors().max()
  dimensions.map( (d)=> d/common_factor ).join(":")

Math.fits_apsect_ratio = (ratio, dimensions...)->
  ratio = ratio.split(':') if typeof ratio == 'string'
  throw "Ratio must fit dimensions" unless ratio.length == dimensions.length
  fit = true
  common_factor = null
  for d, i in dimensions
    factor = d/ratio[i]
    common_factor ||= factor
    fit = false unless factor == common_factor
  fit

