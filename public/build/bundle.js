
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

    const file$3 = "src/Header.svelte";

    function create_fragment$3(ctx) {
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
    	let a8;
    	let t3;
    	let img3;
    	let img3_src_value;
    	let t4;
    	let img4;
    	let img4_src_value;
    	let t5;
    	let div0;
    	let a3;
    	let t7;
    	let a4;
    	let t9;
    	let a5;
    	let t11;
    	let a6;
    	let t13;
    	let a7;
    	let t15;
    	let li1;
    	let a13;
    	let t16;
    	let img5;
    	let img5_src_value;
    	let t17;
    	let img6;
    	let img6_src_value;
    	let t18;
    	let div1;
    	let a9;
    	let t20;
    	let a10;
    	let t22;
    	let a11;
    	let t24;
    	let a12;
    	let t26;
    	let li2;
    	let a17;
    	let t27;
    	let img7;
    	let img7_src_value;
    	let t28;
    	let img8;
    	let img8_src_value;
    	let t29;
    	let div2;
    	let a14;
    	let t31;
    	let a15;
    	let t33;
    	let a16;
    	let t35;
    	let div3;
    	let button0;
    	let a18;
    	let t37;
    	let button1;
    	let a19;
    	let t39;
    	let main;
    	let h1;
    	let t41;
    	let p;
    	let t43;
    	let div4;
    	let button2;
    	let a20;
    	let t45;
    	let button3;
    	let a21;
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
    			a8 = element("a");
    			t3 = text("Product\n                    ");
    			img3 = element("img");
    			t4 = space();
    			img4 = element("img");
    			t5 = space();
    			div0 = element("div");
    			a3 = element("a");
    			a3.textContent = "Overview";
    			t7 = space();
    			a4 = element("a");
    			a4.textContent = "Pricing";
    			t9 = space();
    			a5 = element("a");
    			a5.textContent = "Marketplace";
    			t11 = space();
    			a6 = element("a");
    			a6.textContent = "Features";
    			t13 = space();
    			a7 = element("a");
    			a7.textContent = "Integrations";
    			t15 = space();
    			li1 = element("li");
    			a13 = element("a");
    			t16 = text("Company\n                    ");
    			img5 = element("img");
    			t17 = space();
    			img6 = element("img");
    			t18 = space();
    			div1 = element("div");
    			a9 = element("a");
    			a9.textContent = "About";
    			t20 = space();
    			a10 = element("a");
    			a10.textContent = "Team";
    			t22 = space();
    			a11 = element("a");
    			a11.textContent = "Blog";
    			t24 = space();
    			a12 = element("a");
    			a12.textContent = "Careers";
    			t26 = space();
    			li2 = element("li");
    			a17 = element("a");
    			t27 = text("Connect\n                    ");
    			img7 = element("img");
    			t28 = space();
    			img8 = element("img");
    			t29 = space();
    			div2 = element("div");
    			a14 = element("a");
    			a14.textContent = "Contact";
    			t31 = space();
    			a15 = element("a");
    			a15.textContent = "Newsletter";
    			t33 = space();
    			a16 = element("a");
    			a16.textContent = "Linkedin";
    			t35 = space();
    			div3 = element("div");
    			button0 = element("button");
    			a18 = element("a");
    			a18.textContent = "Login";
    			t37 = space();
    			button1 = element("button");
    			a19 = element("a");
    			a19.textContent = "Sign Up";
    			t39 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "A modern publishing platform";
    			t41 = space();
    			p = element("p");
    			p.textContent = "Grow your audience and build your online brand";
    			t43 = space();
    			div4 = element("div");
    			button2 = element("button");
    			a20 = element("a");
    			a20.textContent = "Start for Free";
    			t45 = space();
    			button3 = element("button");
    			a21 = element("a");
    			a21.textContent = "Learn More";
    			if (img0.src !== (img0_src_value = "./images/logo.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "logo");
    			attr_dev(img0, "class", "svelte-6rydmg");
    			add_location(img0, file$3, 7, 12, 174);
    			attr_dev(a0, "href", "#0");
    			attr_dev(a0, "class", "logo svelte-6rydmg");
    			add_location(a0, file$3, 6, 8, 135);
    			if (img1.src !== (img1_src_value = "./images/icon-hamburger.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "hamburger");
    			attr_dev(img1, "class", "svelte-6rydmg");
    			add_location(img1, file$3, 10, 12, 280);
    			attr_dev(a1, "href", "#0");
    			attr_dev(a1, "class", "hamburger svelte-6rydmg");
    			add_location(a1, file$3, 9, 8, 236);
    			if (img2.src !== (img2_src_value = "./images/icon-close.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "close");
    			attr_dev(img2, "class", "svelte-6rydmg");
    			add_location(img2, file$3, 13, 12, 405);
    			attr_dev(a2, "href", "#0");
    			attr_dev(a2, "class", "close svelte-6rydmg");
    			add_location(a2, file$3, 12, 8, 365);
    			if (img3.src !== (img3_src_value = "./images/icon-arrow-light.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "arrow");
    			attr_dev(img3, "class", "arrow-light svelte-6rydmg");
    			add_location(img3, file$3, 19, 20, 605);
    			if (img4.src !== (img4_src_value = "./images/icon-arrow-dark.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "arrow");
    			attr_dev(img4, "class", "arrow-dark svelte-6rydmg");
    			add_location(img4, file$3, 20, 20, 699);
    			attr_dev(a3, "href", "#0");
    			attr_dev(a3, "class", "svelte-6rydmg");
    			add_location(a3, file$3, 22, 24, 846);
    			attr_dev(a4, "href", "#0");
    			attr_dev(a4, "class", "svelte-6rydmg");
    			add_location(a4, file$3, 23, 24, 896);
    			attr_dev(a5, "href", "#0");
    			attr_dev(a5, "class", "svelte-6rydmg");
    			add_location(a5, file$3, 24, 24, 945);
    			attr_dev(a6, "href", "#0");
    			attr_dev(a6, "class", "svelte-6rydmg");
    			add_location(a6, file$3, 25, 24, 998);
    			attr_dev(a7, "href", "#0");
    			attr_dev(a7, "class", "svelte-6rydmg");
    			add_location(a7, file$3, 26, 24, 1048);
    			attr_dev(div0, "class", "dropdown-product svelte-6rydmg");
    			add_location(div0, file$3, 21, 20, 791);
    			attr_dev(a8, "href", "#0");
    			attr_dev(a8, "class", "product svelte-6rydmg");
    			add_location(a8, file$3, 17, 16, 527);
    			attr_dev(li0, "class", "svelte-6rydmg");
    			add_location(li0, file$3, 16, 12, 506);
    			if (img5.src !== (img5_src_value = "./images/icon-arrow-light.svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "arrow");
    			attr_dev(img5, "class", "arrow-light svelte-6rydmg");
    			add_location(img5, file$3, 33, 20, 1279);
    			if (img6.src !== (img6_src_value = "./images/icon-arrow-dark.svg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "arrow");
    			attr_dev(img6, "class", "arrow-dark svelte-6rydmg");
    			add_location(img6, file$3, 34, 20, 1373);
    			attr_dev(a9, "href", "#0");
    			attr_dev(a9, "class", "svelte-6rydmg");
    			add_location(a9, file$3, 36, 24, 1520);
    			attr_dev(a10, "href", "#0");
    			attr_dev(a10, "class", "svelte-6rydmg");
    			add_location(a10, file$3, 37, 24, 1567);
    			attr_dev(a11, "href", "#0");
    			attr_dev(a11, "class", "svelte-6rydmg");
    			add_location(a11, file$3, 38, 24, 1613);
    			attr_dev(a12, "href", "#0");
    			attr_dev(a12, "class", "svelte-6rydmg");
    			add_location(a12, file$3, 39, 24, 1659);
    			attr_dev(div1, "class", "dropdown-company svelte-6rydmg");
    			add_location(div1, file$3, 35, 20, 1465);
    			attr_dev(a13, "href", "#0");
    			attr_dev(a13, "class", "company svelte-6rydmg");
    			add_location(a13, file$3, 31, 16, 1201);
    			attr_dev(li1, "class", "svelte-6rydmg");
    			add_location(li1, file$3, 30, 12, 1180);
    			if (img7.src !== (img7_src_value = "./images/icon-arrow-light.svg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "arrow");
    			attr_dev(img7, "class", "arrow-light svelte-6rydmg");
    			add_location(img7, file$3, 46, 20, 1861);
    			if (img8.src !== (img8_src_value = "./images/icon-arrow-dark.svg")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "arrow");
    			attr_dev(img8, "class", "arrow-dark svelte-6rydmg");
    			add_location(img8, file$3, 47, 20, 1955);
    			attr_dev(a14, "href", "#0");
    			attr_dev(a14, "class", "svelte-6rydmg");
    			add_location(a14, file$3, 49, 24, 2102);
    			attr_dev(a15, "href", "#0");
    			attr_dev(a15, "class", "svelte-6rydmg");
    			add_location(a15, file$3, 50, 24, 2151);
    			attr_dev(a16, "href", "#0");
    			attr_dev(a16, "class", "svelte-6rydmg");
    			add_location(a16, file$3, 51, 24, 2203);
    			attr_dev(div2, "class", "dropdown-connect svelte-6rydmg");
    			add_location(div2, file$3, 48, 20, 2047);
    			attr_dev(a17, "href", "#0");
    			attr_dev(a17, "class", "connect svelte-6rydmg");
    			add_location(a17, file$3, 44, 16, 1783);
    			attr_dev(li2, "class", "svelte-6rydmg");
    			add_location(li2, file$3, 43, 12, 1762);
    			attr_dev(ul, "class", "svelte-6rydmg");
    			add_location(ul, file$3, 15, 8, 489);
    			attr_dev(a18, "href", "#0");
    			attr_dev(a18, "class", "svelte-6rydmg");
    			add_location(a18, file$3, 57, 20, 2379);
    			attr_dev(button0, "class", "svelte-6rydmg");
    			add_location(button0, file$3, 57, 12, 2371);
    			attr_dev(a19, "href", "#0");
    			attr_dev(a19, "class", "svelte-6rydmg");
    			add_location(a19, file$3, 58, 20, 2431);
    			attr_dev(button1, "class", "svelte-6rydmg");
    			add_location(button1, file$3, 58, 12, 2423);
    			attr_dev(div3, "class", "btn-nav svelte-6rydmg");
    			add_location(div3, file$3, 56, 8, 2337);
    			attr_dev(nav, "class", "svelte-6rydmg");
    			toggle_class(nav, "active", /*active*/ ctx[0]);
    			add_location(nav, file$3, 5, 4, 75);
    			attr_dev(h1, "class", "svelte-6rydmg");
    			add_location(h1, file$3, 62, 8, 2510);
    			attr_dev(p, "class", "svelte-6rydmg");
    			add_location(p, file$3, 65, 8, 2578);
    			attr_dev(main, "class", "svelte-6rydmg");
    			add_location(main, file$3, 61, 4, 2495);
    			attr_dev(a20, "href", "#0");
    			attr_dev(a20, "class", "svelte-6rydmg");
    			add_location(a20, file$3, 68, 16, 2689);
    			attr_dev(button2, "class", "svelte-6rydmg");
    			add_location(button2, file$3, 68, 8, 2681);
    			attr_dev(a21, "href", "#0");
    			attr_dev(a21, "class", "svelte-6rydmg");
    			add_location(a21, file$3, 69, 16, 2746);
    			attr_dev(button3, "class", "svelte-6rydmg");
    			add_location(button3, file$3, 69, 8, 2738);
    			attr_dev(div4, "class", "btn-botton svelte-6rydmg");
    			add_location(div4, file$3, 67, 4, 2648);
    			attr_dev(div5, "class", "container svelte-6rydmg");
    			add_location(div5, file$3, 4, 0, 43);
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
    			append_dev(li0, a8);
    			append_dev(a8, t3);
    			append_dev(a8, img3);
    			append_dev(a8, t4);
    			append_dev(a8, img4);
    			append_dev(a8, t5);
    			append_dev(a8, div0);
    			append_dev(div0, a3);
    			append_dev(div0, t7);
    			append_dev(div0, a4);
    			append_dev(div0, t9);
    			append_dev(div0, a5);
    			append_dev(div0, t11);
    			append_dev(div0, a6);
    			append_dev(div0, t13);
    			append_dev(div0, a7);
    			append_dev(ul, t15);
    			append_dev(ul, li1);
    			append_dev(li1, a13);
    			append_dev(a13, t16);
    			append_dev(a13, img5);
    			append_dev(a13, t17);
    			append_dev(a13, img6);
    			append_dev(a13, t18);
    			append_dev(a13, div1);
    			append_dev(div1, a9);
    			append_dev(div1, t20);
    			append_dev(div1, a10);
    			append_dev(div1, t22);
    			append_dev(div1, a11);
    			append_dev(div1, t24);
    			append_dev(div1, a12);
    			append_dev(ul, t26);
    			append_dev(ul, li2);
    			append_dev(li2, a17);
    			append_dev(a17, t27);
    			append_dev(a17, img7);
    			append_dev(a17, t28);
    			append_dev(a17, img8);
    			append_dev(a17, t29);
    			append_dev(a17, div2);
    			append_dev(div2, a14);
    			append_dev(div2, t31);
    			append_dev(div2, a15);
    			append_dev(div2, t33);
    			append_dev(div2, a16);
    			append_dev(nav, t35);
    			append_dev(nav, div3);
    			append_dev(div3, button0);
    			append_dev(button0, a18);
    			append_dev(div3, t37);
    			append_dev(div3, button1);
    			append_dev(button1, a19);
    			append_dev(div5, t39);
    			append_dev(div5, main);
    			append_dev(main, h1);
    			append_dev(main, t41);
    			append_dev(main, p);
    			append_dev(div5, t43);
    			append_dev(div5, div4);
    			append_dev(div4, button2);
    			append_dev(button2, a20);
    			append_dev(div4, t45);
    			append_dev(div4, button3);
    			append_dev(button3, a21);

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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Main.svelte generated by Svelte v3.37.0 */

    const file$2 = "src/Main.svelte";

    function create_fragment$2(ctx) {
    	let div7;
    	let h10;
    	let t1;
    	let div0;
    	let h20;
    	let t3;
    	let p0;
    	let t5;
    	let div1;
    	let h21;
    	let t7;
    	let p1;
    	let t9;
    	let img0;
    	let img0_src_value;
    	let t10;
    	let img1;
    	let img1_src_value;
    	let t11;
    	let div2;
    	let t12;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t13;
    	let img3;
    	let img3_src_value;
    	let t14;
    	let div4;
    	let h11;
    	let t16;
    	let p2;
    	let t18;
    	let img4;
    	let img4_src_value;
    	let t19;
    	let img5;
    	let img5_src_value;
    	let t20;
    	let div5;
    	let h22;
    	let t22;
    	let p3;
    	let t24;
    	let div6;
    	let h23;
    	let t26;
    	let p4;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Designed for the future";
    			t1 = space();
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Introducing an extensible editor";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Blogr features an exceedingly intuitive interface which lets you focus on one thing: creating content. The editor supports management of mutiple blogs and allows easy manipulation of embeds such as images, videos, and Markdown. Extensibility with plugins and themes provide easy ways to add functionality or change the looks of a blog.";
    			t5 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Robust content management";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Flexible content management enables users to easily move through posts. Increase the usability of your blog by adding customized categories, sections, format, or flow. With this functionslity, you're in full control.";
    			t9 = space();
    			img0 = element("img");
    			t10 = space();
    			img1 = element("img");
    			t11 = space();
    			div2 = element("div");
    			t12 = space();
    			div3 = element("div");
    			img2 = element("img");
    			t13 = space();
    			img3 = element("img");
    			t14 = space();
    			div4 = element("div");
    			h11 = element("h1");
    			h11.textContent = "State of the Art Infrastructure";
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "With reliability and speed in mind, wordwide data centers provide the backbone for ultra-fast connectivity. This ensures your site will load instantly, no matter where your  readers are, keeping your site competitive.";
    			t18 = space();
    			img4 = element("img");
    			t19 = space();
    			img5 = element("img");
    			t20 = space();
    			div5 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Free, open, simple";
    			t22 = space();
    			p3 = element("p");
    			p3.textContent = "Blogr is a free and open source application backed by a large community of helpful developers. It supports features such as code syntax highlightind, RSS feeds, social media integration, third-party commenting tools, and works seamlessly with Google Analytics. The architecture is clean and is relatively easy to learn.";
    			t24 = space();
    			div6 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Powerful tooling";
    			t26 = space();
    			p4 = element("p");
    			p4.textContent = "Batteries included. We built a simple and straightforward CLI tool that makes customization and deployment a breeze, but capable of producing even the most complicated sites.";
    			attr_dev(h10, "class", "head-line svelte-16v88mi");
    			add_location(h10, file$2, 1, 4, 28);
    			attr_dev(h20, "class", "svelte-16v88mi");
    			add_location(h20, file$2, 3, 8, 115);
    			attr_dev(p0, "class", "svelte-16v88mi");
    			add_location(p0, file$2, 4, 8, 165);
    			attr_dev(div0, "class", "content-1 svelte-16v88mi");
    			add_location(div0, file$2, 2, 4, 83);
    			attr_dev(h21, "class", "svelte-16v88mi");
    			add_location(h21, file$2, 9, 8, 577);
    			attr_dev(p1, "class", "svelte-16v88mi");
    			add_location(p1, file$2, 10, 8, 620);
    			attr_dev(div1, "class", "content-2 svelte-16v88mi");
    			add_location(div1, file$2, 8, 4, 545);
    			attr_dev(img0, "class", "img-editor svelte-16v88mi");
    			if (img0.src !== (img0_src_value = "./images/illustration-editor-desktop.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "editor");
    			add_location(img0, file$2, 14, 4, 881);
    			attr_dev(img1, "class", "img-editor-mb svelte-16v88mi");
    			if (img1.src !== (img1_src_value = "./images/illustration-editor-mobile.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "editor");
    			add_location(img1, file$2, 15, 4, 970);
    			attr_dev(div2, "class", "infrastructure svelte-16v88mi");
    			add_location(div2, file$2, 16, 4, 1065);
    			if (img2.src !== (img2_src_value = "./images/illustration-phones.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "phones");
    			attr_dev(img2, "class", "svelte-16v88mi");
    			add_location(img2, file$2, 18, 8, 1137);
    			attr_dev(div3, "class", "img-phones svelte-16v88mi");
    			add_location(div3, file$2, 17, 4, 1104);
    			if (img3.src !== (img3_src_value = "./images/illustration-phones.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "phones");
    			attr_dev(img3, "class", "phones-mobile svelte-16v88mi");
    			add_location(img3, file$2, 20, 4, 1218);
    			attr_dev(h11, "class", "svelte-16v88mi");
    			add_location(h11, file$2, 22, 8, 1349);
    			attr_dev(p2, "class", "svelte-16v88mi");
    			add_location(p2, file$2, 23, 8, 1398);
    			attr_dev(div4, "class", "content-3 svelte-16v88mi");
    			attr_dev(div4, "id", "content-3");
    			add_location(div4, file$2, 21, 4, 1302);
    			attr_dev(img4, "class", "img-laptop svelte-16v88mi");
    			if (img4.src !== (img4_src_value = "./images/illustration-laptop-desktop.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "laptop");
    			add_location(img4, file$2, 27, 4, 1661);
    			attr_dev(img5, "class", "img-laptop-mobile svelte-16v88mi");
    			if (img5.src !== (img5_src_value = "./images/illustration-laptop-mobile.svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "laptop");
    			add_location(img5, file$2, 28, 4, 1750);
    			attr_dev(h22, "class", "svelte-16v88mi");
    			add_location(h22, file$2, 30, 8, 1877);
    			attr_dev(p3, "class", "svelte-16v88mi");
    			add_location(p3, file$2, 33, 8, 1935);
    			attr_dev(div5, "class", "content-4 svelte-16v88mi");
    			add_location(div5, file$2, 29, 4, 1845);
    			attr_dev(h23, "class", "svelte-16v88mi");
    			add_location(h23, file$2, 38, 8, 2339);
    			attr_dev(p4, "class", "svelte-16v88mi");
    			add_location(p4, file$2, 39, 8, 2373);
    			attr_dev(div6, "class", "content-5 svelte-16v88mi");
    			add_location(div6, file$2, 37, 4, 2307);
    			attr_dev(div7, "class", "container svelte-16v88mi");
    			add_location(div7, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, h10);
    			append_dev(div7, t1);
    			append_dev(div7, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div7, t5);
    			append_dev(div7, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(div7, t9);
    			append_dev(div7, img0);
    			append_dev(div7, t10);
    			append_dev(div7, img1);
    			append_dev(div7, t11);
    			append_dev(div7, div2);
    			append_dev(div7, t12);
    			append_dev(div7, div3);
    			append_dev(div3, img2);
    			append_dev(div7, t13);
    			append_dev(div7, img3);
    			append_dev(div7, t14);
    			append_dev(div7, div4);
    			append_dev(div4, h11);
    			append_dev(div4, t16);
    			append_dev(div4, p2);
    			append_dev(div7, t18);
    			append_dev(div7, img4);
    			append_dev(div7, t19);
    			append_dev(div7, img5);
    			append_dev(div7, t20);
    			append_dev(div7, div5);
    			append_dev(div5, h22);
    			append_dev(div5, t22);
    			append_dev(div5, p3);
    			append_dev(div7, t24);
    			append_dev(div7, div6);
    			append_dev(div6, h23);
    			append_dev(div6, t26);
    			append_dev(div6, p4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Main", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.37.0 */

    const file$1 = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let ul;
    	let li5;
    	let a5;
    	let h30;
    	let t2;
    	let li0;
    	let a0;
    	let t4;
    	let li1;
    	let a1;
    	let t6;
    	let li2;
    	let a2;
    	let t8;
    	let li3;
    	let a3;
    	let t10;
    	let li4;
    	let a4;
    	let t12;
    	let li10;
    	let a10;
    	let h31;
    	let t14;
    	let li6;
    	let a6;
    	let t16;
    	let li7;
    	let a7;
    	let t18;
    	let li8;
    	let a8;
    	let t20;
    	let li9;
    	let a9;
    	let t22;
    	let li14;
    	let a14;
    	let h32;
    	let t24;
    	let li11;
    	let a11;
    	let t26;
    	let li12;
    	let a12;
    	let t28;
    	let li13;
    	let a13;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			ul = element("ul");
    			li5 = element("li");
    			a5 = element("a");
    			h30 = element("h3");
    			h30.textContent = "Product";
    			t2 = space();
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Overview";
    			t4 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Pricing";
    			t6 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Marketplace";
    			t8 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Features";
    			t10 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Integrations";
    			t12 = space();
    			li10 = element("li");
    			a10 = element("a");
    			h31 = element("h3");
    			h31.textContent = "Company";
    			t14 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "About";
    			t16 = space();
    			li7 = element("li");
    			a7 = element("a");
    			a7.textContent = "Team";
    			t18 = space();
    			li8 = element("li");
    			a8 = element("a");
    			a8.textContent = "Blog";
    			t20 = space();
    			li9 = element("li");
    			a9 = element("a");
    			a9.textContent = "Careers";
    			t22 = space();
    			li14 = element("li");
    			a14 = element("a");
    			h32 = element("h3");
    			h32.textContent = "Connect";
    			t24 = space();
    			li11 = element("li");
    			a11 = element("a");
    			a11.textContent = "Contact";
    			t26 = space();
    			li12 = element("li");
    			a12 = element("a");
    			a12.textContent = "Newsletter";
    			t28 = space();
    			li13 = element("li");
    			a13 = element("a");
    			a13.textContent = "Linkedin";
    			if (img.src !== (img_src_value = "./images/logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "logo svelte-gxfwv6");
    			add_location(img, file$1, 2, 4, 29);
    			attr_dev(h30, "class", "svelte-gxfwv6");
    			add_location(h30, file$1, 6, 16, 163);
    			attr_dev(a0, "href", "#0");
    			attr_dev(a0, "class", "svelte-gxfwv6");
    			add_location(a0, file$1, 7, 20, 201);
    			attr_dev(li0, "class", "svelte-gxfwv6");
    			add_location(li0, file$1, 7, 16, 197);
    			attr_dev(a1, "href", "#0");
    			attr_dev(a1, "class", "svelte-gxfwv6");
    			add_location(a1, file$1, 8, 20, 252);
    			attr_dev(li1, "class", "svelte-gxfwv6");
    			add_location(li1, file$1, 8, 16, 248);
    			attr_dev(a2, "href", "#0");
    			attr_dev(a2, "class", "svelte-gxfwv6");
    			add_location(a2, file$1, 9, 20, 302);
    			attr_dev(li2, "class", "svelte-gxfwv6");
    			add_location(li2, file$1, 9, 16, 298);
    			attr_dev(a3, "href", "#0");
    			attr_dev(a3, "class", "svelte-gxfwv6");
    			add_location(a3, file$1, 10, 20, 356);
    			attr_dev(li3, "class", "svelte-gxfwv6");
    			add_location(li3, file$1, 10, 16, 352);
    			attr_dev(a4, "href", "#0");
    			attr_dev(a4, "class", "svelte-gxfwv6");
    			add_location(a4, file$1, 11, 20, 407);
    			attr_dev(li4, "class", "svelte-gxfwv6");
    			add_location(li4, file$1, 11, 16, 403);
    			attr_dev(a5, "href", "#0");
    			attr_dev(a5, "class", "product svelte-gxfwv6");
    			add_location(a5, file$1, 5, 12, 117);
    			attr_dev(li5, "class", "svelte-gxfwv6");
    			add_location(li5, file$1, 4, 8, 100);
    			attr_dev(h31, "class", "svelte-gxfwv6");
    			add_location(h31, file$1, 16, 16, 549);
    			attr_dev(a6, "href", "#0");
    			attr_dev(a6, "class", "svelte-gxfwv6");
    			add_location(a6, file$1, 17, 20, 602);
    			attr_dev(li6, "class", "svelte-gxfwv6");
    			add_location(li6, file$1, 17, 16, 598);
    			attr_dev(a7, "href", "#0");
    			attr_dev(a7, "class", "svelte-gxfwv6");
    			add_location(a7, file$1, 18, 20, 650);
    			attr_dev(li7, "class", "svelte-gxfwv6");
    			add_location(li7, file$1, 18, 16, 646);
    			attr_dev(a8, "href", "#0");
    			attr_dev(a8, "class", "svelte-gxfwv6");
    			add_location(a8, file$1, 19, 20, 697);
    			attr_dev(li8, "class", "svelte-gxfwv6");
    			add_location(li8, file$1, 19, 16, 693);
    			attr_dev(a9, "href", "#0");
    			attr_dev(a9, "class", "svelte-gxfwv6");
    			add_location(a9, file$1, 20, 20, 744);
    			attr_dev(li9, "class", "svelte-gxfwv6");
    			add_location(li9, file$1, 20, 16, 740);
    			attr_dev(a10, "href", "#0");
    			attr_dev(a10, "class", "company svelte-gxfwv6");
    			add_location(a10, file$1, 15, 12, 503);
    			attr_dev(li10, "class", "svelte-gxfwv6");
    			add_location(li10, file$1, 14, 8, 486);
    			attr_dev(h32, "class", "svelte-gxfwv6");
    			add_location(h32, file$1, 25, 16, 877);
    			attr_dev(a11, "href", "#0");
    			attr_dev(a11, "class", "svelte-gxfwv6");
    			add_location(a11, file$1, 26, 20, 915);
    			attr_dev(li11, "class", "svelte-gxfwv6");
    			add_location(li11, file$1, 26, 16, 911);
    			attr_dev(a12, "href", "#0");
    			attr_dev(a12, "class", "svelte-gxfwv6");
    			add_location(a12, file$1, 27, 20, 965);
    			attr_dev(li12, "class", "svelte-gxfwv6");
    			add_location(li12, file$1, 27, 16, 961);
    			attr_dev(a13, "href", "#0");
    			attr_dev(a13, "class", "svelte-gxfwv6");
    			add_location(a13, file$1, 28, 20, 1018);
    			attr_dev(li13, "class", "svelte-gxfwv6");
    			add_location(li13, file$1, 28, 16, 1014);
    			attr_dev(a14, "href", "#0");
    			attr_dev(a14, "class", "connect svelte-gxfwv6");
    			add_location(a14, file$1, 24, 12, 831);
    			attr_dev(li14, "class", "svelte-gxfwv6");
    			add_location(li14, file$1, 23, 8, 814);
    			attr_dev(ul, "class", "svelte-gxfwv6");
    			add_location(ul, file$1, 3, 4, 87);
    			attr_dev(div, "class", "container svelte-gxfwv6");
    			add_location(div, file$1, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, ul);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(a5, h30);
    			append_dev(a5, t2);
    			append_dev(a5, li0);
    			append_dev(li0, a0);
    			append_dev(a5, t4);
    			append_dev(a5, li1);
    			append_dev(li1, a1);
    			append_dev(a5, t6);
    			append_dev(a5, li2);
    			append_dev(li2, a2);
    			append_dev(a5, t8);
    			append_dev(a5, li3);
    			append_dev(li3, a3);
    			append_dev(a5, t10);
    			append_dev(a5, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t12);
    			append_dev(ul, li10);
    			append_dev(li10, a10);
    			append_dev(a10, h31);
    			append_dev(a10, t14);
    			append_dev(a10, li6);
    			append_dev(li6, a6);
    			append_dev(a10, t16);
    			append_dev(a10, li7);
    			append_dev(li7, a7);
    			append_dev(a10, t18);
    			append_dev(a10, li8);
    			append_dev(li8, a8);
    			append_dev(a10, t20);
    			append_dev(a10, li9);
    			append_dev(li9, a9);
    			append_dev(ul, t22);
    			append_dev(ul, li14);
    			append_dev(li14, a14);
    			append_dev(a14, h32);
    			append_dev(a14, t24);
    			append_dev(a14, li11);
    			append_dev(li11, a11);
    			append_dev(a14, t26);
    			append_dev(a14, li12);
    			append_dev(li12, a12);
    			append_dev(a14, t28);
    			append_dev(a14, li13);
    			append_dev(li13, a13);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main1;
    	let header;
    	let t0;
    	let main0;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	main0 = new Main({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(main0.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			add_location(main1, file, 6, 0, 130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			mount_component(header, main1, null);
    			append_dev(main1, t0);
    			mount_component(main0, main1, null);
    			append_dev(main1, t1);
    			mount_component(footer, main1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(main0.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(main0.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(header);
    			destroy_component(main0);
    			destroy_component(footer);
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

    	$$self.$capture_state = () => ({ Header, Main, Footer });
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
