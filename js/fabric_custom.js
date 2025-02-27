//@ts-check
const { Canvas, StaticCanvas, IText,Point,Rect,Group } = fabric;
var canvas = new Canvas('canvas',{
  fireRightClick: true,  // <-- enable firing of right click events
  //fireMiddleClick: true, // <-- enable firing of middle click events
  stopContextMenu: true, // <--  prevent context menu from showing
});

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
    createContextMenuItem("Menu item 1",event,menuItemClicked);
    var pointer = canvas.getPointer(event.e);
    createContextMenuItem("Add new text",event, e => addText(pointer.x,pointer.y));
    canvas.renderAll();
    //TODO create group for menu items  => name the group => check if delete destroys entire group
    //if yes menuItem name(s) can be used as id's ?
  }
  else if (show == false && canvas.contextMenuVisible) {
    var menu_items = canvas.getItemsByName("menu_items");
    //console.log(menu_items);
    canvas.remove(...menu_items); //remove automaticallly renders the page after remove
    canvas.contextMenuVisible = false;
  }

}
/**
 * @param { String} item_text
 * @param { fabric.IEvent<MouseEvent>} event
 * @param { Function} delegate
 */
function createContextMenuItem(item_text,event,delegate){
  var menu_items = canvas.getItemsByName("menu_items");
  let menu_items_count = menu_items.length;
  let offset = 0;
  if(menu_items_count>0 && menu_items[0].height){
    offset = menu_items[0].height * menu_items_count;
  }
  var pointer = canvas.getPointer(event.e);
  var menuItem = new IText(item_text, {
    left: pointer.x,
    top: pointer.y+offset,
    fontSize: 20,
    lockUniScaling: true,
    fontFamily: "arial",
    fill: '#000000',
    hoverCursor: "pointer",
    name : "menu_items" //tag the object
  });
  menuItem.hasControls = false;
  menuItem.hasBorders = false;
  menuItem.on("selected", elem => delegate(elem)); //Binds on function to a user defined delegate passes element that was clicked to that delegate
  // canvas.on("mouse:over",(e) => {
  //   console.log(e);
  //   if(e.target){
  //     e.target.fill='#ffffff';
  //   }
  //   canvas.renderAll();
  // });
  var menuItemBgr = new Rect(
    {
      left: menuItem.left,
      top: menuItem.top,
      width: menuItem.width,
      height: menuItem.height,
      fill: '#FF0000',
      name:"menu_items"
    }
  );
  
  canvas.add(menuItemBgr);
  canvas.add(menuItem);
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

function resizeCanvas() {
  canvas.setHeight(window.innerHeight*0.8);
  canvas.setWidth(window.innerWidth*0.74);
}