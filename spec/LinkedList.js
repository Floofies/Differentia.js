var d = global.d;

function isListElement(element) {
	return ((typeof element) === "object") && (element instanceof d.structs.LinkedList.ListElement);
}

// Simple LinkedList iterator which enumerates all ListElements.
function* listIterator(list) {
	var curElement = list.head;
	var nextElement;
	while (curElement !== null && list.size > 0) {
		nextElement = curElement.next;
		yield curElement;
		curElement = nextElement;
	}
}

// Tests a LinkedList's ListElements by quantity.
function countElements(list, quantity) {
	var loc = 1;
	for (const element of listIterator(list)) {
		expect(isListElement(element)).toBe(true);
		expect(element.parent).toBe(list);
		if (loc === quantity) return;
		if (element === list.tail) return;
		loc++;
	}
}

// Tests a LinkedList's non-head/tail ListElements by value & quantity.
function countValues(list, quantity) {
	var loc = 1;
	for (const element of listIterator(list)) {
		expect(isListElement(element)).toBe(true);
		expect(element.parent).toBe(list);
		if (element !== list.head && element !== list.tail) {
			expect(element.payload).toBe(loc);
			if (loc === quantity) return;
			loc++;
		}
		if (element === list.tail) return;
	}
}

// Tests for LinkedList
function llTests(List) {
	it("should contain elements added via insertAfter", function () {
		const list = new List();
		var element = list.insertAfter(list.head, 1);
		element = list.insertAfter(element, 2);
		element = list.insertAfter(element, 3);
		element = list.insertAfter(element, 4);
		list.insertAfter(element, 5);
		countValues(list, 5);
	});
	it("should contain elements added via insertBefore", function () {
		const list = new List();
		var element = list.insertBefore(list.tail, 5);
		element = list.insertBefore(element, 4);
		element = list.insertBefore(element, 3);
		element = list.insertBefore(element, 2);
		list.insertBefore(element, 1);
		countValues(list, 5);
	});
	it("should contain elements added from an iterable", function () {
		const list = new List([1,2,3,4,5]);
		const one = list.head.next;
		expect(isListElement(one) && one.payload === 1).toBe(true);
		const two = one.next;
		expect(isListElement(two) && two.payload === 2).toBe(true);
		const three = two.next;
		expect(isListElement(three) && three.payload === 3).toBe(true);
		const four = three.next;
		expect(isListElement(four) && four.payload === 4).toBe(true);
		const five = four.next;
		expect(isListElement(five) && five.payload === 5).toBe(true);
	});
	it ("should enumerate ListElements via elements/Symbol.iterator", function () {
		const list = new List([1,2,3,4,5]);
		var loc = 1;
		for (const element of list) {
			expect(isListElement(element)).toBe(true);
			expect(element.parent).toBe(list);
			expect(element.payload).toBe(loc);
			loc++
		}
	});
	it ("should enumerate ListElement values via values", function () {
		const list = new List([1,2,3,4,5]);
		var loc = 1;
		for (const value of list.values()) {
			expect(value).toBe(loc);
			loc++
		}
	});
	it ("should enumerate ListElements via elements", function () {
		const list = new List([1,2,3,4,5]);
		var loc = 1;
		for (const element of list.elements()) {
			expect(isListElement(element)).toBe(true);
			expect(element.parent).toBe(list);
			expect(element.payload).toBe(loc);
			loc++
		}
	});
	it ("should enumerate ListElement values via forEach", function () {
		const list = new List([1,2,3,4,5]);
		var loc = 1;
		list.forEach(function (value, index) {
			expect(value).toBe(loc);
			expect(index).toBe(loc - 1);
			loc++;
		});
	});
	it("should maintain a count of elements via size", function () {
		const list = new List([1,2,3,4,5]);
		expect(list.size).toBe(5);
		list.pop();
		expect(list.size).toBe(4);
		list.pop();
		expect(list.size).toBe(3);
		list.pop();
		expect(list.size).toBe(2);
		list.pop();
		expect(list.size).toBe(1);
		list.pop();
		expect(list.size).toBe(0);
	});
	it("should contain elements added via push/append", function () {
		const list = new List();
		list.push(1);
		list.push(2);
		list.push(3);
		list.push(4);
		list.push(5);
		countElements(list, 5);
	});
	it("should contain elements added via unshift/prepend", function () {
		const list = new List();
		list.unshift(5);
		list.unshift(4);
		list.unshift(3);
		list.unshift(2);
		list.unshift(1);
		countElements(list, 5);
	});
	it("should remove and return elements via remove", function () {
		const list = new List([1]);
		const element = new List.ListElement(2);
		list.push(element);
		list.push(3);
		list.push(4);
		list.push(5);
		expect(list.remove(element)).toBe(element);
	});
	it("should remove all elements via clear", function () {
		const list = new List([1,2,3,4,5]);
		list.clear();
		expect(list.size).toBe(0);
		expect(list.head.next).toBe(list.tail);
	});
	it("should remove and return the last element via pop", function () {
		const list = new List([1,2,3,4]);
		const element = new List.ListElement(5);
		list.push(element);
		expect(list.pop()).toBe(element);
	});
	it("should remove and return the first element via shift", function () {
		const list = new List([2,3,4,5]);
		const element = new List.ListElement(1);
		list.unshift(element);
		expect(list.shift()).toBe(element);
	});
	it("should find elements via find", function () {
		const list = new List([1,2,3,4,5]);
		const element = list.find(3);
		expect(element.payload).toBe(3);
	});
	it("should return the last element via last", function () {
		const list = new List([1,2,3,4,5]);
		const element = list.last();
		expect(element.payload).toBe(5);
	});
	it("should concatenate two lists via concat", function () {
		const list1 = new List([1,2,3,4,5]);
		const list2 = new List([6,7,8,9,10]);
		list1.concat(list2);
		countElements(list1, 10);
	});
	it("should move an element to the end of the list via pushBack", function () {
		const list = new List([1,2,3,4]);
		const element = new List.ListElement(5);
		
		expect(element.payload).toBe(5);
	});
}
// Tests for DoubleLinkedList
function dllTests(List) {
	it("should link ListElements in both directions", function () {
		const list = new List([1,2,3,4,5]);
		var prevElement = list.head;
		for (const element of list) {
			expect(element.prev).not.toBeNull();
			expect(element.prev).toBe(prevElement);
			prevElement = element;
		}
	});
}
// Tests for CircularLinkedList
function cllTests(List) {
	it("should link the tail ListElement to the head ListElement", function () {
		const list = new List([1,2,3,4,5]);
		expect(list.tail.next).toBe(list.head);
	});
}

describe("LinkedList", () => llTests(d.structs.LinkedList));

describe("CircularLinkedList", function () {
	llTests(d.structs.CircularLinkedList);
	cllTests(d.structs.CircularLinkedList);
});

describe("DoubleLinkedList", function () {
	llTests(d.structs.DoubleLinkedList);
	dllTests(d.structs.DoubleLinkedList);
});

describe("CircularDoubleLinkedList", function () {
	llTests(d.structs.CircularDoubleLinkedList);
	dllTests(d.structs.CircularDoubleLinkedList);
	cllTests(d.structs.CircularDoubleLinkedList);
	it("should link the head ListElement to the tail ListElement", function () {
		const list = new d.structs.CircularDoubleLinkedList([1,2,3,4,5]);
		expect(list.head.prev).toBe(list.tail);
	});
});