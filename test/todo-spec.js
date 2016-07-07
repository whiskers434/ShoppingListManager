describe('Shopping List Manager Tester', function() {

    browser.get('http://localhost:3000/#/');

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Shopping List Manager');
    });

    it('should have a heading', function() {
        expect(element(by.id('MainHeading')).getText()).toEqual('Shopping List Manager');
    });

    it('should have a lists', function() {
        //check list
        element.all(by.id('list')).then(function(elements) {
          //elements is an array of ElementFinders
          for(i = 0; i < elements.length; i ++){
            //check list name
            expect(elements[i].element(by.id('listName')).getText() != ""); 
            //check list edit button
            expect(elements[i].element(by.id('listEdit')).isPresent()).toBe(true); 
            //check list delete button
            expect(elements[i].element(by.id('listDelete')).isPresent()).toBe(true);
          }
        });   
    });

    it('should have list name to sort lists', function() {
        var sort = element(by.id('listSort'));
        var list = [];
        var listCopy = [];
        expect(sort.getText()).toEqual('List Name arrow_drop_down');
        //check ASC order
        element.all(by.id('list')).then(function(elements) {
          // elements is an array of ElementFinders.
          for(i = 0; i < elements.length; i ++){
            list.push(elements[i].element(by.id('listName')).getText());
          }
          listCopy = list;
          listCopy.sort();
          expect(listCopy === list);
        });
        sort.click();
        expect(sort.getText()).toEqual('List Name arrow_drop_up');
        //check DSC order
        list = [];
        listCopy = [];
        element.all(by.id('list')).then(function(elements) {
          // elements is an array of ElementFinders.
          for(i = 0; i < elements.length; i ++){
            list.push(elements[i].element(by.id('listName')).getText());
          }
          listCopy = list;
          listCopy.sort();
          listCopy.reverse();
          expect(listCopy === list);
        });
    });

    it('should have a search box that works', function() {
        //check search
        var search = element(by.id('search'));
        var list = [];
        search.sendKeys('list1');
        element.all(by.id('list')).then(function(elements) {
          // elements is an array of ElementFinders.
          for(i = 0; i < elements.length; i ++){
            list.push(elements[i].element(by.id('listName')).getText());
          }
          expect(list === ['list1']);
        });
    });

    it('should have a new list button', function() {
        expect(element(by.id('newList')).isPresent()).toBe(true);
    });

    it('should have lists be editable', function() {
        element.all(by.id('list')).then(function(elements) {
            expect(elements[0].element(by.id('listEdit')).isPresent()).toBe(true);
            elements[0].element(by.id('listEdit')).click();
        });   
    });

    it('should have list name be editable', function() {
        expect(element(by.id('list_name')).isPresent()).toBe(true);
        expect(element(by.id('saveList')).getAttribute('disabled')).toEqual('true');
        expect(element(by.id('cancelList')).getAttribute('disabled')).toEqual('true');
        element(by.id('list_name')).sendKeys(protractor.Key.BACK_SPACE)
        expect(element(by.id('saveList')).getAttribute('disabled')).toEqual(null);
        expect(element(by.id('cancelList')).getAttribute('disabled')).toEqual(null);
        element(by.id('list_name')).sendKeys('2')
        expect(element(by.id('list_name_unique')).isPresent()).toBe(true);
        expect(element(by.id('list_name_unique')).getText()).toEqual("List name not unique");
        expect(element(by.id('saveList')).getAttribute('disabled')).toEqual('true');
        expect(element(by.id('cancelList')).getAttribute('disabled')).toEqual(null);
    });

    it('should have edited list be reverted', function() {
        expect(element(by.id('cancelList')).isPresent()).toBe(true);
        expect(element(by.id('cancelList')).getAttribute('disabled')).toEqual(null);
        element(by.id('cancelList')).click();
        browser.switchTo().alert().accept();
        expect(element(by.id('cancelList')).getAttribute('disabled')).toEqual('true');
    });

    it('should have list with items', function() {
        element.all(by.id('item')).then(function(elements) {
            for(i = 0; i < elements.length; i ++){
                expect(elements[i].element(by.id('itemName')).isPresent()).toBe(true);
                expect(elements[i].element(by.id('itemQuantity')).isPresent()).toBe(true);
                expect(elements[i].element(by.id('deleteItem')).isPresent()).toBe(true);
            }
        }); 
    });

    it('should have adding items to list', function() {
        var items;
        element.all(by.id('item')).then(function(elements) {
            items = elements.length;
        }); 
        expect(element(by.id('productSelect')).isPresent()).toBe(true);
        expect(element(by.id('addItem')).isPresent()).toBe(true);
        element(by.id('productSelect')).click();
        element.all(by.css('option')).then(function(elements) {
            expect(elements[1].isPresent()).toBe(true);
            elements[1].click();
            element(by.id('addItem')).click();
        });   
        element.all(by.id('item')).then(function(elements) {
            expect(items+1 == elements.length);
        });
    });

    it('should have list with items that change quantity', function() {
        element.all(by.id('item')).then(function(elements) {
            expect(elements[elements.length-1].element(by.id('itemQuantity')).getText()).toEqual('1');
            expect(elements[elements.length-1].element(by.id('itemQuantityPlus')).isPresent()).toBe(true);
            elements[elements.length-1].element(by.id('itemQuantityPlus')).click();
            expect(elements[elements.length-1].element(by.id('itemQuantity')).getText()).toEqual('2');
            expect(elements[elements.length-1].element(by.id('itemQuantityMinus')).isPresent()).toBe(true);
            elements[elements.length-1].element(by.id('itemQuantityMinus')).click();
            expect(elements[elements.length-1].element(by.id('itemQuantity')).getText()).toEqual('1');
        }); 
    });

    it('should have edited list be saved', function() {
        expect(element(by.id('saveList')).isPresent()).toBe(true);
        expect(element(by.id('saveList')).getAttribute('disabled')).toEqual('true');
    });

    it('should have list with items that can be deleted', function() {
        var name = "";
        element.all(by.id('item')).then(function(elements) {
            name = elements[elements.length-2].element(by.id('itemName')).getText();
            expect(elements[elements.length-1].element(by.id('deleteItem')).isPresent()).toBe(true);
            elements[elements.length-1].element(by.id('deleteItem')).click();
        }); 

        element.all(by.id('item')).then(function(elements) {
            expect(elements[elements.length-1].element(by.id('itemName')).getText()).toEqual(name);
        }); 
    });

    it('should have home button', function() {
        expect(element(by.id('home')).isPresent()).toBe(true);
    });
});