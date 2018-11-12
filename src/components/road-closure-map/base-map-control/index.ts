import * as mapboxgl from 'mapbox-gl';

class BaseControl implements mapboxgl.IControl {
    public map: any;
    public container: any;
    public classname: string;

    public constructor(className: string) {
        this.classname = className;
    }

    public onAdd(map: any) {
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = this.classname;
        this.container.textContent = 'Hello, world';
        return this.container;
    }

    public onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default BaseControl;