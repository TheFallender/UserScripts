// A shared resource that should be used by all scripts
// It will wait for an element to be in the DOM


// Method to wait for an element/elements to be in the DOM
function waitForElement(selector, selectorAll = false) {
    return new Promise((resolve) => {
        //Return the element if it is already in the DOM
        if (!selectorAll) {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
            }
        } else {
            const element = document.querySelectorAll(selector);
            if (element.length > 0) {
                resolve(element);
            }
        }

        //Wait for the element to be in the DOM
        const observer = new MutationObserver((mutations) => {
            if (!selectorAll) {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            } else {
                const element = document.querySelectorAll(selector);
                if (element.length > 0) {
                    resolve(element);
                    observer.disconnect();
                }
            }
        });

        //Observer settings
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

// Method to wait for an element/elements to be in the DOM with a callback
function waitForElementCallback(selector, callback = null, selectorAll = false, shouldDisconnect = true) {
    return new Promise(resolve => {
        //Return the element if it is already in the DOM
        if (!selectorAll) {
            const element = document.querySelector(selector);
            if (element) {
                if (shouldDisconnect) {
                    resolve(element);
                } else {
                    callback(element);
                }
            }
        } else {
            let elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements = Array.from(elements);
                if (shouldDisconnect) {
                    resolve(elements);
                } else {
                    callback(elements);
                }
            }
        }

        //Wait for the element to be in the DOM
        const observer = new MutationObserver(mutations => {
            if (!selectorAll) {
                const element = document.querySelector(selector);
                if (element) {
                    if (shouldDisconnect) {
                        resolve(element);
                        observer.disconnect();
                    } else {
                        callback(element);
                    }
                }
            } else {
                const element = document.querySelectorAll(selector);
                if (element.length > 0) {
                    if (shouldDisconnect) {
                        resolve(element);
                        observer.disconnect();
                    } else {
                        callback(element);
                    }
                }
            }
        });

        //Observer settings
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Wait for the elements to be in the DOM, with minimum amount of elements to succeed
function waitForElementsSize(selector, selectorAll = false, minimum_elements = 0) {
    return new Promise(resolve => {
        function conditionsSuccess() {
            let queryResult = null
            if (!selectorAll) {
                const singleElement = document.querySelector(selector);
                if (singleElement) {
                    queryResult = singleElement;
                }
            } else {
                const multipleElements = document.querySelectorAll(selector);
                if (multipleElements.length > 0 && multipleElements.length >= minimum_elements) {
                    queryResult = multipleElements;
                }
            }
            return queryResult;
        }

        //Return the element if it is already in the DOM
        const domCheck = conditionsSuccess()
        if (domCheck) {
            resolve(domCheck)
        }

        //Wait for the element to be in the DOM
        const observer = new MutationObserver(mutations => {
            //Return the element if it is already in the DOM
            const mutationCheck = conditionsSuccess()
            if (mutationCheck) {
                resolve(mutationCheck)
            }
        });

        //Observer settings
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}