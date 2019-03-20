import * as mapboxgl from 'mapbox-gl';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class BaseControl implements mapboxgl.IControl {
    public map: any;
    public container: any;
    public classname: string;
    public controlText: string;
    public component: any;
    public props: any;

    public constructor(className: string, component: any, props: any) {
        this.classname = className;
        this.component = component;
        this.props = props;
    }

    public onAdd(map: any) {
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = this.classname;

        ReactDOM.render(React.createElement(this.component, this.props), this.container)

        return this.container;
    }

    public onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default BaseControl;