import * as Cesium from "cesium";

export class BaseCesiumScene {
  containerId: string;
  viewer: Cesium.Viewer;
  scene: Cesium.Scene;
  camera: Cesium.Camera;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.viewer = new Cesium.Viewer(this.containerId, {
      geocoder: false,                //是否显示地名查找控件
      sceneModePicker: false,         //是否显示投影方式控件
      navigationHelpButton: false,    //是否显示帮助信息控件
      baseLayerPicker: false,         //是否显示图层选择控件
      homeButton: false,              //是否显示Home按钮
      fullscreenButton: false,        //是否显示全屏按钮
      animation: true, //左下角的动画控件的显示
      shouldAnimate: false, //控制模型动画
      timeline: true, //底部的时间轴
      selectionIndicator: false,
      infoBox: false,
      // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      //   url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer'
      // }),
    });
    this.scene = this.viewer.scene;
    this.camera = this.viewer.camera;
    (this.viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
    if (!this.scene.pickPositionSupported) {
      window.alert("此浏览器不支持拾取位置！");
    }

    this.viewer.timeline.zoomTo(this.viewer.clock.startTime, this.viewer.clock.stopTime);
    this.changeTimeFormat();
  }

  changeTimeFormat() {
    this.viewer.animation.viewModel.dateFormatter = (date) => {
      const gregorianDT = Cesium.JulianDate.toGregorianDate(date);
      const objDate = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day);
      return gregorianDT.day + ' ' + objDate.toLocaleString('en-us', {month: 'short'}) + ' ' + gregorianDT.year;
    };
    this.viewer.animation.viewModel.timeFormatter = (date) => {
      const localDate = Cesium.JulianDate.toDate(date);
      return localDate.toLocaleTimeString();
    };
    (Cesium.Timeline.prototype as any).makeLabel = function (time: Cesium.JulianDate) {
      const localDate = Cesium.JulianDate.toDate(time);
      return localDate.toLocaleString();
    };
  }

  flyToChina(duration = 3) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        116.435314,
        33.960521,
        6000000.0
      ),
      duration
    });
  }

  flyToShandong(duration = 3) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        117.20435,
        36.62302,
        900000
      ),
      duration
    });
  }

  screenToCartographic(windowPosition: Cesium.Cartesian2) {
    const ray = this.viewer.camera.getPickRay(windowPosition);
    if (!ray) {
      return undefined;
    }
    const cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    if (cartesian) {
      return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    } else {
      return undefined;
    }
  }

  screenToCartesian3(windowPosition: Cesium.Cartesian2) {
    const ray = this.viewer.camera.getPickRay(windowPosition);
    if (!ray) {
      return undefined;
    }
    const cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    return cartesian;
  }

  cartesian3ToCartographic(cartesian3: Cesium.Cartesian3) {
    return Cesium.Cartographic.fromCartesian(cartesian3);
  }

  cartesian3ToDegrees(cartesian3: Cesium.Cartesian3) {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
    return {
      longitude: Cesium.Math.toDegrees(cartographic.longitude),
      latitude: Cesium.Math.toDegrees(cartographic.latitude),
      height: cartographic.height,
    };
  }

  cartesian3ToScreen(cartesian3: Cesium.Cartesian3) {
    return Cesium.SceneTransforms.worldToWindowCoordinates(this.scene, cartesian3);
  }

  cartographicToCartesian3(cartographic: Cesium.Cartographic) {
    return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
  }

  getCartesian3sCenter(positions: Cesium.Cartesian3[]) {
    let x = 0, y = 0, z = 0;

    // 计算所有点的平均坐标
    positions.forEach(position => {
      x += position.x;
      y += position.y;
      z += position.z;
    });

    const length = positions.length;
    return new Cesium.Cartesian3(x / length, y / length, z / length);
  }

  destroy() {
    this.viewer.destroy();
  }
}
