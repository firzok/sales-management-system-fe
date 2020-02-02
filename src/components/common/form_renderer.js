import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import Cleave from 'cleave.js/react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter } from 'react-router-dom';
import MultiSelect from "@khanacademy/react-multi-select";
import { Notifications } from '../common/notification';
import { Typeahead } from 'react-bootstrap-typeahead';
import Card from '../common/card';
import { VIEW_EMPLOYEE_PROFILE } from '../router/routeConstants';
import 'react-bootstrap-typeahead/css/Typeahead.css';


class FormRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            readOnly: this.props.readOnly ? true : false,
            fields: this.props.fields,
            forms: this.props.forms,
            isProcessing: this.props.isProcessing
        };

        // rendering function
        this.preRenderingProcess = this.preRenderingProcess.bind(this);
        this.renderFields = this.renderFields.bind(this);
        this.valueRenderer = this.valueRenderer.bind(this);
        this.renderForms = this.renderForms.bind(this);

        // action button
        this.onTerminate = this.onTerminate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.checkForAnyError = this.checkForAnyError.bind(this);

        // events
        this.handleChange = this.handleChange.bind(this);
        this.handleMultiSelect = this.handleMultiSelect.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.clearDate = this.clearDate.bind(this);

        // validation button
        this.updateFields = this.updateFields.bind(this);
        this.clearFormErrors = this.clearFormErrors.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.updateFields();
        /** PerRendering here ... */
        this.preRenderingProcess();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        var { fields, forms, isProcessing } = newProps;

        this.setState({ fields, forms, isProcessing }, () => {
            this.preRenderingProcess();
        })
    }

    onEdit() {
        this.setState({ readOnly: false });
        this.props.setReadOnly(false);
    }

    updateFields() {
        var fields = this.state.fields;
        for (var i = 0; i < fields.length; i++) {
            if ("value" in fields[i]) {
                fields[i].value = fields[i].value;
            }
            else if (fields[i].type === 'boolean') {
                fields[i].value = false;
            }
            else if (fields[i].type === 'checkbox') {
                fields[i].value = false;
            }
            else if (fields[i].type === 'multiselect') {
                fields[i].value = [];
            }
            else {
                fields[i].value = '';
            }
            fields[i].error = (fields[i].error) ? fields[i].error : ''
        }

        this.setState({ fields });
    }

    clearFormErrors() {
        var fields = this.state.fields;

        fields.map((field, idx) => {
            field['error'] = '';
            return field;
        });

        this.setState({ fields })
    }

    /**
     * Validate Field
     * =================================
     * 
     * @param {*} field update the field according to validation 
     * @param {*} value value of that field
     * 
     * return updated field
     */
    validateField(field, value) {
        const max = Number(field.max);
        const min = Number(field.min);

        // required field must not be empty
        if (field.required && `${value}`.trim() === '') {
            field.error = `This field is Required`;
        }
        else if (`${value}`.trim().length < min) {
            field.error = `Minimum ${min} characters required`;
        }
        else if (`${value}`.trim().length > max) {
            field.error = `Maximum limit is ${max} characters`;
        }
        else {
            field.error = '';
        }

        if (field.pattern) {
            var re = new RegExp(field.pattern);
            if (re.test(value)) {
                field.error = '';
            } else {
                field.error = 'Please enter valid input';
            }
        }

        return field;
    }

    validateSubmit() {
        var fields = this.state.fields;

        fields = fields.map((field, idx) => {
            return this.validateField(field, field['value']);
        })
        this.setState({ fields });
    }

    checkForAnyError() {
        var ret = false;
        var fields = this.state.fields
        for (var idx in fields) {
            if (fields[idx].error !== "") {
                ret = true;
                break;
            }
        }

        return ret
    }

    getList(data) {
        var list = [];
        if (data) {
            data.forEach(element => {
                list.push(element.value);
            });
        }
        return list;
    }

    onSubmit(e) {
        e.preventDefault();

        this.setState({ isError: false }, () => {
            // start fields validation
            this.validateSubmit();
            var __status = this.checkForAnyError();
            var message = "Resolve Errors First!";

            if (__status) {
                Notifications.notify(message, "Error", "error");
            }
            else {
                var fields = this.state.fields;
                var model = {};
                for (var idx in fields) {
                    if (fields[idx].type === "react-multiselect") {
                        model[fields[idx].name] = this.getList(fields[idx].value);
                    }
                    else {
                        model[fields[idx].name] = fields[idx].value;
                    }
                }

                // run the test function which passed as props if there is any
                if (this.props.testSuit) {
                    __status = this.props.testSuit(model)
                    if (!__status.status) {
                        message = __status.msg;
                        Notifications.notify(message, "Error", "error");
                    }
                    else {
                        this.props.submit(model, fields);
                    }
                }
                else {
                    this.props.submit(model, fields);
                }
            }
        })
    }

    onTerminate(link) {
        if (link === VIEW_EMPLOYEE_PROFILE) {
            this.props.history.push({
                pathname: `${link}`,
                empID: `${this.props.location.emp_id}`
            });
        }
        else {
            this.props.history.push(link);
        }
    }

    handleChange(field, e) {
        /**
         * another way to get the field index use following
         *      
         *          const i = e['_dispatchInstances'].key;
         */

        field.value = e.target.value;

        if (field.type == "cleavejs")
            field.value = e.target.rawValue;

        field = this.validateField(field, field.value)


        if (field.value === "" || field.value === null) {
            if (field.onChange) {
                field.onChange(false)
            }
        }
        else {
            if (field.onChange) {
                field.onChange(true)
            }
        }

        if (field.effect) {
            field.effect(field.value);
        }

        // update the fields
        var fields = this.state.fields;
        fields[field.idx] = field
        this.setState({ fields });
    }

    handleChangeNumber(field, e) {
        const regEx = /^(\d+\.?\d*|\d*\.?\d+)$/;
        if (e.target.value === '' || regEx.test(e.target.value)) {
            field.value = e.target.value;

            field = this.validateField(field, field.value)


            if (field.value === "" || field.value === null) {
                if (field.onChange) {
                    field.onChange(false)
                }
            }
            else {
                if (field.onChange) {
                    field.onChange(true)
                }
            }

            if (field.effect) {
                field.effect(field.value);
            }

            // update the fields
            var fields = this.state.fields;
            fields[field.idx] = field
            this.setState({ fields });
        }
    }

    handleChangeNumberNegative(field, e) {
        const regEx = /^(-{1}?(?:([0-9]{0,3}))|([0-9]{1})?(?:([0-9]{0,3})))?(?:\.([0-9]{0,2}))?$/;
        if (e.target.value === '' || regEx.test(e.target.value)) {
            field.value = e.target.value;

            field = this.validateField(field, field.value)


            if (field.value === "" || field.value === null) {
                if (field.onChange) {
                    field.onChange(false)
                }
            }
            else {
                if (field.onChange) {
                    field.onChange(true)
                }
            }

            if (field.effect) {
                field.effect(field.value);
            }

            // update the fields
            var fields = this.state.fields;
            fields[field.idx] = field
            this.setState({ fields });
        }
    }

    handleChangeRadio(field, name, e) {
        /**
         * another way to get the field index use following
         *      
         *          const i = e['_dispatchInstances'].key;
         */


        // update the fields
        var fields = this.state.fields;
        fields[field.idx].value = name;
        this.setState({ fields });
    }

    onChangeCheckbox(field) {
        var fields = this.state.fields;
        fields[field['idx']].value = !fields[field['idx']].value;
        this.setState({ fields });
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

    handleMultiSelect(field, selectedOptions) {
        var fields = this.state.fields;

        if (selectedOptions.length > 0) {
            fields[field['idx']].value = selectedOptions;
            fields[field['idx']] = this.validateField(field, "value");
        }
        else {
            fields[field['idx']].value = [];
            fields[field['idx']] = this.validateField(field, "");
        }

        this.setState({ fields });
    }

    onSelect(field, selected) {
        var value = '';
        var fields = this.state.fields;

        if (selected != null) {
            value = selected.value;
        }

        fields[field['idx']].value = value;
        fields[field['idx']] = this.validateField(field, value);

        if (field.affect) {
            field.onChange(field.value);
        }

        this.setState({ fields })
    }

    onMultiSelect(field, selectedOptions) {
        var fields = this.state.fields;

        if (selectedOptions) {
            fields[field['idx']].value = selectedOptions;
            fields[field['idx']] = this.validateField(field, "value");
        }
        else {
            fields[field['idx']].value = [];
            fields[field['idx']] = this.validateField(field, "");
        }

        this.setState({ fields });
    }

    handleDateChange(field, date) {

        if (field.maxDate) {
            if (date > field.maxDate) {
                var fields = this.state.fields;
                fields[field.idx].value = field.maxDate;
                this.setState({ fields });
            }
            else {
                var fields = this.state.fields;
                fields[field.idx].value = date;
                this.setState({ fields });
            }
        }
        else {
            var fields = this.state.fields;
            fields[field.idx].value = date;
            this.setState({ fields })
        }
    }

    clearDate(field) {
        var fields = this.state.fields;
        fields[field.idx].value = "";

        this.setState({ fields });
    }

    /**
     * Update the Field Keys according to the Form Nature
     * 
     */

    preRenderingProcess() {
        // update the render key in all forms
        var forms = this.state.forms;
        var fields = this.state.fields;

        for (var key in forms) {
            forms[key]['render'] = false;
            forms[key]['readOnly'] = ('readOnly' in forms[key]) ? forms[key]['readOnly'] : false;
        }

        for (var idx in fields) {
            var field = fields[idx];
            field['idx'] = idx;
            if ('show' in field) {
                field['render'] = field['show']
            }
            else {
                field['render'] = ('render' in field) ? field['render'] : true
            }

            field['required'] = ('required' in field) ? field['required'] : field['readOnly']
            field['readOnly'] = ('readOnly' in field) ? field['readOnly'] : forms[field.form]['readOnly']
        }

        for (var i in fields) {
            if (fields[i]['render'] === true) {
                forms[fields[i].form]['render'] = true
            }
        }

        this.setState({ fields, forms })
    }

    /** update the options of that field */
    addValue(field) {
        if (field.isLoading === false) {
            if (field.onAdd) {
                field.onAdd(field.label, field.register_new_option_fx)
            }
        }
    }

    getSelectedOptions(selected) {
        var selectedOptions = [];
        for (var i = 0; i < selected.length; i++) {
            if (typeof (selected[i]) === "string") {
                selectedOptions.push(selected[i]);
            }
            else {
                selectedOptions.push(selected[i]["label"]);
            }
        }

        return selectedOptions;
    }

    onChangeTypeahead(field, selected) {
        var fields = this.state.fields;

        var selectedOptions = this.getSelectedOptions(selected);
        if (selectedOptions.length > 0) {
            fields[field['idx']].value = selectedOptions;
            fields[field['idx']] = this.validateField(field, "value");
        }
        else {
            fields[field['idx']].value = [];
            fields[field['idx']] = this.validateField(field, "");
        }

        this.setState({ fields });
    }

    /**
     * Render Fields 
     * ======================
     * 
     * @param {*} fields List of fields that are going to render
     * @param {*} form  current form name which is going to render
     * @param {*} readOnly  ReadOnly Property of current form
     */
    renderFields(fields, form) {
        var __html = [];
        for (var idx in fields) {
            var field = fields[idx];

            // start rendering here ...
            if (field.render && field.form === form) {
                var fieldValue = (field.value !== null && field.value) ? field.value : "";
                var errorMsg = ('error' in field) ? <span className="form-text text-danger">{ field.error }</span> : '';
                var min = ('min' in field) ? field.min : 0;
                var max = ('max' in field) ? field.max : 256;
                var rows = ('rows' in field) ? field.rows : 6;
                var cols = ('cols' in field) ? field.cols : 50;

                var labelStar = (field.required && !field.readOnly) ? <span className="c-failed" title="Required" style={ { "paddingLeft": "5px" } }>*</span> : "";
                var helperText = field.helpertext;
                var readOnly = field.readOnly;
                var prependText = field.prependText
                var placeholderText = (readOnly) ? "N/A" : field.placeholder;
                var formClass = (readOnly) ? "form-control read-only-form-control" : "form-control"

                if (['input', 'number'].includes(field.type) && readOnly) {
                    field.type = 'label'
                    fieldValue = (field.value === null || field.value === "") ? "N/A" : field.value;
                }

                var element = '';

                if (['input', 'duration', 'comment'].includes(field.type)) {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <input type="text" min={ min } max={ max } key={ field.idx } readOnly={ readOnly } pattern={ field.pattern } className={ formClass } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChange.bind(this, field) } />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === "label") {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <label className={ `${formClass} min-height-36` }>{ fieldValue }</label>
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'email') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <input type="text" min={ min } max={ max } key={ field.idx } readOnly={ readOnly } pattern={ field.pattern } className={ formClass } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChange.bind(this, field) } />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'number') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <input type="text" min={ min } max={ max } key={ field.idx } readOnly={ readOnly } pattern={ field.pattern } className={ formClass } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChangeNumber.bind(this, field) } />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'numberNegative') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <input type="text" min={ min } max={ max } key={ field.idx } readOnly={ readOnly } pattern={ field.pattern } className={ formClass } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChangeNumberNegative.bind(this, field) } />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'number') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <input type="number" min={ min } max={ max } key={ field.idx } readOnly={ readOnly } pattern={ field.pattern } className={ formClass } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChange.bind(this, field) } />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'password') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <input type="password" min={ min } max={ max } key={ field.idx } readOnly={ readOnly } className={ formClass } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChange.bind(this, field) } />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === "textarea") {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <textarea type="text" rows={ rows } cols={ cols } key={ field.idx } readOnly={ readOnly } className={ formClass } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChange.bind(this, field) }  >
                                    </textarea>
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'prepend') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float form-group-feedback form-group-feedback-right">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="position-relative">
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text prepend-id"> { prependText } </span>
                                        </span>
                                        <input type="text" min={ min } max={ max } key={ field.idx } readOnly={ readOnly } className={ `${formClass} input-pl` } placeholder={ placeholderText } name={ field.name } value={ fieldValue } onChange={ this.handleChange.bind(this, field) } />
                                    </div>
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )

                }
                else if (field.type === 'date2') {
                    fieldValue = (fieldValue === "" || fieldValue === null) ? null : new Date(fieldValue);
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <DatePicker
                                        className={ formClass }
                                        readOnly={ readOnly }
                                        key={ field.idx }
                                        autoComplete="off"
                                        name={ field.name }
                                        placeholder={ placeholderText }
                                        selected={ fieldValue }
                                        onChange={ this.handleDateChange.bind(this, field) }
                                        maxDate={ field.maxDate }
                                        minDate={ field.minDate }
                                        dateFormat="dd-MMM-yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }

                else if (field.type === 'date') {
                    fieldValue = (fieldValue === "" || fieldValue === null) ? null : new Date(fieldValue);
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group">
                                <label className="font-weight-semibold">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <DatePicker
                                    className={ formClass }
                                    readOnly={ readOnly }
                                    key={ field.idx }
                                    autoComplete="off"
                                    name={ field.name }
                                    placeholderText={ placeholderText }
                                    selected={ fieldValue }
                                    onChange={ this.handleDateChange.bind(this, field) }
                                    maxDate={ field.maxDate }
                                    minDate={ field.minDate }
                                    dateFormat="dd-MMM-yyyy"
                                    peekNextMonth
                                    showMonthDropdown={ ('showMonthDropdown' in field) ? field.showMonthDropdown : true }
                                    showYearDropdown={ ('showYearDropdown' in field) ? field.showYearDropdown : true }
                                    dropdownMode="select"
                                    excludeDates={ field.excludeDates }
                                    highlightDates={ field.highlightDates }
                                    filterDate={ field.filterDate }
                                />
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'cleavejs') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <div className="form-group-feedback form-group-feedback-right">
                                    <Cleave
                                        name={ field.name }
                                        key={ field.idx }
                                        type="cleavejs"
                                        readOnly={ readOnly }
                                        className={ formClass }
                                        placeholder={ placeholderText }
                                        options={ field.options }
                                        value={ fieldValue }
                                        onChange={ this.handleChange.bind(this, field) }
                                        min={ min }
                                        max={ max }
                                    />
                                </div>
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'typeahead') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group">
                                <label className="font-weight-semibold">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <Typeahead
                                    id="typeahead"
                                    allowNew={ true }
                                    multiple={ true }
                                    defaultSelected={ fieldValue }
                                    newSelectionPrefix="Add a new email: "
                                    onChange={ this.onChangeTypeahead.bind(this, field) }
                                    options={ [] }
                                    placeholder={ field.placeholder }
                                    selectHintOnEnter={ true }
                                />
                                { errorMsg }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'radio') {
                    var __child = [];

                    for (var i in field.options) {
                        var option = field.options[i];
                        if (!option.disable) {
                            __child.push(
                                <div key={ i } className="form-check custom-control-inline">
                                    <label className="form-check-label">
                                        <div className="uniform-choice border-info-600 text-info-800">
                                            <span className={ (option.checked) ? "checked" : "unchecked" }>
                                                <input type="radio" className="form-check-input-styled" value={ option.value } name="radio-inline-left" onChange={ option.onChange } data-fouc="" />
                                            </span>
                                        </div>
                                        { option.label }
                                    </label>
                                </div>
                            )
                        }
                    }

                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group">
                                { __child }
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'select') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group">
                                <label className="font-weight-semibold">
                                    { field.label }{ labelStar }
                                    <span className="text-muted">
                                        { helperText }
                                    </span>
                                </label>
                                {
                                    (field.register_new_option) ?
                                        <span title={ "Add " + field.label } className={ field.isLoading ? "badge badge-primary bg-theme ml-2 make-blur" : "badge badge-primary bg-theme ml-2 c-hand" } onClick={ this.addValue.bind(this, field) }>
                                            <i className="fa fa-plus"></i>
                                        </span> : ""
                                }

                                <div className="form-group">
                                    <Select
                                        isDisabled={ readOnly }
                                        name={ field.name }
                                        key={ field.idx }
                                        valueKey="value"
                                        labelKey="label"
                                        value={ field.options.find(option => option.value === fieldValue) }
                                        placeholder={ placeholderText }
                                        onChange={ this.onSelect.bind(this, field) }
                                        options={ field.options }
                                        isClearable={ field.clearable }
                                        isLoading={ field.isLoading }
                                    />
                                    { errorMsg }
                                </div>
                            </div>
                        </div >
                    )
                }
                else if (field.type === 'react-multiselect') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group">
                                <label className="font-weight-semibold">
                                    { field.label }{ labelStar }
                                    <span className="text-muted">
                                        { helperText }
                                    </span>
                                </label>
                                {
                                    (field.register_new_option) ?
                                        <span title={ "Add " + field.label } className={ field.isLoading ? "badge badge-primary bg-theme ml-2 make-blur" : "badge badge-primary bg-theme ml-2 c-hand" } onClick={ this.addValue.bind(this, field) }>
                                            <i className="fa fa-plus"></i>
                                        </span> : ""
                                }

                                <div className="form-group">
                                    <Select
                                        isDisabled={ readOnly }
                                        name={ field.name }
                                        key={ field.idx }
                                        valueKey="value"
                                        labelKey="label"
                                        value={ fieldValue }
                                        placeholder={ placeholderText }
                                        onChange={ this.onMultiSelect.bind(this, field) }
                                        options={ field.options }
                                        isMulti={ true }
                                        isClearable={ field.clearable }
                                        isLoading={ field.isLoading }
                                        closeMenuOnSelect={ false }
                                    />
                                    { errorMsg }
                                </div>
                            </div>
                        </div>
                    )
                }
                else if (field.type === 'multiselect') {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-group form-group-float">
                                <label className="form-group-float-label font-weight-semibold animate is-visible">{ field.label }{ labelStar }<span className="text-muted">{ helperText }</span></label>
                                <MultiSelect
                                    className="c-"
                                    key={ field.idx }
                                    name={ field.name }
                                    disabled={ readOnly }
                                    options={ field.options }
                                    selected={ fieldValue }
                                    onSelectedChanged={ this.handleMultiSelect.bind(this, field) }
                                    valueRenderer={ this.valueRenderer.bind(this, fieldValue, field.options, field.placeholder) }
                                    selectAllLabel={ "Select All" }
                                    isLoading={ false }
                                    disableSearch={ false }
                                />
                                { errorMsg }
                            </div>
                        </div>
                    )
                }

                else if (field.type === "checkbox") {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div>
                                <div className="form-check float-left mt-1">
                                    <label className="form-check-label">
                                        <div className="uniform-checker border-indigo-600 text-indigo-800 checkbox-theme">
                                            <span className={ fieldValue ? "checked" : "" }>
                                                <input type="checkbox" className="form-check-input-styled-custom" onChange={ this.onChangeCheckbox.bind(this, field) } />
                                            </span>
                                        </div>
                                        { field.label }
                                    </label>
                                </div>
                            </div>
                        </div>
                    )
                }

                else if (field.type === "dashboard") {
                    element = (
                        <Fragment key={ "field-" + idx }>
                            <div className="col-md-12 mb-2">
                                <div className="form-check custom-control-inline">
                                    <label className="form-check-label">
                                        <div className="uniform-choice border-info-600 text-info-800"><span className={ fieldValue === "employee" ? "checked" : "" }><input type="radio" onChange={ this.handleChangeRadio.bind(this, field, "employee") } name="radio-styled-color" className="form-check-input-styled-warning" data-fouc="" /></span></div>
                                        Personal Details
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-12 mb-2">
                                <div className="form-check custom-control-inline">
                                    <label className="form-check-label">
                                        <div className="uniform-choice border-info-600 text-info-800"><span className={ fieldValue === "admin" ? "checked" : "" }><input type="radio" onChange={ this.handleChangeRadio.bind(this, field, "admin") } name="radio-styled-color" className="form-check-input-styled-custom" data-fouc="" /></span></div>
                                        Team Details
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-12 mb-2">
                                <div className="form-check custom-control-inline">
                                    <label className="form-check-label">
                                        <div className="uniform-choice border-info-600 text-info-800"><span className={ fieldValue === "domainhead" ? "checked" : "" }><input type="radio" onChange={ this.handleChangeRadio.bind(this, field, "domainhead") } name="radio-styled-color" className="form-check-input-styled-info" data-fouc="" /></span></div>
                                        Team Details with Full Authorization i.e.<code>Leaves Approval/Rejection</code>
                                    </label>
                                </div>
                            </div>
                        </Fragment>
                    )
                }

                else if (field.type === "radio2btn") {
                    element = (
                        <div key={ "field-" + idx } className={ field.size }>
                            <div className="form-check custom-control-inline">
                                <label className="form-check-label">
                                    <div className="uniform-choice border-info-600 text-info-800"><span className={ fieldValue === "admin" ? "checked" : "" }><input type="radio" onChange={ this.handleChangeRadio.bind(this, field, "admin") } name="radio-styled-color" className="form-check-input-styled-warning" data-fouc="" /></span></div>
                                    Mark by Admin
                                </label>
                            </div>

                            <div className="form-check custom-control-inline">
                                <label className="form-check-label">
                                    <div className="uniform-choice border-info-600 text-info-800"><span className={ fieldValue === "employee" ? "checked" : "" }><input type="radio" onChange={ this.handleChangeRadio.bind(this, field, "employee") } name="radio-styled-color" className="form-check-input-styled-info" data-fouc="" /></span></div>
                                    Mark by Employee
                                </label>
                            </div>
                        </div>
                    )
                }

                __html.push(element);
            }
        }
        return __html
    }

    renderForms(buttons) {
        const getForms = this.state.forms;

        var forms = [];
        for (var form in getForms) {
            if (getForms[form]['render']) {
                /**
                 * If this.form has any field or at least have one field with render === true
                 */

                var __html = ""
                if (this.props.showHeader) {
                    __html =
                        <Card key={ getForms[form].name } collapse={ this.props.collapse } header={ getForms[form].name } cardClass={ getForms[form].cardClass } headerClass="bg-white">
                            <div className="row">
                                { this.renderFields(this.state.fields, form) }
                            </div>
                            { buttons }
                        </Card>
                }
                else {
                    __html =
                        <Card key={ getForms[form].name } showHeader={ false } cardClass={ getForms[form].cardClass }>
                            <div className="row">
                                { this.renderFields(this.state.fields, form) }
                            </div>
                            { buttons }
                        </Card>
                }

                forms.push(__html)
            }
        }

        return forms;
    }

    render() {
        var button = "";
        var terminateButton = "";

        if (this.props.showBtn) {
            var icon = <i className="icon-spinner2 spinner mr-2"></i>;
            button = <div className="text-right ml-2">
                <button className="btn btn-theme fw" disabled={ this.state.isProcessing } onClick={ this.onSubmit.bind(this) }>{ this.state.isProcessing ? icon : '' }{ this.props.successBtnName }</button>
            </div>

            if (this.props.closeBtn) {
                terminateButton = <div className="col-md-2">
                    <button className={ "btn btn-secondary fw" } disabled={ this.state.isProcessing } onClick={ this.onTerminate.bind(this, this.props.link) }>{ (this.state.isProcessing) ? <i className='icon-spinner2 spinner'></i> : this.props.closeBtnName }</button>
                </div>
            }
        }

        var __buttons = <div className={ `row ${this.props.buttonsContainerClass}` }>
            { terminateButton }
            { button }
        </div>

        var __html = (this.props.onCardBtns) ?
            <Fragment>
                { this.renderForms(__buttons) }
            </Fragment>
            :
            <Fragment>
                { this.renderForms("") }
                { __buttons }
            </Fragment>


        return (
            __html
        );
    }
}

export default withRouter(FormRenderer);

FormRenderer.defaultProps = {
    showHeader: true,
    successBtnName: "Add",
    closeBtnName: "Cancel",
    showBtn: true,
    closeBtn: true,
    successBtn: true,
    onCardBtns: false,
    testSuit: null,
    collapse: false,
    buttonsContainerClass: "",
    isProcessing: false
};
