//@ts-check

//Extension for contextmenu
fabric.Canvas.prototype.contextMenuVisible = false;

//Extension function for fabric add the custom code from fabric.d.ts to get doc
fabric.Canvas.prototype.getItemsByName = function(name) {
    var objectList = [],
        objects = this.getObjects();
    for (var i = 0, len = this.size(); i < len; i++) {
      if (objects[i].name && objects[i].name === name) {
        objectList.push(objects[i]);
      }
    }
    return objectList;
  };




// RoundedRect allows rounding each corner of a rect individually.
// const RoundedRect = new fabric.util.createClass(fabric.Rect, {
//   type: "roundedRect",
//   topLeft: [20, 20],
//   topRight: [20, 20],
//   bottomLeft: [20, 20],
//   bottomRight: [20, 20],
//   _render: function(ctx) {
//     var w = this.width,
//       h = this.height,
//       x = -this.width / 2,
//       y = -this.height / 2,
//       /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
//       k = 1 - 0.5522847498;
//     ctx.beginPath();
//     // top left
//     ctx.moveTo(x + this.topLeft[0], y);
//     // line to top right
//     ctx.lineTo(x + w - this.topRight[0], y);
//     ctx.bezierCurveTo(x + w - k * this.topRight[0], y, x + w, y + k * this.topRight[1], x + w, y + this.topRight[1]);
//     // line to bottom right
//     ctx.lineTo(x + w, y + h - this.bottomRight[1]);
//     ctx.bezierCurveTo(x + w, y + h - k * this.bottomRight[1], x + w - k * this.bottomRight[0], y + h, x + w - this.bottomRight[0], y + h);
//     // line to bottom left
//     ctx.lineTo(x + this.bottomLeft[0], y + h);
//     ctx.bezierCurveTo(x + k * this.bottomLeft[0], y + h, x, y + h - k * this.bottomLeft[1], x, y + h - this.bottomLeft[1]);
//     // line to top left
//     ctx.lineTo(x, y + this.topLeft[1]);
//     ctx.bezierCurveTo(x, y + k * this.topLeft[1], x + k * this.topLeft[0], y, x + this.topLeft[0], y);
//     ctx.closePath();
//     this._renderPaintInOrder(ctx);
//   }
// })