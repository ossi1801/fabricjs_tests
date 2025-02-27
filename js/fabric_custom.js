//@ts-check
const { Canvas, StaticCanvas, IText,Point,Rect,Group } = fabric;
var canvas = new Canvas('canvas',{
  fireRightClick: true,  // <-- enable firing of right click events
  //fireMiddleClick: true, // <-- enable firing of middle click events
  stopContextMenu: true, // <--  prevent context menu from showing
});
function resizeCanvas() {
  canvas.setHeight(window.innerHeight*0.8);
  canvas.setWidth(window.innerWidth*0.84);
}
$(function () { //onstart
  resizeCanvas();
  canvas.contextMenuVisible = false;
  //https://api.jquery.com/jQuery.holdReady/
  //$.when(canvas,$.ready).done( () =>{ //when canvas is loaded

  //click for submit (add text) 
  $('#add-text-btn').on("click", function () {
    addText(200,200);
    createObjects( //Array of images etc
      [
        new CanvasObject(100, 100, 50, 50,true),
        new CanvasObject(200, 200, 50, 50)
      ]
    );
  });
  //Reset object angle
  $('#reset-orietation-btn').on("click", function () {
    resetAngle();
  });
  //If user presses delete on active object delete it
  $("body").on("keydown", (e) => {
    if (e.key === "Delete") {
      let a = canvas.getActiveObjects();
      if (a.length>0) {
        canvas.discardActiveObject(); //If not discard and user has multi selection then -> objects are not removed until left click???
        canvas.remove(...a);
      }
    }
  });

  canvas.on('mouse:down', (event) => {
    //console.log(event.e);
    switch (event.e.button) {
      case 0: //left click
        showCustomContextMenu(event, false);
        break;
      case 1:
        //console.log("middle click");
        break;
      case 2: //right click
        showCustomContextMenu(event);
        break;
      default:
        break;
    }
  });
  //USELESSSSSSSSSSSSSSss
  canvas.on('object:selected', function (options) {
    //  console.log("selected");
    // canvas.on('object:scaling', function(event) {
    //   )};
  });
  canvas.on("object:rotating", function() {});
  canvas.on('object:modified', function (event) {
    console.log(event);
    if (event.target) {

    }
  });

  //})
});

//Create local point relative to parent-->
// const abs = new fabric.Point(left, top)
// const rel = imageObj.toLocalPoint(point, 'left', 'top')
// console.log(rel.x, rel.y)

/**
 * @param {Number} x
 * @param {Number} y
 */
function addText(x,y,txtfontsize = 40) {
  let add_text_value = $('#add-text-value').val();
  let txt = add_text_value == undefined ? "" : "" + add_text_value;
  var new_text = new IText(txt, {
    left: x,
    top: y,
    fontSize: txtfontsize,
    lockUniScaling: true,
    fontFamily: "arial",
    fill: '#000000'
  });
  // new_text.lockRotation = true; //rotate disable
  canvas.add(new_text);
  canvas.setActiveObject(new_text);
  //console.log("click",message);
  //console.log(canvas.getElement(),new_text);
}
function resetAngle() {
  let active = canvas.getActiveObject();
  if (active) {
    active.rotate(0); //?
    canvas.renderAll();
   
  }
}
class CanvasObject {
  constructor(x,y,width,height,isEnabled=false) { 
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isEnabled = isEnabled;
  }
}
/**
 * @param {Array<CanvasObject>} array
 */
function createObjects(array) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];

    var htmlImage = new Image(0, 0); //html image size values do not matter.... thanks fabric
    htmlImage.src = "../images/lock.svg";//These src's should be preloaded to memory to avoid any runtime load when creating objects

    var img = new fabric.Image(htmlImage); // index this htmlimge from preloaded array (preloadedimgs[i])
    img.scaleToWidth(element.width); //interdasting functions 
    img.scaleToHeight(element.height);
    img.left = element.x;
    img.top = element.y;
    img.selectable = element.isEnabled;
    img.hoverCursor= element.isEnabled ? "move" :"default";
    //img.hasControls = element.isEnabled;
    //img.hasBorders = element.isEnabled;
    canvas.add(img);
  }
  canvas.renderAll();
}

/**
 * @param { fabric.IEvent<MouseEvent>} event
 * @param { Boolean} show
 */
function showCustomContextMenu(event, show = true) {
  if (show && canvas.contextMenuVisible == false) {
    canvas.contextMenuVisible = true;
    var pointer = canvas.getPointer(event.e);

    var menuBgr = new Rect(
      {
        //left:  pointer.x,
        top:  pointer.y,
        originX: 'left',
        //originY: 'center',
        width: 200,
        height: 100,
        rx: 5,
        ry: 5,
        fill: '#313131',   
        hasControls: false,
        hasBorders: false,
        selectable: false,
        hoverCursor: "default",
        name:""
      }
    );
    var item1 = createContextMenuItem("Menu item 1",event,menuItemClicked);
    var item2 = createContextMenuItem("Add new text",event, e => addText(pointer.x,pointer.y),20);
    var group = new fabric.Group([menuBgr,item1, item2 ], {
      left:  pointer.x,
      top: pointer.y,     
      hasControls: false,
      hasBorders: false,
      //selectable: false,
      name : "menu_group",
      subTargetCheck: true // allows the 
    });
    canvas.add(group);
    canvas.renderAll();
  }
  else if (show == false && canvas.contextMenuVisible) {
    var menu_group = canvas.getItemsByName("menu_group");
    //console.log(menu_items);
    canvas.remove(...menu_group); //remove automaticallly renders the page after remove
    canvas.contextMenuVisible = false;
  }

}
/**
 * @param { String} item_text
 * @param { fabric.IEvent<MouseEvent>} event
 * @param { Function} delegate
 * @returns {fabric.Group}
 */
function createContextMenuItem(item_text,event,delegate,offset=0){
  var pointer = canvas.getPointer(event.e);
  var fillColor = '#313131';
  var activeColor =  '#0094ff'; //#384a57
  var menuItemBgr = new Rect(
    {
      //left:  pointer.x,
      top: pointer.y+15+offset,
      originX: 'left',
      //originY: 'center',
      width: 200,
      height: 20,
      rx: 5,
      ry: 5,
      fill: '#313131',
      opacity: 0.1,
      hasControls: false,
      hasBorders: false,
      //selectable: true,
      hoverCursor: "default",
      name:""
    }
  );

  var menuText = new IText(item_text, {
    left: 15,//pointer.x+10,
    top: pointer.y+15+offset,
    originX: 'left',
    //originY: 'center',
    fontSize: 20,
    lockUniScaling: true,
    fontFamily: "arial",
    fill: '#ffffff',
    hoverCursor: "pointer",
    name : "menu_texts", //tag the object
    hasControls: false,
    hasBorders: false,
    //selectable: false,
  });
  var menuItem = new Group([menuText,menuItemBgr],{
    hasControls: false,
    hasBorders: false,
    subTargetCheck: true
  });
  menuItemBgr.on("mousedown", e => delegate(e)); //Binds on function to a user defined delegate passes element that was clicked to that delegate
  menuItemBgr.on("mouseover", e => {e.target.set("fill" , activeColor); canvas.renderAll();});
  menuItemBgr.on("mouseout", e => {e.target.set("fill" , fillColor); canvas.renderAll();});

  return menuItem;//canvas.add(menuItem);
}
/**
 * @param { fabric.IEvent<Event>} elem
 */
function menuItemClicked(elem){
  alert("You just clicked "+ elem.target?.text);
}


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
//Extension for contextmenu
fabric.Canvas.prototype.contextMenuVisible = false;

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