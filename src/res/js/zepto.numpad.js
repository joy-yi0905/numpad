import './../css/zepto.numpad.less';

import $ from 'n-zepto';

window.$ = window.Zepto = $;

;(function($){
  let pad = {
    id: '',
    display: false,
    inputNumpadEleClass: '.input-numpad-container',
    numpadEleClass: '.numpad'
  };

  function inputIsNumber(value) {
    // filter number format:
    // 12 12.00 0.12 √
    // 0012  0.  0.00  00.12  02.12 12. x

    let numArr = [];

    if (value.indexOf('.') !== -1) {
      numArr = value.split('.');

      if ((value/1 === '0') || (numArr[0].length > 1 && numArr[0].charAt(0) === '0') || !numArr[1]) {
        return false;
      }
    }

    if (value/1 === 0) return false;

    return true;
  }

  function eleIsView(ele) {
    let screenH = $(window).height();
    let numpadH = 200;
    let eleBottom = ele.get(0).getBoundingClientRect().bottom;

    return !(screenH - eleBottom < numpadH + 10);
  }

  function createNumpad() {
    let numpadEle = $('<div class="numpad"/>');

    numpadEle
    .html(
      `<ul class="list">
        <li class="item">1</li>
        <li class="item">2</li>
        <li class="item">3</li>
        <li class="item">4</li>
        <li class="item">5</li>
        <li class="item">6</li>
        <li class="item">7</li>
        <li class="item">8</li>
        <li class="item">9</li>
        <li class="item">.</li>
        <li class="item">0</li>
        <li class="item"><i class="icon-delete"></i></li>
      </ul>`
    )
    .appendTo(document.body);

    return numpadEle;
  }

  function Numpad(input, defaults = {digit: 2, border: false, callback: () => {}}, options) {
    this.input = input;
    this.opts = $.extend({}, defaults, options);

    this.showNumPad(this);
  }

  $.extend(Numpad.prototype, {
    showNumPad: (env) => {
      let padId = new Date()/1;

      let isSwitchInput = false;

      let input = env.input,
        inputVal = input.val(),
        inputId = input.data('id');

      let inputEle, numpadEle, numpadItem;

      if (pad.display) {
        if (inputId === pad.id) { // same input
          return;
        } else {
          isSwitchInput = true;
        }
      }

      pad.display = true;
      pad.id = padId;

      if (isSwitchInput) {
        $(pad.inputNumpadEleClass).remove();
        $('input[data-type="number"]').removeClass('hidden');

        numpadEle = $(pad.numpadEleClass);
      } else {
        numpadEle = createNumpad();
      }

      inputEle = env.createInputEle(input, env.opts.border);

      let {inputNumpadVal, inputFocus} = inputEle;

      inputNumpadVal.html(inputVal || '');

      input.attr({
        'data-type': 'number',
        'data-id': padId
      });

      if (inputVal !== '') input.addClass('hidden');

      numpadEle
      .removeClass('top bottom')
      .addClass(!eleIsView(input) ? 'top' : 'bottom')
      .attr('data-id', pad.id);

      setTimeout(() => {
        numpadEle.addClass('in transition');
        inputFocus.focus();

        $(document).on('click', function() {
          env.hideNumpad(input);
        });
      }, 10);

      numpadEle.on('click', () => {
        return false;
      });

      numpadItem = numpadEle.find('.item');

      numpadItem.off();

      numpadItem.on('click', function() {
        inputFocus.focus();
        env.inputNumber(inputNumpadVal, $(this), env);
      });
    },

    hideNumpad: (input) => {
      input.removeClass('hidden');
      $(pad.numpadEleClass).removeClass('in');
      $(pad.inputNumpadEleClass).remove();

      setTimeout(() => {
        $(pad.numpadEleClass).remove();

        pad.display = false;
      }, 400);
    },

    inputNumber: (inputNumpadText, numEle, env) => {
      let input = env.input,
        inputVal = input.val();

      let num = numEle.html();

      if (num.length === 1) { // add number or symbol "."
        if (inputVal.indexOf('.') !== -1 && inputVal.split('.')[1].length >= env.opts.digit) return;

        if (num === '.') {
          if (inputVal === '') {
            inputVal = '0.';
          } else {
            if (inputVal.indexOf('.') === -1) {
              inputVal += num;
            }
          }
        } else if (num === '0') {
          inputVal = inputVal === '' ? '0.' : (inputVal + num);
        } else {
          inputVal += num;
        }
      } else {  // delete number or symbol "."
        inputVal = inputVal === '0.' ? '' : inputVal.replace(/.$/, '');
      }

      !inputVal ? input.removeClass('hidden') : input.addClass('hidden');

      input.val(inputVal);

      inputNumpadText.html(inputVal);

      env.opts.callback(inputVal, inputIsNumber(inputVal));
    },

    createInputEle: (input, border) => {
      let inputParent = input.parent(),
        inputParentPosVal = inputParent.css('position'),
        inputPos = input.position();

      let inputNumpadContainer = $('<div class="input-numpad-container"/>'),
        inputNumpadText = $('<div class="input-numpad-text"/>'),
        inputFocus = $('<input class="input-focus" type="text" readonly>'),
        inputNumpadVal;

      if (typeof border === 'boolean') {
        border = border ? '1px solid #ccc' : 'none';
      }

      inputNumpadContainer
      .css({
        'display': 'flex',
        'display': '-webkit-flex',
        'position': 'absolute',
        'left': inputPos.left,
        'top': inputPos.top,
        'width': input.width(),
        'height': input.height(),
        'overflow-x': 'auto',
        'border': border,
        'font-family': input.css('font-family'),
        'font-size': input.css('font-size'),
        'line-height': input.height() + 'px',
        'box-sizing': 'border-box'
      })
      .appendTo(inputParent)
      .on('click', function() {
        return false;
      });

      inputNumpadText
      .html('<span></span>')
      .css({
        'position': 'relative',
        'display': 'inline-block',
        'white-space': 'nowrap',
        'box-sizing': 'border-box'
      })
      .addClass('blink')
      .appendTo(inputNumpadContainer);

      inputFocus
      .css({
        'position': 'absolute',
        'right': '-15px',
        'width': 0,
        'height': 0,
        'opacity': '0',
        'overflow': 'hidden'
      })
      .appendTo(inputNumpadText);

      inputNumpadVal = inputNumpadText.find('span');

      return {
        inputNumpadContainer,
        inputNumpadVal,
        inputFocus
      };
    }
  });

  $.fn.numpad = function(options) {
    $(this).attr('readonly', 'readonly');

    return $(this).on('click', function() {
      new Numpad($(this), options);

      return false;
    });
  };

})(Zepto);
