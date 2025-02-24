//@ts-check
const { Canvas, StaticCanvas, IText,Point } = fabric;
//https://stackoverflow.com/questions/33692728/fabric-js-increase-font-size-instead-of-just-scaling-when-resize-with-mouse
var canvas = new Canvas('canvas');
/**
 * @type {fabric.Object} 
 */
$(function () { //onstart

  //https://api.jquery.com/jQuery.holdReady/
  //$.when(canvas,$.ready).done( () =>{ //when canvas is loaded

  //keyup for fontsize
  $('#text-font-size').on("keyup", function () {
    var val = $(this).val();
    if (isNaN(val)) {
      alert('please enter number');
      $(this).val('');
    }
    var activeObject = canvas.getActiveObject();
    if (activeObject == null) return;
    activeObject.fontSize = val;
    canvas.renderAll();
  });

  //click for submit (add text) 
  $('#add-text-btn').on("click", function () {
    addText();
  });
  //Reset object angle
  $('#reset-orietation-btn').on("click", function () {
    resetAngle();
  });


  //USELESSSSSSSSSSSSSSss
  canvas.on('object:selected', function (options) {
    //  console.log(options);
    //   if (options.target) {
    //     $("textarea#add-text-value").val(options.target.text);
    //     $("#text-font-size").val(options.target.fontSize);
    //   }
    // });
    // canvas.on('object:scaling', function(event) {
    //   if (event.target) {
    //     $("textarea#add-text-value").val(event.target.text);
    //     $("#text-font-size").val((event.target.fontSize * event.target.scaleX).toFixed(0));
    //   }
  });
  canvas.on("object:rotating", function() {
   
  })
  canvas.on('object:modified', function (event) {
    console.log(event);
    if (event.target) {
      //   event.target.fontSize *= event.target.scaleX;
      //   event.target.fontSize = event.target.fontSize.toFixed(0);
      //   event.target.scaleX = 1;
      //   event.target.scaleY = 1;
      //   event.target._clearCache();
      //  $("textarea#add-text-value").val(event.target.text);
      //  $("#text-font-size").val(event.target.fontSize);
    }
  });

  //})
});

//Create local point relative to parent-->
// const abs = new fabric.Point(left, top)
// const rel = imageObj.toLocalPoint(point, 'left', 'top')
// console.log(rel.x, rel.y)

function addText() {
  let txtfontsize = 40;
  let text_font_size_val = $('#text-font-size').val()
  if (text_font_size_val) {
    txtfontsize = text_font_size_val;
  }

  let add_text_value = $('#add-text-value').val();
  let txt = add_text_value == undefined ? "" : "" + add_text_value;
  //var txtfontfamily = $('#font-family').val();
  var new_text = new IText(txt, {
    left: 200,
    top: 200,
    fontSize: txtfontsize,
    lockUniScaling: true,
    //fontFamily: txtfontfamily,
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
    //console.log(active);
    //console.log(active.getBoundingRect());
    //var bound_rect = active.getBoundingRect();
    active.rotate(0); //????????????????????????????????????????????????????????????????????????????????????????????????????????
    //active.set("angle", 0);
    //var originPoint = active.getPointByOrigin("left","top");
    //active.top = bound_rect.top*2;//+bound_rect.height;
    //active.left = bound_rect.left/2+bound_rect.width;
    // console.log(originPoint);
    canvas.renderAll();
   
  }
}