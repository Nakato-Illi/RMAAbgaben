//entry point on DOM ready
jQuery(document).ready(function ($) {
    var editItem;
    var uniqueItemID = $('ul.todo-list > li').length; //Checkbox ID initial setzen

    /*Checkbox Functionality*/

    $('ul.todo-list li :checkbox').each(function (i) {
        setCheckboxAttributes($(this), i);
        styleCheckbox($(this));
    });

    function styleCheckbox($checkbox) {
        $checkbox.addClass('styledCB');
        $checkbox.next('label').prepend('<span></span>');
    }

    /*-------------------TO-DO Item Interactivity / Event Handler-----------------------------*/
    /*Edit Arrow Button -> Open Menu Bar*/
    $('ul.todo-list li .arrow-btn').on('click', function (a,b,c,d) {
        onArrowClick($(this).closest('li'));
    });

    function onArrowClick($clickItem) {
        $('ul.todo-list > li').each(function (i) {
            if ($(this).is($clickItem) || $(this).hasClass('edit-open')) {
                toggleMenuItemBarOpen($(this));
                // toggleMenuItemBarOpen($clickItem);
            }
        });
    }

    /*set Edit Mode Icon Functionality*/

    /*Remove Function*/
    $('ul.todo-list li .remove-btn').on('click', function () {
        removeItem($(this).closest('ul.todo-list > li'));
    });


    /*Edit Function*/
    $('ul.todo-list li .edit-btn').on('click', function () {
        setEditModeItem($(this).closest('ul.todo-list > li'));
    });


    /*Duplicate Function*/
    $('ul.todo-list li .duplicate-btn').on('click', function () {
        var $newItem = duplicateItem($(this).closest('ul.todo-list > li'));
        /*Item Editier Modus beenden vor Erzeugen*/
        if (editItem) {
            unEditModeItem();
        }
        fadeInItem($newItem);
    });

    /*----------------Footer Button Handler---------------*/
    $('.clear-done-btn').on('click', clearDone);
    $('.create-btn').on('click', createNewItem);
    $('.new-list-btn').on('click', onNewListClick);


    /*--------------Handler and Custom Methods----------------*/

    function setCheckboxAttributes($checkbox, id) {
        $checkbox.attr('id', 'c' + id);
        $checkbox.next('label').attr('for', 'c' + id);
    }


    function duplicateItem($item) {
        $clone = $item.clone(true); //Clone erstellen, data und events einbeziehen
        setCheckboxAttributes($clone.find('input[type="checkbox"]'), uniqueItemID++); //checkbox attribute neu setzen//für korrekte checkbox-label Zugehörigkeit
        $clone.insertAfter($item); //neues Element nach Original einfügen
        toggleMenuItemBarOpen($item); //Menü des original Elements schließen
        return $clone;            //neues Element zurückgeben
    }

    function toggleMenuItemBarOpen($listItem) {
        var $targ = $listItem.find('.arrow-btn');

        var startAngle = $listItem.hasClass('edit-open') ? 180 : 0;
        var targHeight = $listItem.hasClass('edit-open') ? 45 : 70;

        $listItem.animate({height: targHeight}, {duration: 300});

        $({angle: startAngle}).animate({angle: startAngle + 180}, {
            duration: 300,
            step: function (curDeg) {
                $targ.css('transform', 'rotate(' + curDeg + 'deg)');
            }
        });

        $listItem.toggleClass('edit-open');
    }

    function setEditModeItem(_editItem) {
        editItem = _editItem;
        editItem.addClass('edit-mode');

        var tf = editItem.find('input[type="text"]');

        tf.removeAttr('readonly');
        tf.focus();

        tf.on('blur', unEditModeItem);
    }

    /*jQuery Plugin für Event 'enterPress': Handler für ENTER Taste drücken*/
    $.fn.pressEnter = function (callback) {
        return this.each(function () {  //Loop über alle Elemente der jQuery-Selektion
            $(this).on('enterPress', callback); //Callback-Funktion für unser Custom Event registrieren
            $(this).keypress(function (e) {  //keypress-Handler hinzufügen
                if (e.keyCode == 13) {   //ist gedrückte Taste ENTER ?
                    $(this).trigger("enterPress"); //Custom Event "enterPress" wird geworfen
                }
            });
        });
    };

    //add enter event via custom jQuery function to all input fields
    $('ul.todo-list li input[type="text"]').pressEnter(function (event) {
        if (editItem) {               //wird ein Listen-Item editiert?
            if (event.target == editItem.find('input[type="text"]')[0]) {   //entspricht das Event Target dem editierten Item?
                unEditModeItem();                                 //Beenden des Editiermodus
            }
        }
    });


    function unEditModeItem() {
        var tf = editItem.find('input[type="text"]');
        tf.attr('readonly', 'readonly');
        tf.off('blur', unEditModeItem);
        editItem.removeClass('edit-mode');

        if (!tf.val()) {
            editItem.remove();
        }

        editItem = null;
    }

    function newLi(id) {
        var $newListItem = $('<li>');

        // Erstelle ein Checkbox-Element
        var $checkbox = $('<input>', { type: 'checkbox' });

        // Erstelle ein label-Element
        var $label = $('<label>');

        // Erstelle ein text-Element innerhalb des label-Elements
        var $textInput = $('<input>', { type: 'text', value: '', readonly: 'readonly' });

        // Füge das text-Element zum label-Element hinzu
        $label.append($textInput);

        // Erstelle ein div-Element mit der Klasse "arrow-btn"
        var $arrowButton = $('<div>', { class: 'arrow-btn' });

        // Erstelle ein ul-Element mit der Klasse "item-menu-bar"
        var $menuBar = $('<ul>', { class: 'item-menu-bar' });

        // Erstelle li-Elemente innerhalb des ul-Elements
        var $editButton = $('<li>', { class: 'edit-btn' }).text('Editieren');
        var $duplicateButton = $('<li>', { class: 'duplicate-btn' }).text('Duplizieren');
        var $removeButton = $('<li>', { class: 'remove-btn' }).text('Löschen');

        // Füge die li-Elemente zum ul-Element hinzu
        $menuBar.append($editButton, $duplicateButton, $removeButton);

        // Füge alle erstellten Elemente zum li-Element hinzu
        $newListItem.append($checkbox, $label, $arrowButton, $menuBar);

        // Set Checkbox attributes
        setCheckboxAttributes($checkbox, id);

        //Checkbox stylen und Attribute setzen
        styleCheckbox($checkbox, id);

        return $newListItem;
    }

    //bind in capture phase
    function createNewItem(event) {
        //Aufgabenteil (a)

        // Erstelle ein neues li-Element
        let $newListItem = newLi(uniqueItemID++);

        // Füge das li-Element zum Container hinzu
        $('ul.todo-list').append($newListItem);

        //Editiermodus für neues Item aktivieren
        setEditModeItem($newListItem);

        //Event Handler hinzufügen
        // edit Mode beenden
        $newListItem.find('input[type="text"]').pressEnter(unEditModeItem);
        // menu anzeigen
        $newListItem.find('.arrow-btn').on('click', function () {
            onArrowClick(this.parentNode);
        });
        // to do list element Löschen
        $newListItem.find('.remove-btn').on('click', function () {
            removeItem($(this).closest('ul.todo-list > li'));
        });
        // to do list element editieren
        $newListItem.find('.edit-btn').on('click', function () {
            setEditModeItem($(this).closest('ul.todo-list > li'));
        });
        // to do list Element kopieren
        $newListItem.find('.duplicate-btn').on('click', function () {
            var $newItem = duplicateItem($(this).closest('ul.todo-list > li'));
            /*Item Editier Modus beenden vor Erzeugen*/
            if (editItem) {
                unEditModeItem();
            }
            fadeInItem($newItem);
        });

        //neues Item einblenden
        fadeInItem($newListItem);
    }

    function onNewListClick() {
        //Aufgabenteil (b)

        //alle list items löschen
        removeItem($( 'ul.todo-list li' ));

        //Variablen-Werte zurücksetzen
        uniqueItemID = 0;

        //neues, leeres List Item erstellen
        createNewItem();
    }

    function fadeInItem($item) {
        $item.hide().fadeIn(500);
    }

    function showEditMode() {
        $('ul.todo-list').toggleClass('editable');
    }

    function clearDone() {
        $('ul.todo-list li input:checked').each(function () {
            removeItem($(this).closest('li'));
        });
    }

    function removeItem($targItem) {
        $targItem.animate({opacity: 0.0, paddingLeft: '+=100'}, 500, function () {
            this.remove();
        });
    }
});
