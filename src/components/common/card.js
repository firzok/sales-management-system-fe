import React, {Component} from 'react';
import { Collapse } from 'reactstrap';
import Select from 'react-select';
import MultiSelect from "@khanacademy/react-multi-select";

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            cardClass: 'card',
            headerClass: 'card-header header-elements-inline',
            bodyClass: 'card-body',
            headerTitleClass: 'card-title',
            bodyStyle: {},
            bodyID: null
        }
    }

    UNSAFE_componentWillMount(){
        if(this.props.isClose){
            this.setState({isOpen: false});
        }
        if(this.props.cardClass){
            this.setState({cardClass: this.state.cardClass + " " + this.props.cardClass});
        }
        if(this.props.headerClass){
            this.setState({headerClass: this.state.headerClass + " " + this.props.headerClass});
        }
        if(this.props.bodyClass){
            this.setState({bodyClass: this.state.bodyClass + " " + this.props.bodyClass});
        }
        if(this.props.headerTitleClass){
            this.setState({headerTitleClass: this.state.headerTitleClass + " " + this.props.headerTitleClass});
        }
        if(this.props.bodyStyle){
            this.setState({bodyStyle: this.props.bodyStyle});
        }
        if(this.props.bodyID){
            this.setState({bodyID: this.props.bodyID});
        }
    }

    toggleCollapse(){
        this.setState({isOpen: !this.state.isOpen});
    }

    onSelect(selectedOption) {
        this.props.headerSelect.onSelect(selectedOption);
    }

    handleMultiSelect(selectedOptions) {
        this.props.headerMultiselect.onMultiSelect(selectedOptions);
    }

    valueRenderer(selected, options, placeholder) {
        if (selected.length === 0) {
            return placeholder;
        }

        if (selected.length === options.length) {
            return "All Selected";
        }

        if (selected.length > 4) {
            return `${selected.length} Selected`;
        }
    }

    renderActions(){
        var actions = [];

        if(this.props.reload){
            actions.push(<div key="0" className="list-icons-item" data-action="reload" onClick={this.props.onReload}></div>);
        }
        if(this.props.remove){
            actions.push(<div key="1" className="list-icons-item" data-action="remove"></div>);
        }
        if(this.props.collapse){
            actions.push(<div key="2" className={this.state.isOpen ? "list-icons-item" : "list-icons-item rotate-180"} data-action="collapse" onClick={this.toggleCollapse.bind(this)}></div>);
        }
        if(this.props.headerSelect){
            var select = this.props.headerSelect;
            actions.push(
                <div className="wmin-200" key="3" title={this.props.headerSelectPopover}>
                    <Select
                        className="c-form-control-sm"
                        name={select.name}
                        value={select.value}
                        valueKey = "id"
                        labelKey = "name"
                        placeholder={select.placeholder}
                        onChange={this.onSelect.bind(this)}
                        options={select.options}
                        clearable={false}
                    />
                </div>
            );
        }
        if(this.props.headerMultiselect){
            select = this.props.headerMultiselect;
            actions.push(
                <div className="wmin-200" key="3" title={this.props.headerSelectPopover}>
                    <MultiSelect
                        className="c-form-control-sm"
                        name={select.name}
                        options={select.options}
                        selected={select.selected}
                        onSelectedChanged={this.handleMultiSelect.bind(this)}
                        valueRenderer={this.valueRenderer.bind(this, select.selected, select.options, select.placeholder)}
                        selectAllLabel={"Select All"}
                        isLoading={false}
                        disableSearch={false}
                    />
                </div>
            );
        }

        if(actions.length>0){
            return (
                <div className="header-elements">
                    <div className="list-icons">
                        {actions}
                    </div>
                </div>
            );
        }
        return []; 
    }

    render() {
        var moreactions = [];

        if (this.props.moreActions.length) {
            for (var i=0; i<this.props.moreActions.length; i++) {
                moreactions.push(this.props.moreActions[i])
            }
        }

        var actions = this.renderActions();
        var header = "";
        if(this.props.showHeader && this.props.collapse && this.props.headerClickable===false){
            header = <div className={this.state.headerClass}>
                        <p className={`${this.state.headerTitleClass} c-heading`}>{this.props.header}</p>
                        {moreactions}
                        {actions}
                    </div>
        }
        else if(this.props.showHeader && this.props.collapse){
            header = <div className={this.state.headerClass + " c-hand"} onClick={this.toggleCollapse.bind(this)}>
                        <p className={`${this.state.headerTitleClass} c-heading`}>{this.props.header}</p>
                        {moreactions}
                        {actions}
                    </div>
        }
        else if (this.props.subHeaderText) {
            header = <div className={this.state.headerClass}>
                        <p className={`${this.state.headerTitleClass} c-heading`}>{this.props.header}</p>
                        <h3 className={this.state.headerTitleClass}>{this.props.subHeaderText}</h3>
                        {moreactions}
                    </div>            
        }
        else{
            header = <div className={this.state.headerClass}>
                        <p className={`${this.state.headerTitleClass} c-heading`}>{this.props.header}</p>
                        {moreactions}
                        {actions}
                    </div>
        }

        return(
            <div className={this.state.cardClass}>
                {(this.props.showHeader)?header:""}
                {
                    (!this.props.body)? 
                        <div></div> :
                        <Collapse isOpen={this.state.isOpen} id={this.state.bodyID}>
                            <div className={this.state.bodyClass} style={this.state.bodyStyle}>
                                {this.props.children}
                            </div>
                        </Collapse>
                }

            </div>
        );
    }
};

export default Card;

Card.defaultProps = {
    isClose: false,
    collapse: false, 
    reload: false, 
    remove: false,
    headerSelect: false,
    showHeader: true,
    body: true,
    moreActions: [],
};
