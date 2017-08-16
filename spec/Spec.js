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

describe("isContainer", function () {
  var array = [];
  var object = {};
  it("should return true if the input is an Object or Array", function () {
    expect(differentia.isContainer(array)).toBe(true);
    expect(differentia.isContainer(object)).toBe(true);
  });
  it("should return false if the input is not an Object or Array", function () {
    expect(differentia.isContainer(12345)).toBe(false);
    expect(differentia.isContainer("Hello World")).toBe(false);
    expect(differentia.isContainer(true)).toBe(false);
    expect(differentia.isContainer(false)).toBe(false);
  });
});

describe("getContainerLength", function () {
  var array = [1, 2, 3, 4, 5];
  var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
  it("should count 5 items in each container", function () {
    expect(differentia.getContainerLength(array)).toBe(5);
    expect(differentia.getContainerLength(object)).toBe(5);
  });
});

describe("Iterative Deepening Depth-First Search", function () {
  it("should iterate all nodes and properties", function () {
    var keyCounts = {};
    var testObject = testObjects["Multidimensional Cyclic"];
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
    var iterator = differentia.iddfs(testObject, testObject);
    var iteration = iterator.next();
    while (!iteration.done) {
      keyCounts[iteration.value.accessor]++;
      iteration = iterator.next();
    }
    for (var accessor in keyCounts) {
      console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
      expect(keyCounts[accessor] > 0).toBe(true);
    }
  });
});

describe("Diff", function () {
  it("should return true when two objects differ", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"])).toBe(true);
    expect(differentia.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
    expect(differentia.diff(testObjects["Linear Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
  });
  it("should return false when two objects are the same", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Acyclic"])).toBe(false);
    expect(differentia.diff(testObjects["Linear Cyclic"], testObjects["Linear Cyclic"])).toBe(false);
    expect(differentia.diff(testObjects["Multidimensional Acyclic"], testObjects["Multidimensional Acyclic"])).toBe(false);
    expect(differentia.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Cyclic"])).toBe(false);
  });
  it("should return true when two objects differ using the search index", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 3: null })).toBe(true);
  });
  it("should return false when two objects are the same using the search index", function () {
    expect(differentia.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 1: null })).toBe(false);
  });
});

describe("Clone", function () {
  it("should make an exact copy of the subject", function () {
    var clone = differentia.clone(testObjects["Linear Acyclic"]);
    expect(differentia.diff(clone, testObjects["Linear Acyclic"])).toBe(false);
    clone = differentia.clone(testObjects["Linear Cyclic"]);
    expect(differentia.diff(clone, testObjects["Linear Cyclic"])).toBe(false);
    clone = differentia.clone(testObjects["Multidimensional Cyclic"]);
    expect(differentia.diff(clone, testObjects["Multidimensional Cyclic"])).toBe(false);
  });
  it("should clone properties using the search index", function () {
    var clone = differentia.clone(testObjects["Linear Acyclic"], { 2: null });
    var search = {2:Number};
    expect(differentia.diff(clone, testObjects["Linear Acyclic"], search)).toBe(false);
    search = [{
      address: {
        geo: {
          lat: null
        }
      }
    }];
    clone = differentia.clone(testObjects["Multidimensional Cyclic"], search);
    expect(differentia.diff(clone, testObjects["Multidimensional Cyclic"], search)).toBe(false);
  });
});

describe("Diff Clone", function () {
  var subject = { "hello": "world", "how": "are you?", "have a": "good day" };
  var compare = { "hello": "world", "whats": "up?", "have a": "good night" };
  it("should clone properties that differ", function () {
    var clone = differentia.diffClone(subject, compare);
    expect(differentia.diff(clone, {"how": "are you?", "have a": "good day"})).toBe(false);
  });
  it("should clone properties that differ using the search index", function () {
    var clone = differentia.diffClone(subject, compare, { "how": null });
    expect(differentia.diff(clone, {"how": "are you?"})).toBe(false);
  });
});