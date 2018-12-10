import * as mapboxgl from 'mapbox-gl';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class BaseControl implements mapboxgl.IControl {
    public map: any;
    public container: any;
    public classname: string;
    public controlText: string;
    public component: any;
    public onClick: () => void;

    public constructor(className: string, component: any, onClick: () => void) {
        this.classname = className;
        this.component = component;
        this.onClick = onClick;
    }

    public onAdd(map: any) {
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = this.classname;

        ReactDOM.render(React.createElement(this.component, {
            onClick: this.onClick
        }), this.container)

        return this.container;
    }

    public onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default BaseControl;