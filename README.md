# numPad

一款基于zepto的数字键盘，主要应用于移动端。

模拟input的一些特性。比如：

- 光标待输入状态
- 当输数大于最大宽度时，总是显示最新输入的内容

当输入框在页面底部时，不会被 numPad 遮挡。

注意：输入框的类型必须是 `type="text"`。 如果你设置的是 `type="number"`，当输入非数字，比如 `.` ，则再次输入时，基于输入框类型的默认限制，内容会被清空。

numPad演示：**[demo](http://joy-yi0905.github.io/numPad/demo/demo.html)**

### 如何使用

- 首先引入插件的样式文件 `zepto.numpad.min.css`

```html
<link rel="stylesheet" href="zepto.numpad.min.css">
```

- 然后再引入 `zepto.min.js` 和 `zepto.numpad.min.js`（这些文件包含在demo目录）

```html
<script src="zepto.min.js"></script>
<script src="zepto.numpad.min.js"></script>
```

- 最后，在页面里相应的 `<input>` 元素添加方法。 相关示例代码：

```html
<input type="text" placeholder="输入数字" class="input-number" />

<script>
$('.input-number').numPad();
</script>
```

除此之外，numPad 还提供了一些自定义属性，有 `digit`、`border` 和 `callback`，分别表示 小数点位数、是否需要边框、输入回调。你可以像这样使用它们：

```js
$('.input-custom').numPad({
  digit: 3,
  callback: function(value, isNumber) {
    if (isNumber) {
      console.log(value);
    } else {
      console.log('input value is not number');
    }
  }
});
```

上面代码，设置了 `.input-custom` 元素只能输入小数点后三位。当每次输入完，将进行了回调处理。

详细的参数配置，详见下表。


### 参数

当用户需要自定义输入时，可以将一个对象作为参数传递给 numPad 方法，该参数对象可配置 `digit`、`border`、`callback` 这三个选项。默认情况下，它们的取值如下：

| **参数** | **描述** | **默认值** | **格式** |
|----------|----------|------------|----------|
| digit | 小数点后的位数 | 2 | number |
| border | 模拟input是否需要边框 | false |true、或者 "1px solid red"  |
| callback | 每次输入回调 | 空函数 | 包含两个参数，分别是输入框此时的值，以及判断该值是否为数字 |

