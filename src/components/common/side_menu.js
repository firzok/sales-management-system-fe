import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from "lodash";

import { connect } from "react-redux";
import { naver } from './side_menu_mapper'
import { LOAD_LOGOUT } from '../router/routeConstants';
import { localPermissions, defaultPermissionsList } from '../../config/static_lists';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

var $ = window.$;

class SideMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nav_items: [],
            render_key: "__render__",
            fa_icon: "fa_icon",
        }

        // for getting the current path
        this.checkCurrentURL = this.checkCurrentURL.bind(this);

        // for building side menu dictionary according to the user permission
        this.__build_render_dictionary = this.__build_render_dictionary.bind(this);

        // rendering side menu item from the dictionary
        this.__render = this.__render.bind(this);
        this.__render_single = this.__render_single.bind(this);
        this.__render_group = this.__render_group.bind(this);
        this.__render_dictionary = this.__render_dictionary.bind(this);

        // rendering user card on side menu
        this.__render_mobile_navigator = this.__render_mobile_navigator.bind(this);
    }

    componentDidMount() {
        /**
         * JQUERY CODE
         * ---------------
         * required because all items of side bar required jquery event which trigger only click of that item
         */

        // Define default class names and options
        var navClass = 'nav-sidebar',
            navItemClass = 'nav-item',
            navItemOpenClass = 'nav-item-open',
            navLinkClass = 'nav-link',
            navSubmenuClass = 'nav-group-sub',
            navSlidingSpeed = 250;

        // Configure collapsible functionality
        $('.' + navClass).each(function () {
            $(this).find('.' + navItemClass).has('.' + navSubmenuClass).children('.' + navItemClass + ' > ' + '.' + navLinkClass).not('.disabled').on('click', function (e) {
                e.preventDefault();

                // Simplify stuff
                var $target = $(this),
                    $navSidebarMini = $('.sidebar-xs').not('.sidebar-mobile-main').find('.sidebar-main .' + navClass).children('.' + navItemClass);

                // Collapsible
                if ($target.parent('.' + navItemClass).hasClass(navItemOpenClass)) {
                    $target.parent('.' + navItemClass).not($navSidebarMini).removeClass(navItemOpenClass).children('.' + navSubmenuClass).slideUp(navSlidingSpeed);
                }
                else {
                    $target.parent('.' + navItemClass).not($navSidebarMini).addClass(navItemOpenClass).children('.' + navSubmenuClass).slideDown(navSlidingSpeed);
                }

                // Accordion
                if ($target.parents('.' + navClass).data('nav-type') == 'accordion') {
                    $target.parent('.' + navItemClass).not($navSidebarMini).siblings(':has(.' + navSubmenuClass + ')').removeClass(navItemOpenClass).children('.' + navSubmenuClass).slideUp(navSlidingSpeed);
                }
            });
        });

        // Disable click in disabled navigation items
        $(document).on('click', '.' + navClass + ' .disabled', function (e) {
            e.preventDefault();
        });

        // Scrollspy navigation
        $('.nav-scrollspy').find('.' + navItemClass).has('.' + navSubmenuClass).children('.' + navItemClass + ' > ' + '.' + navLinkClass).off('click');

        // Prevent dropdown from closing on click
        $(document).on('click', '.dropdown-content', function (e) {
            e.stopPropagation();
        });

        // Disabled links
        $('.navbar-nav .disabled a, .nav-item-levels .disabled').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // Show tabs inside dropdowns
        $('.dropdown-content a[data-toggle="tab"]').on('click', function (e) {
            $(this).tab('show');
        });
    }

    getPermissions(serverPermissions) {
        var finalPermission = [];

        localPermissions.map((permission, idx) => {
            serverPermissions.map((serverPermission, idx) => {
                if (permission === serverPermission) {
                    finalPermission.push(serverPermission);
                }
            })
        });

        return finalPermission;
    }

    checkCurrentURL() {
        var _location = this.props.location;
        var _path = _location.pathname.split('/');

        var activation = {}

        if (_path.length > 2) {
            activation['whoIsOpen'] = _path[1]
            activation['whoIsActive'] = '/' + _path[2]
        }
        else {
            activation['whoIsOpen'] = _path[1]
            activation['whoIsActive'] = '/' + _path[1]
        }

        return activation;
    }

    /**
     * Buidling Side Menu Struture Before rendering
     * ----------------------------------------------
     * defining structure
     * 
     * gettting user permission
     * 
     * getting the permissable side Menu Items
     * 
     */
    __build_render_dictionary() {
        if (!_.isEmpty(this.props.activeUser.user)) {
            // rearranging permission according to the groups

            // building an empty init dictionary with render:False in all keys
            var final_renderer = {};
            var render_key = this.state.render_key;

            for (var key in naver) {
                final_renderer[key] = { [render_key]: false, [this.state.fa_icon]: naver[key]['fa_icon'] }
            }
            var serverPermissions = this.props.activeUser.user.permissions
            var permission = this.getPermissions(serverPermissions);

            if (permission.length != 0) {
                for (var i = 0; i < permission.length; i++) {
                    var elem = permission[i].split('/');
                    var parent = '/' + elem[1];
                    var getDetails = naver[parent];

                    // if that permission is renderable
                    if (getDetails) {
                        var getChildren = Object.keys(getDetails);
                        var count = getChildren.length;

                        if (count == 2) {
                            var temp = Object.keys(naver[parent]);
                            if (temp[0] != "fa_icon") {
                                final_renderer[parent][temp[0]] = naver[parent][temp[0]]
                            }
                            else {
                                final_renderer[parent][temp[1]] = naver[parent][temp[1]]
                            }
                            final_renderer[parent][render_key] = true
                        }
                        else {
                            final_renderer[parent][temp[1]] = naver[parent][temp[1]]
                        }
                        final_renderer[parent][render_key] = true
                    }
                    else {
                        var child_name = "/";
                        if (elem[2])
                            child_name = '/' + elem[2];
                        var child_details = naver[parent][child_name]
                        // if that sub permission is renderable
                        if (child_details) {
                            final_renderer[parent][child_name] = child_details
                            final_renderer[parent][render_key] = true
                        }
                    }
                }
            }
            return final_renderer;
        }
        // }
    }

    /**
     * 
     * Render Function only for Single Side Menu Item
     *  
     * @param {any} object      containing side Menu renderring information 
     * @param {string} _key     unique key of that item
     */
    __render(object, _key, whoIsOpen, whoIsActive, isGroup = false) {

        var active = whoIsActive;

        if (whoIsOpen && '/' + whoIsOpen != whoIsActive) {
            active = '/' + whoIsOpen + whoIsActive;
            if (active.slice(-1) == '/') {
                active = active.slice(0, -1);
            }
        }
        let ItemText = "";
        let itemIcon = "";
        if (isGroup) {
            ItemText = object['name'];
        }
        else {
            itemIcon = <div style={ { width: '20px' } }><FontAwesomeIcon icon={ object['fa_icon'] } className={ `side-menu_icon` } /></div>;
            ItemText = <span className="ml-2">{ object['name'] }</span>;
        }

        var isActive = (active == object['url']);
        if (object['url'] == "/" && active == "/dashboard") {
            isActive = true;
        }

        return (
            <li key={ `${object['name']}${_key}` } className="nav-item">
                <Link to={ object['url'] } className={ isActive ? `nav-link active` : `nav-link` }>
                    { itemIcon }
                    { ItemText }
                </Link>
            </li>
        );
    }

    /**
     * Render function for singular dictionary
     * 
     * @param {any} dictionary      dictionary containing group of child :: Side Menu item (single)
     */
    __render_single(dictionary, whoIsOpen, whoIsActive) {
        /*
        ** contain only single child
        ** special key :: this.state.render_key decided either to render or not
        */

        if (dictionary[this.state.render_key]) {
            delete dictionary[this.state.render_key];
            delete dictionary[this.state.fa_icon];

            var __html = [];

            for (var key in dictionary) {
                __html.push(this.__render(dictionary[key], key, whoIsOpen, whoIsActive))
            }

            return __html;
        }

        return;
    }

    /**
     * 
     * render for rendering sub Side Menu items
     * 
     * @param {any} dictionary       containing group :: multiple items
     * @param {any} Name             Name of the group
     */
    __render_group(dictionary, Name, whoIsOpen, whoIsActive) {

        //console.log('open : ', whoIsOpen);
        //console.log('active : ', whoIsActive);

        let openClass = "";
        let activeClass = "";
        if (Name == whoIsOpen) {
            openClass = 'nav-item-open nav-item-expanded';
            activeClass = 'active';
        }

        // contains multiples childs
        var keys = Object.keys(dictionary);
        var textCapitalize = true;

        if (Name === "users") {
            Name = "Employees";
            textCapitalize = false;
        }
        else if (Name === "ai-reports") {
            Name = "AI Reports";
            textCapitalize = false;
        }
        else {
            Name = Name.replace('-', ' ');
            textCapitalize = true;
        }

        if (dictionary[this.state.render_key]) {
            var FI = dictionary[this.state.fa_icon];

            delete dictionary[this.state.render_key];
            delete dictionary[this.state.fa_icon];

            var _bool = false;

            var _keys = Object.keys(dictionary);
            // _keys = _keys.sort();
            let isGroup = true;
            var __html = <li key={ Name } className={ `nav-item nav-item-submenu ${openClass}` }>
                <Link to={ `#` } className={ `nav-link ${activeClass}` }>
                    <div style={ { width: '20px' } }><i className={ `${FI} side-menu_icon` } aria-hidden="true"> </i></div>
                    <span className={ textCapitalize ? "text-capitalize sidemenu-text ml-2" : "sidemenu-text ml-2" }> { Name } </span>
                </Link>
                <ul className="nav nav-group-sub text-capitalize" data-submenu-title={ Name }>
                    {
                        _keys.map((key, counter) => {
                            return this.__render(dictionary[key], key, whoIsOpen, whoIsActive, isGroup)
                        })
                    }
                </ul>
            </li>


            return __html;
        }

        return;
    }

    /**
     * 
     * Rendering dictionary depending upon the grouping or single item
     * 
     * @param {any} final_dictionary    final dictionary containing the final Side Menu in a defined structure
     */
    __render_dictionary(final_dictionary, whoIsOpen, whoIsActive) {
        var __html = []

        var _keys = Object.keys(final_dictionary);
        for (var i = 0; i < _keys.length; i++) {
            // var sub_keys = Object.keys(final_dictionary[_keys[i]]).sort();
            var sub_keys = Object.keys(final_dictionary[_keys[i]]);
            if (sub_keys.length > 3) {
                __html.push(this.__render_group(final_dictionary[_keys[i]], _keys[i].split('/')[1], whoIsOpen, whoIsActive));
            }
            else {
                __html.push(this.__render_single(final_dictionary[_keys[i]], whoIsOpen, whoIsActive));
            }
        }

        return __html
    }

    /**
     *  Display the navigator when mobile view is activated
     */
    __render_mobile_navigator() {
        return (
            <div className="sidebar-mobile-toggler text-center text-grey-800">
                <a href="#" className="sidebar-mobile-main-toggle">
                    <i className="icon-arrow-left8"></i>
                </a>
                Navigation
				<a href="#" className="sidebar-mobile-expand">
                    <i className="icon-screen-full"></i>
                    <i className="icon-screen-normal"></i>
                </a>
            </div>
        );
    }

    /**
     *  Rendering the User card and their corresponding actions on side menu
     */
    __render_user_card() {
        return (
            <div className="sidebar-user">
                <div className="card-body">
                    <div className="media">

                        <div className="media-body">
                            <div className="text-theme media-title font-weight-semibold">{ this.props.activeUser.user.first_name }</div>
                            <div className="text-theme font-size-xs opacity-50">
                                { this.props.activeUser.user.role }
                            </div>
                        </div>

                        <div className="ml-3 align-self-center">
                            <a href="#" className="text-theme" title="Profile Setting"><i className="icon-cog3"></i></a>
                            <a href="#" className="text-theme ml-3" title="Lock Screen"><i className="icon-user-lock"></i></a>
                            <a href={ LOAD_LOGOUT } className="text-theme ml-3" title="Logout"><i className="icon-switch2"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     *  Main render Function
     * --------------------------------------------------------------------------------
     * 
     * Then rearranging the user permission according to the standard template
     * 
     * Then Render the dictionary build in the previous step
     */
    render() {

        var final_dictionary = this.__build_render_dictionary();
        var __html = <div></div>
        var activation = this.checkCurrentURL();

        var whoIsActive = activation['whoIsActive'];
        var whoIsOpen = activation['whoIsOpen'];

        if (!_.isEmpty(final_dictionary))
            __html = this.__render_dictionary(final_dictionary, whoIsOpen, whoIsActive)

        return (
            <div className="sidebar sidebar-light sidebar-main sidebar-fixed sidebar-expand-md noprint">

                { this.__render_mobile_navigator() }

                <div className="sidebar-content side-menu-zIndex">

                    <div className="card card-sidebar-mobile">
                        <ul className="nav nav-sidebar" data-nav-type="accordion">
                            <li className="nav-item-header">
                                <div className="text-uppercase font-size-xs line-height-xs text-grey-800">Navigation</div>
                                <i className="icon-menu" title="Navigation"></i>
                            </li>

                            { __html }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ activeUser }) {
    return { activeUser }
}

export default connect(mapStateToProps)(withRouter(SideMenu));