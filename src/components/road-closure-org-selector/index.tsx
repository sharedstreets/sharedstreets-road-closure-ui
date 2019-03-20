import {
    Menu,
    MenuItem,
} from '@blueprintjs/core';
import {
    IItemListRendererProps,
    ItemPredicate,
    ItemRenderer,
    Omnibar,
} from '@blueprintjs/select';
import * as React from 'react';
import { IRoadClosureOrgName } from 'src/store/road-closure';
import './road-closure-org-selector.css';

export interface IRoadClosureOrgSelectorProps {
    allOrgs: { [name: string] : IRoadClosureOrgName },
    loadAllOrgs: () => void,
} 

const OrgOmnibar = Omnibar.ofType<string>();

class RoadClosureOrgSelector extends React.Component<IRoadClosureOrgSelectorProps, any> {
    public componentDidMount() {
        this.props.loadAllOrgs();
    }

    public handleItemSelect = () => {
        return;
    }

    public itemPredicate: ItemPredicate<string> = (query: string, item: string) => {
        return `${item}`.indexOf(query.toLowerCase()) >= 0;
    }

    public itemRenderer: ItemRenderer<string> = (item, { handleClick, modifiers, query }) => {
        return <MenuItem 
                    text={item}/>;
    }

    public itemListRenderer = (itemListProps: IItemListRendererProps<string>) => {
        return <Menu>
            {itemListProps.query && this.renderCreateOrgOption(itemListProps.query, false, (event: any) => { return; })}
            {
                itemListProps.filteredItems.map((org, index) => {
                    return <MenuItem
                            text={org}
                            label={`${this.props.allOrgs[org].count} closures`}
                            key={index}/>
                })
            }
        </Menu>;
    }

    public renderCreateOrgOption = (
        query: string,
        active: boolean,
        handleClick: React.MouseEventHandler<HTMLElement>,
    ) => {
        return <MenuItem
            icon="add"
            text={`Create organization with name: "${query}"`}
            active={active}
            onClick={handleClick}
            shouldDismissPopover={false}
        />
    };

    public createOrg(org: string): string {
        return org;
    }

    public render() {
        return (
            <OrgOmnibar
                className={"SHST-Road-Closure-Org-Selector"}
                isOpen={true}
                items={Object.keys(this.props.allOrgs)}
                itemPredicate={this.itemPredicate}
                itemListRenderer={this.itemListRenderer}
                itemRenderer={this.itemRenderer}
                onItemSelect={this.handleItemSelect}
                inputProps={{
                    placeholder: "Search for an org. name or type one in to create it..."
                }}
                overlayProps={{
                    usePortal: true
                }}
            />
        );
    }
}

export default RoadClosureOrgSelector;
