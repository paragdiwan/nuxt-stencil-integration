// @ts-nocheck
// It's easier and safer for Volar to disable typechecking and let the return type inference do its job.
import { defineComponent, getCurrentInstance, h, inject, ref, withDirectives } from 'vue';
const UPDATE_VALUE_EVENT = 'update:modelValue';
const MODEL_VALUE = 'modelValue';
const ROUTER_LINK_VALUE = 'routerLink';
const NAV_MANAGER = 'navManager';
const ROUTER_PROP_PREFIX = 'router';
const ARIA_PROP_PREFIX = 'aria';
/**
 * Starting in Vue 3.1.0, all properties are
 * added as keys to the props object, even if
 * they are not being used. In order to correctly
 * account for both value props and v-model props,
 * we need to check if the key exists for Vue <3.1.0
 * and then check if it is not undefined for Vue >= 3.1.0.
 * See https://github.com/vuejs/vue-next/issues/3889
 */
const EMPTY_PROP = Symbol();
const DEFAULT_EMPTY_PROP = { default: EMPTY_PROP };
const getComponentClasses = (classes) => {
    return (classes === null || classes === void 0 ? void 0 : classes.split(' ')) || [];
};
const getElementClasses = (ref, componentClasses, defaultClasses = []) => {
    var _a;
    return [...Array.from(((_a = ref.value) === null || _a === void 0 ? void 0 : _a.classList) || []), ...defaultClasses].filter((c, i, self) => !componentClasses.has(c) && self.indexOf(c) === i);
};
/**
 * Create a callback to define a Vue component wrapper around a Web Component.
 *
 * @prop name - The component tag name (i.e. `ion-button`)
 * @prop componentProps - An array of properties on the
 * component. These usually match up with the @Prop definitions
 * in each component's TSX file.
 * @prop customElement - An option custom element instance to pass
 * to customElements.define. Only set if `includeImportCustomElements: true` in your config.
 * @prop modelProp - The prop that v-model binds to (i.e. value)
 * @prop modelUpdateEvent - The event that is fired from your Web Component when the value changes (i.e. ionChange)
 */
export const defineContainer = (name, defineCustomElement, componentProps = [], modelProp, modelUpdateEvent) => {
    /**
     * Create a Vue component wrapper around a Web Component.
     * Note: The `props` here are not all properties on a component.
     * They refer to whatever properties are set on an instance of a component.
     */
    if (defineCustomElement !== undefined) {
        defineCustomElement();
    }
    const Container = defineComponent((props, { attrs, slots, emit }) => {
        var _a;
        let modelPropValue = props[modelProp];
        const containerRef = ref();
        const classes = new Set(getComponentClasses(attrs.class));
        /**
         * This directive is responsible for updating any reactive
         * reference associated with v-model on the component.
         * This code must be run inside of the "created" callback.
         * Since the following listener callbacks as well as any potential
         * event callback defined in the developer's app are set on
         * the same element, we need to make sure the following callbacks
         * are set first so they fire first. If the developer's callback fires first
         * then the reactive reference will not have been updated yet.
         */
        const vModelDirective = {
            created: (el) => {
                const eventsNames = Array.isArray(modelUpdateEvent) ? modelUpdateEvent : [modelUpdateEvent];
                eventsNames.forEach((eventName) => {
                    el.addEventListener(eventName.toLowerCase(), (e) => {
                        modelPropValue = (e === null || e === void 0 ? void 0 : e.target)[modelProp];
                        emit(UPDATE_VALUE_EVENT, modelPropValue);
                    });
                });
            },
        };
        const currentInstance = getCurrentInstance();
        const hasRouter = (_a = currentInstance === null || currentInstance === void 0 ? void 0 : currentInstance.appContext) === null || _a === void 0 ? void 0 : _a.provides[NAV_MANAGER];
        const navManager = hasRouter ? inject(NAV_MANAGER) : undefined;
        const handleRouterLink = (ev) => {
            const { routerLink } = props;
            if (routerLink === EMPTY_PROP)
                return;
            if (navManager !== undefined) {
                let navigationPayload = { event: ev };
                for (const key in props) {
                    const value = props[key];
                    if (props.hasOwnProperty(key) && key.startsWith(ROUTER_PROP_PREFIX) && value !== EMPTY_PROP) {
                        navigationPayload[key] = value;
                    }
                }
                navManager.navigate(navigationPayload);
            }
            else {
                console.warn('Tried to navigate, but no router was found. Make sure you have mounted Vue Router.');
            }
        };
        return () => {
            modelPropValue = props[modelProp];
            getComponentClasses(attrs.class).forEach((value) => {
                classes.add(value);
            });
            const oldClick = props.onClick;
            const handleClick = (ev) => {
                if (oldClick !== undefined) {
                    oldClick(ev);
                }
                if (!ev.defaultPrevented) {
                    handleRouterLink(ev);
                }
            };
            let propsToAdd = {
                ref: containerRef,
                class: getElementClasses(containerRef, classes),
                onClick: handleClick,
            };
            /**
             * We can use Object.entries here
             * to avoid the hasOwnProperty check,
             * but that would require 2 iterations
             * where as this only requires 1.
             */
            for (const key in props) {
                const value = props[key];
                if ((props.hasOwnProperty(key) && value !== EMPTY_PROP) || key.startsWith(ARIA_PROP_PREFIX)) {
                    propsToAdd[key] = value;
                }
            }
            if (modelProp) {
                /**
                 * If form value property was set using v-model
                 * then we should use that value.
                 * Otherwise, check to see if form value property
                 * was set as a static value (i.e. no v-model).
                 */
                if (props[MODEL_VALUE] !== EMPTY_PROP) {
                    propsToAdd = Object.assign(Object.assign({}, propsToAdd), { [modelProp]: props[MODEL_VALUE] });
                }
                else if (modelPropValue !== EMPTY_PROP) {
                    propsToAdd = Object.assign(Object.assign({}, propsToAdd), { [modelProp]: modelPropValue });
                }
            }
            /**
             * vModelDirective is only needed on components that support v-model.
             * As a result, we conditionally call withDirectives with v-model components.
             */
            const node = h(name, propsToAdd, slots.default && slots.default());
            return modelProp === undefined ? node : withDirectives(node, [[vModelDirective]]);
        };
    });
    if (typeof Container !== 'function') {
        Container.name = name;
        Container.props = {
            [ROUTER_LINK_VALUE]: DEFAULT_EMPTY_PROP,
        };
        componentProps.forEach((componentProp) => {
            Container.props[componentProp] = DEFAULT_EMPTY_PROP;
        });
        if (modelProp) {
            Container.props[MODEL_VALUE] = DEFAULT_EMPTY_PROP;
            Container.emits = [UPDATE_VALUE_EVENT];
        }
    }
    return Container;
};
//# sourceMappingURL=utils.js.map