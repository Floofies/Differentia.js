# Search Algorithm Iterators

The search iterators, `bfs` and `dfs`, are actually both the same `searchIterator` algorithm (See CONTRIBUTING.md for more details about `searchIterator`) with differing traversal scheduling data structures (Queue VS Stack).

Upon calling `next()`, the search iterators expose a single state object in `value` which encapsulates the current state of iteration/traversal. The object is a flyweight and is thus mutated between every iteration/traversal; because of this, do not attempt to store or otherwise rely on values contained within it for more than one step in the iteration.

Property|Datatype|Description
---|---|---
accessor|Mixed|The accessor being used to access `value.tuple.subject` during property/element enumerations. Equal to `state.accessors[state.iteration]`.
accessors|Array|An Array of enumerable acessors found in `value.tuple.search`.
currentValue|Mixed|The value of the element of enumeration. Equal to `value.tuple.subject[value.accessor]`.
existing|`null` or Object|If `dfs` encounters an Object/Array it has seen before during the same search, this property will be set to the equivalent tuple; otherwise it will be `null`. Objects added to that tuple previously will show up again here.
isContainer|Boolean|Indicates if the current item of the enumeration is an Object or Array.
isFirst|Boolean|Indicates if the current item of the enumeration is the first item to be enumerated.
isLast|Boolean|Indicates if the current item of the enumeration is the last item to be enumerated.
iterations|Number|A number indicating how many items have been enumerated in the current Object/Array. Gets reset to `0` on each traversal.
length|Number|The total number of enumerable properties/elements of the current Object/Array being enumerated.
noIndex|Boolean|Indicates if a search index was not given. If `true`, then `search` is equal/assigned to `subject`.
targetTuples|Array|A list of tuples to be targeted for traversal. Tuples are removed from the bottom-up.
traverse|Boolean|Indicates if the current item of enumeration should be traversed.
tuple|Object|An Object containing all Objects being traversed in parallel.

The `tuple` object contains the following properties:

Property|Datatype|Description
---|---|---
subject|Object/Array|The source of paths/elements for traversal/enumeration.
search|Object/Array|The source of target paths/elements for traversal/enumeration.

Traversal is performed upon this tuple of objects equally, providing they have overlapping/equal paths. If any node exists in `search` that does not exist in any one object of the tuple, then traversal is aborted for that specific object and it is dropped from the tuple; except if the object lacking the node is `subject`, in which case traversal is aborted completely across all objects of the tuple, and nothing is dropped from the tuple.