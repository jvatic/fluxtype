String::times = (n)->
  s = ""
  for i in [0..n]
    s += this
  s

String::trim = ->
  @replace(/^[\r\n\s]+/, '').replace(/[\r\n\s]+$/, '')

String::replace_at = (index, char)->
  @substr(0, index) + char + @substr(index+char.length)

Array::map = (callback)->
  new_array = []
  for item, index in this
    new_array.push callback.call this, item, index
  new_array

Array::map_pair = (callback)->
  new_array = []
  this.each_pair (a,b, index, length)=>
    new_array.push [callback.call(new_array, a, b, index, length)].unique()...
  new_array

Array::each = (callback)->
  for i, index in this
    callback.call this, i, index
  this

Array::each_pair = (callback)->
  for i in [0...this.length].flatten( (item)=> item%2 != 0 )
    callback.call(this, this[i], this[i+1], i, 1)
  this

Array::prev = (current)->
  this[this.indexOf(current)-1]

Array::next = (current)->
  this[this.indexOf(current)+1]

Array::flatten = (callback)->
  new_array = []
  callback ||= (item)=> not item
  for item, index in this
    if item and typeof item == 'object' and item.length
      new_array.push(item.flatten(callback)...)
      new_array = new_array.flatten(callback)
    else
      new_array.push item unless callback.call(new_array, item, index)
  new_array

Array::merge = (arrays...)->
  [this, arrays].flatten( (item)-> this.include(item) )

Array::include = (items, @options={})->
  items = [items] unless typeof items == 'object' and items.length
  does_include = true
  for item in items
    item_included = this.indexOf(item) != -1
    if @options.all
      does_include = false unless item_included
    else
      return true if item_included

  if @options.all
    return does_include
  else
    false

Array::sum = ->
  s = 0
  for n in this
    n = parseFloat(n)
    s += n if n
  s

Array::mean = ->
  @sum() / @length

Array::prevUntil = (callback, startIndex)->
  for item, index in @slice(0, startIndex).reverse()
    return item if callback.call(this, item)
  null

Array::first = -> this[0]
Array::last = -> this[@length-1]

Array::factors = ->
  factors = []
  common = []
  for n in this
    factors.push Math.factors(n)...
  for f in factors
    is_common = true
    for n in this
      is_common = false unless n%f == 0
    common.push f if is_common
  common.unique()

Array::max = ->
  Math.max(this...)

Array::unique = ->
  this.flatten( (item)-> this.include(item) )

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

