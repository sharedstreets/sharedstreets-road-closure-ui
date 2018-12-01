import * as mapboxgl from 'mapbox-gl';

class BaseControl implements mapboxgl.IControl {
    public map: any;
    public container: any;
    public classname: string;
    public controlText: string;
    public onclick: any;

    public constructor(className: string, controlText: string, onclick: any) {
        this.classname = className;
        this.onclick = onclick;
        this.controlText = controlText;
    }

    public onAdd(map: any) {
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = this.classname;

        const button = document.createElement('button');
        button.textContent = this.controlText;
        button.onclick = this.onclick;
        this.container.appendChild(button);

        return this.container;
    }

    public onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default BaseControl;