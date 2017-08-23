describe("Global 'differentia' Namespace", function () {
  it("should be an Object", function () {
    expect(differentia).not.toBeUndefined();
    expect(typeof differentia).toBe("object");
  });
  var modules = ['isContainer', 'getContainerLength', 'iddfs', 'forEach', 'diff', 'clone', 'diffClone', 'find', 'every', 'some', 'deepFreeze', 'deepSeal'];
  it("should contain \"" + modules.join("\", \"") + "\"", function () {
    modules.forEach(function (moduleName) {
      expect(moduleName in differentia).toBe(true);
    });
  });
});

var d = differentia;

function createTestObject() {
  return [
    {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": 92998,
        "geo": {
          "lat": -37.3159,
          "lng": 81.1496
        }
      },
      "website": null,
      "company": {
        "active": false,
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    },
    {
      "id": 2,
      "name": "Ervin Howell",
      "username": "Antonette",
      "email": "Shanna@melissa.tv",
      "address": {
        "street": "Victor Plains",
        "suite": "Suite 879",
        "city": "Wisokyburgh",
        "zipcode": 90566,
        "geo": {
          "lat": -43.9509,
          "lng": -34.4618
        }
      },
      "website": null,
      "company": {
        "active": true,
        "name": "Deckow-Crist",
        "catchPhrase": "Proactive didactic contingency",
        "bs": "synergize scalable supply-chains"
      }
    }
  ];
}
var testObjects = {};
testObjects["Multidimensional Acyclic"] = createTestObject();
testObjects["Linear Acyclic"] = ["one", "two", "three"];
// Fourth element is a cycle
testObjects["Linear Cyclic"] = ["one", "two", "three"];
testObjects["Linear Cyclic"][3] = testObjects["Linear Cyclic"];
// `otherUser` properties are a cycle
testObjects["Multidimensional Cyclic"] = createTestObject();
testObjects["Multidimensional Cyclic"][0].otherUser = testObjects["Multidimensional Cyclic"][1];
testObjects["Multidimensional Cyclic"][1].otherUser = testObjects["Multidimensional Cyclic"][0];

function createKeyCounter() {
  var testObject = testObjects["Multidimensional Cyclic"];
  var keyCounts = {};
  for (var key in testObject) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]["address"]) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]["address"]["geo"]) {
    keyCounts[key] = 0;
  }
  for (var key in testObject[0]["company"]) {
    keyCounts[key] = 0;
  }
  return keyCounts;
}

function testLength(obj) {
  if (Array.isArray(obj)) {
    return obj.length;
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).length;
  }
  throw new TypeError("The given parameter must be an Object or Array");
}

function diff(subject, compare, search = null) {
  var noIndex = false;
  if (search === null && testLength(subject) !== testLength(compare)) {
    return true;
  }
  if (search === null) {
    noIndex = true;
    search = subject;
  }
  var tuple = { subject, search, compare };
  var map = new Map();
  map.set(search, tuple);
  if (diff.test(tuple, map, noIndex)) {
    return true;
  }
  return false;
}

diff.test = function (tuple, map, noIndex) {
  for (var accessor in tuple.search) {
    if (!(accessor in tuple.subject)) {
      continue;
    }
    if (!("compare" in tuple) || !(accessor in tuple.compare)) {
      return true;
    }
    var subjectProp = tuple.subject[accessor];
    var compareProp = tuple.compare[accessor];
    var searchProp = tuple.search[accessor];
    if ((Array.isArray(subjectProp) && Array.isArray(compareProp))
      || (typeof subjectProp === "object" && typeof compareProp === "object")) {
      if (noIndex && testLength(subjectProp) !== testLength(compareProp)) {
        return true;
      }
      if (map.has(tuple.search[accessor])) {
        continue;
      }
        // Node has not been seen before, so traverse it
        var nextTuple = {};
        // Travese the Tuple's properties
        for (var unit in tuple) {
          if (unit === "search" || unit === "subject" || accessor in tuple[unit]) {
            nextTuple[unit] = tuple[unit][accessor];
          }
        }
        map.set(searchProp, nextTuple);
        return this(nextTuple, map, noIndex);
    } else if (subjectProp !== compareProp) {
      return true;
    }
  }
}

describe("testLength", function () {
  var array = [1, 2, 3, 4, 5];
  var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
  it("should count 5 items in each container", function () {
    expect(testLength(array)).toBe(5);
    expect(testLength(object)).toBe(5);
  });
});

describe("testDiff", function () {
  it("should return true when two objects differ", function () {
    expect(diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"])).toBe(true);
    expect(diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
    expect(diff(testObjects["Linear Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
  });
  it("should return false when two objects are the same", function () {
    expect(diff(testObjects["Linear Acyclic"], testObjects["Linear Acyclic"])).toBe(false);
    expect(diff(testObjects["Linear Cyclic"], testObjects["Linear Cyclic"])).toBe(false);
    expect(diff(testObjects["Multidimensional Acyclic"], testObjects["Multidimensional Acyclic"])).toBe(false);
    expect(diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Cyclic"])).toBe(false);
  });
});

describe("isContainer", function () {
  var array = [];
  var object = {};
  it("should return true if the input is an Object or Array", function () {
    expect(d.isContainer(array)).toBe(true);
    expect(d.isContainer(object)).toBe(true);
  });
  it("should return false if the input is not an Object or Array", function () {
    expect(d.isContainer(12345)).toBe(false);
    expect(d.isContainer("Hello World")).toBe(false);
    expect(d.isContainer(true)).toBe(false);
    expect(d.isContainer(false)).toBe(false);
  });
});

describe("getContainerLength", function () {
  var array = [1, 2, 3, 4, 5];
  var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
  it("should count 5 items in each container", function () {
    expect(d.getContainerLength(array)).toBe(5);
    expect(d.getContainerLength(object)).toBe(5);
  });
});

describe("Iterative Deepening Depth-First Search", function () {
  it("should throw a TypeError when no arguments are given", function () {
    expect(() => d.iddfs().next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
  });
  it("should throw a TypeError when any arguments are the wrong type", function () {
    expect(() => d.iddfs(123).next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
    expect(() => d.iddfs("test").next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
    expect(() => d.iddfs({}, 123).next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
    expect(() => d.iddfs({}, "test").next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
  });
  it("should iterate all nodes and properties", function () {
    var keyCounts = createKeyCounter();
    var testObject = testObjects["Multidimensional Cyclic"];
    var iterator = d.iddfs(testObject, testObject);
    var iteration = iterator.next();
    while (!iteration.done) {
      keyCounts[iteration.value.accessor]++;
      iteration = iterator.next();
    }
    console.group("IDDFS Traversal & Iteration Results:");
    for (var accessor in keyCounts) {
      console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
      expect(keyCounts[accessor] > 0).toBe(true);
    }
    console.groupEnd();
  });
});

describe("forEach", function () {
  it("should iterate all nodes and properties", function () {
    var keyCounts = createKeyCounter();
    var testObject = testObjects["Multidimensional Cyclic"];
    d.forEach(testObject, function (value, accessor, object) {
      keyCounts[accessor]++;
    });
    console.group("forEach Traversal & Iteration Results:");
    for (var accessor in keyCounts) {
      console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
      expect(keyCounts[accessor] > 0).toBe(true);
    }
    console.groupEnd();
  });
});

describe("Diff", function () {
  it("should return true when two objects differ", function () {
    expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"])).toBe(true);
    expect(d.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
    expect(d.diff(testObjects["Linear Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
  });
  it("should return false when two objects are the same", function () {
    expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Acyclic"])).toBe(false);
    expect(d.diff(testObjects["Linear Cyclic"], testObjects["Linear Cyclic"])).toBe(false);
    expect(d.diff(testObjects["Multidimensional Acyclic"], testObjects["Multidimensional Acyclic"])).toBe(false);
    expect(d.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Cyclic"])).toBe(false);
  });
  it("should return true when two objects differ using the search index", function () {
    expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 3: null })).toBe(true);
  });
  it("should return false when two objects are the same using the search index", function () {
    expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 1: null })).toBe(false);
  });
});

describe("Clone", function () {
  it("should make an exact copy of the subject", function () {
    var clone = d.clone(testObjects["Linear Acyclic"]);
    expect(diff(clone, testObjects["Linear Acyclic"])).toBe(false);
    clone = d.clone(testObjects["Linear Cyclic"]);
    expect(diff(clone, testObjects["Linear Cyclic"])).toBe(false);
    clone = d.clone(testObjects["Multidimensional Cyclic"]);
    expect(diff(clone, testObjects["Multidimensional Cyclic"])).toBe(false);
  });
  it("should clone properties using the search index", function () {
    var clone = d.clone(testObjects["Linear Acyclic"], { 2: null });
    var search = { 2: Number };
    expect(diff(clone, testObjects["Linear Acyclic"], search)).toBe(false);
    search = [{
      address: {
        geo: {
          lat: null
        }
      }
    }];
    clone = d.clone(testObjects["Multidimensional Cyclic"], search);
    expect(diff(clone, testObjects["Multidimensional Cyclic"], search)).toBe(false);
  });
});

describe("Diff Clone", function () {
  var subject = { "hello": "world", "how": "are you?", "have a": "good day" };
  var compare = { "hello": "world", "whats": "up?", "have a": "good night" };
  it("should clone properties that differ", function () {
    var clone = d.diffClone(subject, compare);
    expect(diff(clone, { "how": "are you?", "have a": "good day" })).toBe(false);
  });
  it("should clone properties that differ using the search index", function () {
    var clone = d.diffClone(subject, compare, { "how": null });
    expect(diff(clone, { "how": "are you?" })).toBe(false);
  });
});

describe("find", function () {
  it("should return a value if it passes the test", function () {
    expect(d.find(testObjects["Multidimensional Cyclic"], function (value, accessor, object) {
      return value === -37.3159;
    })).toBe(-37.3159);
  });
  it("should return undefined if no values pass the test", function () {
    expect(d.find(testObjects["Multidimensional Cyclic"], function (value, accessor, object) {
      return value === "This string does not exist in the test object!";
    })).toBeUndefined();
  });
});

describe("every", function () {
  var testObject = [10, 11, 12, 13, 14, 15];
  it("should return true if all values pass the test", function () {
    expect(d.every(testObject, function (value, accessor, object) {
      return typeof value === "number" && value >= 10;
    })).toBe(true);
  });
  it("should return false if one value fails the test", function () {
    expect(d.every(testObject, function (value, accessor, object) {
      return typeof value === "number" && value < 13;
    })).toBe(false);
  });
});

describe("some", function () {
  var testObject = [10, 11, 12, 13, 14, 15];
  it("should return true if one value passes the test", function () {
    expect(d.some(testObject, function (value, accessor, object) {
      return typeof value === "number" && value === 13;
    })).toBe(true);
  });
  it("should return false if no values pass the test", function () {
    expect(d.some(testObject, function (value, accessor, object) {
      return typeof value === "number" && value < 10;
    })).toBe(false);
  });
});

describe("deepFreeze", function () {
  it("should freeze all nodes and properties", function () {
    var frozenObject = d.deepFreeze(d.clone(testObjects["Multidimensional Cyclic"]));
    expect(d.every(frozenObject, function (value, accessor, object) {
      return Object.isFrozen(object) && d.isContainer(value) ? Object.isFrozen(value) : true;
    })).toBe(true);
  });
});

describe("deepSeal", function () {
  it("should seal all nodes and properties", function () {
    var sealedObject = d.deepSeal(d.clone(testObjects["Multidimensional Cyclic"]));
    expect(d.every(sealedObject, function (value, accessor, object) {
      return Object.isSealed(object) && d.isContainer(value) ? Object.isSealed(value) : true;
    })).toBe(true);
  });
});