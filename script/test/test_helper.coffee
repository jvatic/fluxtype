assertDifference = (base_obj, method_chain, amount, callback, message)->
  method_chain = method_chain.split('.')

  method = (obj, method_chain)->
    for link in method_chain
      continue unless obj
      obj = obj[link]

    obj = obj() if typeof obj == 'function'
    obj

  original_value = method(base_obj, method_chain)

  finish = ->
    actual_value = method(base_obj, method_chain)
    equal(actual_value, original_value+amount, message || "#{base_obj.toString()}##{method_chain.join('.')} changes by #{amount}")

  callback(finish)

module "assertDifference"

test "property chain changes by 1", ->
  expect 1

  obj = {
    foo: { bar: 1 }
    toString: -> "<Hash:obj>"
  }

  assertDifference obj, 'foo.bar', 1, (finish)->
    obj.foo.bar += 1
    finish()

test "property changes by -3", ->
  expect 1

  obj = {
    foo: 1
    toString: -> "<Hash:obj>"
  }

  assertDifference obj, 'foo', -3, (finish)->
    obj.foo -= 3
    finish()

test "method changes by 2", ->
  expect 1

  obj = {
    count: 3
    foo: {}
  }

  obj.foo.bar = ->
    obj.count

  assertDifference obj, 'foo.bar', 2, (finish)->
    obj.count += 2
    finish()
