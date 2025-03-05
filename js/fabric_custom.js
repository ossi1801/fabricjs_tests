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
  resizeCanvas(); //scales to "full screen"
  populateGenericPropList();//add selection list items
  canvas.contextMenuVisible = false;
  // createObjects( //Array of images etc
  //   [
  //     new CanvasObject(100, 100, 50, 50, true),
  //     new CanvasObject(200, 200, 50, 50)
  //   ]
  // );

  $('#edit-mode-btn').on("click", function () {
    enableEditMode();
    //this.innerText
    $('#edit-mode-btn').text("Edit:" + restrict);
  });
  //click for submit (add text) 
  $('#add-text-btn').on("click", ()=>addText(200, 200));
  //Reset object angle
  $('#reset-orietation-btn').on("click", ()=>resetAngle());
  //Set prop to value (user given)
  $('#set-value-btn').on("click", function () {
    let curr_prop = $("#prop-list").val();
    let curr_prop_val = $("#prop-value").val();
    let curr_obj = canvas.getActiveObject();
    if (curr_prop && curr_prop_val && curr_obj) {
      canvas.discardActiveObject();
      curr_obj.set(curr_prop,curr_prop_val);
      canvas.renderAll();
    }
    console.log();
  });

  //If user presses delete on active object delete it
  $("body").on("keydown", (e) => {
    if (e.key === "Delete") {
      let a = canvas.getActiveObjects();
      if (a.length > 0) {
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
  canvas.on("object:rotating", function () { });
  canvas.on('object:modified', function (event) {
    console.log(event);
    if (event.target) {

    }
  });

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
    fill: '#000000',
    // id: 'text-001',
    normalMode:false, //
  });
  new_text.set("id", guidGenerator());
  new_text.set("normalMode",false); //
  // new_text.lockRotation = true; //rotate disable
  new_text.on('mousedown',ObjectOnClickAlert.bind(new_text));
  eventRegistry[new_text.id] =  ObjectOnClickAlert.bind(new_text);// Store the actual function reference

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

    var item1 = createContextMenuItem("Save canvas",pointer,canvas.Save);
    var item2 = createContextMenuItem("Load canvas(var)",pointer,canvas.Load);
    var item3 = createContextMenuItem("Menu item 3",pointer,menuItemClicked);
    var item4 = createContextMenuItem("Add new object   >",pointer,(()=>void 0),0,true,"sub_menu_group");
    var itemArray = [item1, item2,item3,item4 ];
    createContextMenuGroup(itemArray,pointer);

    pointer.x +=200;
    pointer.y +=100;
    var sub_item1 = createContextMenuItem("Add new text",pointer, e => addText(pointer.x,pointer.y));
    var sub_item2 = createContextMenuItem("Add new Image",pointer, e => alert("TODO Image?"));
    var sub_item3 = createContextMenuItem("Add new rectangle",pointer, e => alert("TODO RECTANGLE?"));
    var sub_item4 = createContextMenuItem("Sub Menu item 4",pointer,menuItemClicked);
    var sub_itemArray = [sub_item1, sub_item2,sub_item3,sub_item4];
    createContextMenuGroup(sub_itemArray,pointer,false);

    canvas.renderAll();
  }
  else if (show == false && canvas.contextMenuVisible) {
    var menu_group = canvas.getItemsByTaggedName("menu_group");
    //console.log(menu_items);
    canvas.remove(...menu_group); //remove automaticallly renders the page after remove
    canvas.contextMenuVisible = false;
  }

}
/**
 * 
 * @param {fabric.Object[]} itemArray 
 * @param {*} pointer 
 * @param {Boolean} isMainMenu 
 */
function createContextMenuGroup(itemArray,pointer,isMainMenu=true){
    var menuBgr = new Rect(
      {
        //left:  pointer.x,
        top:  pointer.y,
        originX: 'left',
        //originY: 'center',
        width: 200,
        height: 50,
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
    for (let index = 0; index < itemArray.length; index++) {
      itemArray[index].top += index * 30;
    }
    itemArray.unshift(menuBgr);//adds bgr to array as first item
    var group = new fabric.Group(itemArray, {
      left:  pointer.x,
      top: pointer.y,     
      hasControls: false,
      hasBorders: false,
      visible: isMainMenu,
      //selectable: false,
      name : isMainMenu ? "menu_group":"sub_menu_group",
      subTargetCheck: true // allows the 
    });
    menuBgr.set("height", 20+ (itemArray.length-1)*30); // Dynamic sizing
    canvas.add(group);
}

/**
 * @param { String} item_text
 * @param { *} pointer
 * @param { Function} delegate
 * @param { Number} offset
 * @param { Boolean}spacer
 * @param { String}subMenuTrigger
 * @returns {fabric.Group}
 */
function createContextMenuItem(item_text,pointer,delegate,offset=0,spacer = false,subMenuTrigger=""){
  var fillColor = '#313131';
  var activeColor =  '#0094ff'; //#384a57
  var menuItemBgr = new Rect(
    {
      //left:  pointer.x,
      top: pointer.y+11+offset,
      originX: 'left',
      //originY: 'center',
      width: 200,
      height: 28,
      rx: 5,
      ry: 5,
      fill: '#313131',
      //opacity: 0.1,
      hasControls: false,
      hasBorders: false,
      hoverCursor: "pointer",
      //selectable: true,
      //hoverCursor: "default",
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
    selectable: false,
  });
  var menuItem = new Group([menuItemBgr,menuText],{
    hasControls: false,
    hasBorders: false,
    subTargetCheck: true
  });
  if(spacer){
    var spacerRect = new Rect(
      {
        //left:  pointer.x,
        top: pointer.y+10+offset,
        originX: 'left',
        //originY: 'center',
        width: 200,
        height: 2,
        rx: 5,
        ry: 5,
        fill: '#ffffff',
        opacity: 0.1,
        hasControls: false,
        hasBorders: false,
        hoverCursor: "pointer",
        selectable: false,
        //hoverCursor: "default",
        name:""
      }
    );
    menuItem.add(spacerRect);
  }

  menuItem.on("mousedown", e => delegate(e)); //Binds on function to a user defined delegate passes element that was clicked to that delegate
  menuItem.on("mouseover", () => {
    if (subMenuTrigger && subMenuTrigger.length != 0) {
      var x = canvas.getItemsByName("sub_menu_group");
      x.forEach(x=>x.set("visible",true));
    }
    menuItemBgr.set("fill", activeColor);
    canvas.renderAll();
  });
  menuItem.on("mouseout", () => { menuItemBgr.set("fill", fillColor); canvas.renderAll(); });

  return menuItem;//canvas.add(menuItem);
}
/**
 * @param { fabric.IEvent<Event>} elem
 */
function menuItemClicked(elem){
  alert("You just clicked "+ elem.target?.text);
}

var restrict =true;
function enableEditMode(){
  //console.log(restrict);
  if(restrict){
    canvas.forEachObject((x)=> x.restrictMovementAndEditing());
  }
  else{
    canvas.forEachObject((x)=> x.restoreMovementAndEditing());
  }
  restrict = !restrict;
  //if(current){
    // canvas.forEachObject((x)=> {
    //   x.set('selectable',current);
    //   x.set('hasBorders',current);
    //   x.set('hasControls',current);
    // });
  //}
}

/**
 * 
 * @param {fabric.IEvent<MouseEvent>} e 
 */
function ObjectOnClickAlert(e) {
  // console.log(this);
  // console.log("clicked n"+this.normalMode);
  // console.log("clicked n"+ e.target.normalMode );
  // console.log("clicked n"+e.e.buttons);
  if (e.target&&e.target.normalMode  && e.e.buttons == 1) {  
    let str = `id: '${e.target.id}'\nValue: '${e.target.text}'`;
    alert(str);
  }
}


