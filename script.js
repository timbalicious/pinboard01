// Polaroid object for displaying each picture
var Polaroid = React.createClass({ displayName: "Polaroid",
  afterRender: function (polaroid) {
    // Once polaroid has been set to the DOM, make it draggable, and give it some visual flair
    $(polaroid).draggable().css("transform", function () {
      // Tilt the polaroid
      return "rotate(" + Math.floor(Math.random() * 30 - 15) + "deg)";
    }).css("top", function () {
      // Move polaroid to random vertical position within the pinboard
      return Math.floor(Math.random() * (window.innerHeight - 250 /*subtract polaroid height*/)) + "px";
    }).css("left", function () {
      // Move polaroid to random horizontal position within the pinboard
      return Math.floor(Math.random() * (window.innerWidth - 200 /*subtract polaroid width*/)) + "px";
    });
  },
  remove: function () {
    this.props.onRemove(this.props.idx);
  },
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", { ref: this.afterRender, className: "polaroid" }, /*#__PURE__*/
      React.createElement("img", { src: this.props.URL }), /*#__PURE__*/
      React.createElement("p", null, this.props.text), /*#__PURE__*/
      React.createElement("button", { className: "btn btn-danger btn-xs glyphicon glyphicon-trash",
        onClick: this.remove })));


  } });


// PolaroidModal object to be used for adding a new Polaroid to the pinboard
var PolaroidModal = React.createClass({ displayName: "PolaroidModal",
  getInitialState: function () {
    return {
      // Placeholder values for when user first adds a polaroid
      URL: "http://i50.photobucket.com/albums/f319/bbisnotillidan/upload_subtle_zpsqbjafkdf.jpg",
      text: "Click to upload" };

  },
  uploadImage: function () {
    var file = $("#image-uploader")[0].files[0];
    var fileReader = new FileReader();
    var self = this;
    if (file) {
      fileReader.readAsDataURL(file);
    }
    fileReader.onload = function (fileName) {
      self.setState({
        URL: fileReader.result,
        text: fileName });

    }.bind(null, file.name);
  },
  add: function () {
    this.props.onAdd(this.state.URL, this.state.text);
    this.close();
  },
  close: function () {
    this.props.onClose();
  },
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "background-modal" }), /*#__PURE__*/
      React.createElement("div", { className: "polaroid-modal" }, /*#__PURE__*/
      React.createElement("img", { src: this.state.URL }), /*#__PURE__*/
      React.createElement("input", { className: "image-uploader", id: "image-uploader", type: "file",
        onChange: this.uploadImage }), /*#__PURE__*/
      React.createElement("p", null, this.state.text), /*#__PURE__*/
      React.createElement("button", { className: "btn btn-info btn-xs glyphicon glyphicon-ok",
        onClick: this.add }), /*#__PURE__*/
      React.createElement("button", { className: "btn btn-danger btn-xs glyphicon glyphicon-remove",
        onClick: this.close }))));



  } });


// Pinboard object where all our added and displayed Polaroids sit
var PinBoard = React.createClass({ displayName: "PinBoard",
  getInitialState: function () {
    return {
      isInAddingMode: false, // Determines if PolaroidModal should be shown
      polaroidArr: [{
        id: this.nextId(),
        URL: "http://i50.photobucket.com/albums/f319/bbisnotillidan/YE9IsUMb_zpsmdbkrqpa.jpg", // Initial sample picture
        text: "Landscape.jpg" }] };


  },
  nextId: function () {
    // Generate a unique id to be used for polaroid children keys
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  },
  addPolaroid: function (src, desc) {
    this.setState(function (prevState, props) {
      prevState.polaroidArr.push({
        id: this.nextId(),
        URL: src,
        text: desc });

    });
  },
  toggleAddingMode: function () {
    this.setState(function (prevState, props) {
      prevState.isInAddingMode = !this.state.isInAddingMode;
    });
  },
  removePolaroid: function (index) {
    this.setState(function (prevState, props) {
      prevState.polaroidArr.splice(index, 1);
    });
  },
  renderPolaroids: function (polaroid, idx) {
    return /*#__PURE__*/(
      React.createElement(Polaroid, { key: polaroid.id, idx: idx, URL: polaroid.URL,
        text: polaroid.text, onRemove: this.removePolaroid }));

  },
  renderAddingMode: function (isInAddingMode) {
    // If the Add button is pressed, show our Polaroid Modal
    if (isInAddingMode) {
      return /*#__PURE__*/React.createElement(PolaroidModal, { onAdd: this.addPolaroid, onClose: this.toggleAddingMode });
    } else {
      return;
    }
  },
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", { className: "pinboard" },
      this.state.polaroidArr.map(this.renderPolaroids), /*#__PURE__*/
      React.createElement("button", { className: "btn btn-info glyphicon glyphicon-plus",
        onClick: this.toggleAddingMode }),
      this.renderAddingMode(this.state.isInAddingMode)));


  } });


ReactDOM.render( /*#__PURE__*/React.createElement(PinBoard, null), document.getElementById("app"));