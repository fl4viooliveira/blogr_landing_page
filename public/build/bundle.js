
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Header.svelte generated by Svelte v3.37.0 */

    const file$1 = "src/Header.svelte";

    function create_fragment$1(ctx) {
    	let div5;
    	let nav;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let ul;
    	let li0;
    	let a6;
    	let t3;
    	let img3;
    	let img3_src_value;
    	let t4;
    	let div0;
    	let a3;
    	let t6;
    	let a4;
    	let t8;
    	let a5;
    	let t10;
    	let li1;
    	let a10;
    	let t11;
    	let img4;
    	let img4_src_value;
    	let t12;
    	let div1;
    	let a7;
    	let t14;
    	let a8;
    	let t16;
    	let a9;
    	let t18;
    	let li2;
    	let a14;
    	let t19;
    	let img5;
    	let img5_src_value;
    	let t20;
    	let div2;
    	let a11;
    	let t22;
    	let a12;
    	let t24;
    	let a13;
    	let t26;
    	let div3;
    	let button0;
    	let a15;
    	let t28;
    	let button1;
    	let a16;
    	let t30;
    	let main;
    	let h1;
    	let t32;
    	let p;
    	let t34;
    	let div4;
    	let button2;
    	let a17;
    	let t36;
    	let button3;
    	let a18;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			nav = element("nav");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t1 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a6 = element("a");
    			t3 = text("Product");
    			img3 = element("img");
    			t4 = space();
    			div0 = element("div");
    			a3 = element("a");
    			a3.textContent = "Product 1";
    			t6 = space();
    			a4 = element("a");
    			a4.textContent = "Product 2";
    			t8 = space();
    			a5 = element("a");
    			a5.textContent = "Product 3";
    			t10 = space();
    			li1 = element("li");
    			a10 = element("a");
    			t11 = text("Company");
    			img4 = element("img");
    			t12 = space();
    			div1 = element("div");
    			a7 = element("a");
    			a7.textContent = "Company 1";
    			t14 = space();
    			a8 = element("a");
    			a8.textContent = "Company 2";
    			t16 = space();
    			a9 = element("a");
    			a9.textContent = "Company 3";
    			t18 = space();
    			li2 = element("li");
    			a14 = element("a");
    			t19 = text("Connect");
    			img5 = element("img");
    			t20 = space();
    			div2 = element("div");
    			a11 = element("a");
    			a11.textContent = "Contact";
    			t22 = space();
    			a12 = element("a");
    			a12.textContent = "Newsletter";
    			t24 = space();
    			a13 = element("a");
    			a13.textContent = "Linkedin";
    			t26 = space();
    			div3 = element("div");
    			button0 = element("button");
    			a15 = element("a");
    			a15.textContent = "Login";
    			t28 = space();
    			button1 = element("button");
    			a16 = element("a");
    			a16.textContent = "Sign Up";
    			t30 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "A modern publishing platform";
    			t32 = space();
    			p = element("p");
    			p.textContent = "Grow your audience and build your online brand";
    			t34 = space();
    			div4 = element("div");
    			button2 = element("button");
    			a17 = element("a");
    			a17.textContent = "Start for Free";
    			t36 = space();
    			button3 = element("button");
    			a18 = element("a");
    			a18.textContent = "Learn More";
    			if (img0.src !== (img0_src_value = "../images/logo.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "logo");
    			attr_dev(img0, "class", "svelte-1c663ja");
    			add_location(img0, file$1, 7, 12, 174);
    			attr_dev(a0, "href", "#0");
    			attr_dev(a0, "class", "logo svelte-1c663ja");
    			add_location(a0, file$1, 6, 8, 135);
    			if (img1.src !== (img1_src_value = "../images/icon-hamburger.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "hamburger");
    			attr_dev(img1, "class", "svelte-1c663ja");
    			add_location(img1, file$1, 10, 12, 281);
    			attr_dev(a1, "href", "#0");
    			attr_dev(a1, "class", "hamburger svelte-1c663ja");
    			add_location(a1, file$1, 9, 8, 237);
    			if (img2.src !== (img2_src_value = "../images/icon-close.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "close");
    			attr_dev(img2, "class", "svelte-1c663ja");
    			add_location(img2, file$1, 13, 12, 407);
    			attr_dev(a2, "href", "#0");
    			attr_dev(a2, "class", "close svelte-1c663ja");
    			add_location(a2, file$1, 12, 8, 367);
    			if (img3.src !== (img3_src_value = "../images/icon-arrow-light.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "arrow");
    			attr_dev(img3, "class", "svelte-1c663ja");
    			add_location(img3, file$1, 17, 52, 566);
    			attr_dev(a3, "href", "#0");
    			attr_dev(a3, "class", "svelte-1c663ja");
    			add_location(a3, file$1, 19, 24, 696);
    			attr_dev(a4, "href", "#0");
    			attr_dev(a4, "class", "svelte-1c663ja");
    			add_location(a4, file$1, 20, 24, 747);
    			attr_dev(a5, "href", "#0");
    			attr_dev(a5, "class", "svelte-1c663ja");
    			add_location(a5, file$1, 21, 24, 798);
    			attr_dev(div0, "class", "dropdown-product svelte-1c663ja");
    			add_location(div0, file$1, 18, 20, 641);
    			attr_dev(a6, "href", "#0");
    			attr_dev(a6, "class", "product svelte-1c663ja");
    			add_location(a6, file$1, 17, 16, 530);
    			attr_dev(li0, "class", "svelte-1c663ja");
    			add_location(li0, file$1, 16, 12, 509);
    			if (img4.src !== (img4_src_value = "../images/icon-arrow-light.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "arrow");
    			attr_dev(img4, "class", "svelte-1c663ja");
    			add_location(img4, file$1, 26, 52, 960);
    			attr_dev(a7, "href", "#0");
    			attr_dev(a7, "class", "svelte-1c663ja");
    			add_location(a7, file$1, 28, 24, 1090);
    			attr_dev(a8, "href", "#0");
    			attr_dev(a8, "class", "svelte-1c663ja");
    			add_location(a8, file$1, 29, 24, 1141);
    			attr_dev(a9, "href", "#0");
    			attr_dev(a9, "class", "svelte-1c663ja");
    			add_location(a9, file$1, 30, 24, 1192);
    			attr_dev(div1, "class", "dropdown-company svelte-1c663ja");
    			add_location(div1, file$1, 27, 20, 1035);
    			attr_dev(a10, "href", "#0");
    			attr_dev(a10, "class", "company svelte-1c663ja");
    			add_location(a10, file$1, 26, 16, 924);
    			attr_dev(li1, "class", "svelte-1c663ja");
    			add_location(li1, file$1, 25, 12, 903);
    			if (img5.src !== (img5_src_value = "../images/icon-arrow-light.svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "arrow");
    			attr_dev(img5, "class", "svelte-1c663ja");
    			add_location(img5, file$1, 35, 52, 1354);
    			attr_dev(a11, "href", "#0");
    			attr_dev(a11, "class", "svelte-1c663ja");
    			add_location(a11, file$1, 37, 24, 1484);
    			attr_dev(a12, "href", "#0");
    			attr_dev(a12, "class", "svelte-1c663ja");
    			add_location(a12, file$1, 38, 24, 1533);
    			attr_dev(a13, "href", "#0");
    			attr_dev(a13, "class", "svelte-1c663ja");
    			add_location(a13, file$1, 39, 24, 1585);
    			attr_dev(div2, "class", "dropdown-connect svelte-1c663ja");
    			add_location(div2, file$1, 36, 20, 1429);
    			attr_dev(a14, "href", "#0");
    			attr_dev(a14, "class", "connect svelte-1c663ja");
    			add_location(a14, file$1, 35, 16, 1318);
    			attr_dev(li2, "class", "svelte-1c663ja");
    			add_location(li2, file$1, 34, 12, 1297);
    			attr_dev(ul, "class", "svelte-1c663ja");
    			add_location(ul, file$1, 15, 8, 492);
    			attr_dev(a15, "href", "#0");
    			attr_dev(a15, "class", "svelte-1c663ja");
    			add_location(a15, file$1, 45, 20, 1761);
    			attr_dev(button0, "class", "svelte-1c663ja");
    			add_location(button0, file$1, 45, 12, 1753);
    			attr_dev(a16, "href", "#0");
    			attr_dev(a16, "class", "svelte-1c663ja");
    			add_location(a16, file$1, 46, 20, 1813);
    			attr_dev(button1, "class", "svelte-1c663ja");
    			add_location(button1, file$1, 46, 12, 1805);
    			attr_dev(div3, "class", "btn-nav svelte-1c663ja");
    			add_location(div3, file$1, 44, 8, 1719);
    			attr_dev(nav, "class", "svelte-1c663ja");
    			toggle_class(nav, "active", /*active*/ ctx[0]);
    			add_location(nav, file$1, 5, 4, 75);
    			attr_dev(h1, "class", "svelte-1c663ja");
    			add_location(h1, file$1, 50, 8, 1892);
    			attr_dev(p, "class", "svelte-1c663ja");
    			add_location(p, file$1, 53, 8, 1960);
    			attr_dev(main, "class", "svelte-1c663ja");
    			add_location(main, file$1, 49, 4, 1877);
    			attr_dev(a17, "href", "#0");
    			attr_dev(a17, "class", "svelte-1c663ja");
    			add_location(a17, file$1, 56, 16, 2071);
    			attr_dev(button2, "class", "svelte-1c663ja");
    			add_location(button2, file$1, 56, 8, 2063);
    			attr_dev(a18, "href", "#0");
    			attr_dev(a18, "class", "svelte-1c663ja");
    			add_location(a18, file$1, 57, 16, 2128);
    			attr_dev(button3, "class", "svelte-1c663ja");
    			add_location(button3, file$1, 57, 8, 2120);
    			attr_dev(div4, "class", "btn-botton svelte-1c663ja");
    			add_location(div4, file$1, 55, 4, 2030);
    			attr_dev(div5, "class", "container svelte-1c663ja");
    			add_location(div5, file$1, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, nav);
    			append_dev(nav, a0);
    			append_dev(a0, img0);
    			append_dev(nav, t0);
    			append_dev(nav, a1);
    			append_dev(a1, img1);
    			append_dev(nav, t1);
    			append_dev(nav, a2);
    			append_dev(a2, img2);
    			append_dev(nav, t2);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a6);
    			append_dev(a6, t3);
    			append_dev(a6, img3);
    			append_dev(a6, t4);
    			append_dev(a6, div0);
    			append_dev(div0, a3);
    			append_dev(div0, t6);
    			append_dev(div0, a4);
    			append_dev(div0, t8);
    			append_dev(div0, a5);
    			append_dev(ul, t10);
    			append_dev(ul, li1);
    			append_dev(li1, a10);
    			append_dev(a10, t11);
    			append_dev(a10, img4);
    			append_dev(a10, t12);
    			append_dev(a10, div1);
    			append_dev(div1, a7);
    			append_dev(div1, t14);
    			append_dev(div1, a8);
    			append_dev(div1, t16);
    			append_dev(div1, a9);
    			append_dev(ul, t18);
    			append_dev(ul, li2);
    			append_dev(li2, a14);
    			append_dev(a14, t19);
    			append_dev(a14, img5);
    			append_dev(a14, t20);
    			append_dev(a14, div2);
    			append_dev(div2, a11);
    			append_dev(div2, t22);
    			append_dev(div2, a12);
    			append_dev(div2, t24);
    			append_dev(div2, a13);
    			append_dev(nav, t26);
    			append_dev(nav, div3);
    			append_dev(div3, button0);
    			append_dev(button0, a15);
    			append_dev(div3, t28);
    			append_dev(div3, button1);
    			append_dev(button1, a16);
    			append_dev(div5, t30);
    			append_dev(div5, main);
    			append_dev(main, h1);
    			append_dev(main, t32);
    			append_dev(main, p);
    			append_dev(div5, t34);
    			append_dev(div5, div4);
    			append_dev(div4, button2);
    			append_dev(button2, a17);
    			append_dev(div4, t36);
    			append_dev(div4, button3);
    			append_dev(button3, a18);

    			if (!mounted) {
    				dispose = listen_dev(nav, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*active*/ 1) {
    				toggle_class(nav, "active", /*active*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	let active = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, active = !active);
    	$$self.$capture_state = () => ({ active });

    	$$self.$inject_state = $$props => {
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active, click_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let current;
    	header = new Header({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			add_location(main, file, 4, 0, 58);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
