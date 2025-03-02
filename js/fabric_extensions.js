//@ts-check

//Extension for contextmenu
fabric.Canvas.prototype.contextMenuVisible = false;

//Extension function for fabric add the custom code from fabric.d.ts to get doc
fabric.Canvas.prototype.getItemsByName = function (name) {
  var objectList = [],
    objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].name && objects[i].name === name) {
      objectList.push(objects[i]);
    }
  }
  return objectList;
};

fabric.Canvas.prototype.getItemsByTaggedName = function (name) {
  var objectList = [],
    objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].name && objects[i].name?.includes(name)) {
      objectList.push(objects[i]);
    }
  }
  return objectList;
};


//Save/Load testing 
var json;
fabric.Canvas.prototype.Save = function () {
  json = canvas.toJSON();
  canvas.clear();
  //console.log(JSON.stringify(json));
};
fabric.Canvas.prototype.Load = function () {
  if (json) {
    canvas.loadFromJSON(json,
      () => void 0,
      () => _load(canvas)

    );
  } else {

  }
};
/**
 * 
 * @param {fabric.Canvas} canvas 
 */
function _load(canvas) {
  //console.log(canvas);
  canvas.renderAll(); //do not use render all causes canvas to not render,because the call is made for each object(?)
}


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


fabric.Object.prototype.restrictMovementAndEditing = function () {
  // If this object is currently active, clear the selection
  if (this.canvas && this.canvas.getActiveObject() === this) {
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll(); // Ensure canvas updates
  }
  // If this object is part of a group selection
  else if (this.canvas && this.canvas.getActiveObjects().includes(this)) {
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  // Store original properties if needed for potential restoration
  this._originalProperties = {
    lockMovementX: this.lockMovementX,
    lockMovementY: this.lockMovementY,
    lockScalingX: this.lockScalingX,
    lockScalingY: this.lockScalingY,
    lockRotation: this.lockRotation,
    selectable: this.selectable,
    hasControls: this.hasControls,
    hasBorders: this.hasBorders,
    hoverCursor: this.hoverCursor,
    normalMode: false,
  };
  this.normalMode= true;
  // Disable movement
  this.lockMovementX = true;
  this.lockMovementY = true;

  // Disable scaling
  this.lockScalingX = true;
  this.lockScalingY = true;

  // Disable rotation
  this.lockRotation = true;

  // Disable selection and controls
  this.selectable = false;
  this.hasControls = false;
  this.hasBorders = false;

  // Maintain event capability
  this.evented = true;

  // Check if object has a mousedown event listener and set cursor
  if (this.__eventListeners && this.__eventListeners['mousedown']) {
    this.hoverCursor = 'pointer';
  }

  // Override the on method to check for mousedown events
  // const originalOn = this.on;
  // this.on = function(eventName, handler) {
  //     originalOn.call(this, eventName, handler);
  //     if (eventName === 'mousedown') {
  //         this.hoverCursor = 'pointer';
  //     }
  //     return this;
  // };

  return this; // Allow method chaining
};

// Optional: Add a method to restore original properties
fabric.Object.prototype.restoreMovementAndEditing = function () {
  if (this._originalProperties) {
    Object.keys(this._originalProperties).forEach(key => {
      this[key] = this._originalProperties[key];
    });
    delete this._originalProperties;
  }
  return this;
};