
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
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
    	let ul;
    	let li0;
    	let a4;
    	let t1;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let div0;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let li1;
    	let a8;
    	let t9;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let div1;
    	let a5;
    	let t12;
    	let a6;
    	let t14;
    	let a7;
    	let t16;
    	let li2;
    	let a12;
    	let t17;
    	let img3;
    	let img3_src_value;
    	let t18;
    	let div2;
    	let a9;
    	let t20;
    	let a10;
    	let t22;
    	let a11;
    	let t24;
    	let div3;
    	let button0;
    	let a13;
    	let t26;
    	let button1;
    	let a14;
    	let t28;
    	let main;
    	let h1;
    	let t30;
    	let p;
    	let t32;
    	let div4;
    	let button2;
    	let a15;
    	let t34;
    	let button3;
    	let a16;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			nav = element("nav");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a4 = element("a");
    			t1 = text("Product");
    			img1 = element("img");
    			t2 = space();
    			div0 = element("div");
    			a1 = element("a");
    			a1.textContent = "Product 1";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Product 2";
    			t6 = space();
    			a3 = element("a");
    			a3.textContent = "Product 3";
    			t8 = space();
    			li1 = element("li");
    			a8 = element("a");
    			t9 = text("Company");
    			img2 = element("img");
    			t10 = space();
    			div1 = element("div");
    			a5 = element("a");
    			a5.textContent = "Company 1";
    			t12 = space();
    			a6 = element("a");
    			a6.textContent = "Company 2";
    			t14 = space();
    			a7 = element("a");
    			a7.textContent = "Company 3";
    			t16 = space();
    			li2 = element("li");
    			a12 = element("a");
    			t17 = text("Connect");
    			img3 = element("img");
    			t18 = space();
    			div2 = element("div");
    			a9 = element("a");
    			a9.textContent = "Contact";
    			t20 = space();
    			a10 = element("a");
    			a10.textContent = "Newsletter";
    			t22 = space();
    			a11 = element("a");
    			a11.textContent = "Linkedin";
    			t24 = space();
    			div3 = element("div");
    			button0 = element("button");
    			a13 = element("a");
    			a13.textContent = "Login";
    			t26 = space();
    			button1 = element("button");
    			a14 = element("a");
    			a14.textContent = "Sign Up";
    			t28 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "A modern publishing platform";
    			t30 = space();
    			p = element("p");
    			p.textContent = "Grow your audience and build your online brand";
    			t32 = space();
    			div4 = element("div");
    			button2 = element("button");
    			a15 = element("a");
    			a15.textContent = "Start for Free";
    			t34 = space();
    			button3 = element("button");
    			a16 = element("a");
    			a16.textContent = "Learn More";
    			if (img0.src !== (img0_src_value = "../images/logo.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "logo");
    			attr_dev(img0, "class", "svelte-1llvda");
    			add_location(img0, file$1, 4, 12, 86);
    			attr_dev(a0, "href", "#0");
    			attr_dev(a0, "class", "logo svelte-1llvda");
    			add_location(a0, file$1, 3, 8, 47);
    			if (img1.src !== (img1_src_value = "../images/icon-arrow-light.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "arrow");
    			attr_dev(img1, "class", "svelte-1llvda");
    			add_location(img1, file$1, 8, 52, 238);
    			attr_dev(a1, "href", "#0");
    			attr_dev(a1, "class", "svelte-1llvda");
    			add_location(a1, file$1, 10, 24, 368);
    			attr_dev(a2, "href", "#0");
    			attr_dev(a2, "class", "svelte-1llvda");
    			add_location(a2, file$1, 11, 24, 419);
    			attr_dev(a3, "href", "#0");
    			attr_dev(a3, "class", "svelte-1llvda");
    			add_location(a3, file$1, 12, 24, 470);
    			attr_dev(div0, "class", "dropdown-product svelte-1llvda");
    			add_location(div0, file$1, 9, 20, 313);
    			attr_dev(a4, "href", "#0");
    			attr_dev(a4, "class", "product svelte-1llvda");
    			add_location(a4, file$1, 8, 16, 202);
    			attr_dev(li0, "class", "svelte-1llvda");
    			add_location(li0, file$1, 7, 12, 181);
    			if (img2.src !== (img2_src_value = "../images/icon-arrow-light.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "arrow");
    			attr_dev(img2, "class", "svelte-1llvda");
    			add_location(img2, file$1, 17, 52, 632);
    			attr_dev(a5, "href", "#0");
    			attr_dev(a5, "class", "svelte-1llvda");
    			add_location(a5, file$1, 19, 24, 762);
    			attr_dev(a6, "href", "#0");
    			attr_dev(a6, "class", "svelte-1llvda");
    			add_location(a6, file$1, 20, 24, 813);
    			attr_dev(a7, "href", "#0");
    			attr_dev(a7, "class", "svelte-1llvda");
    			add_location(a7, file$1, 21, 24, 864);
    			attr_dev(div1, "class", "dropdown-company svelte-1llvda");
    			add_location(div1, file$1, 18, 20, 707);
    			attr_dev(a8, "href", "#0");
    			attr_dev(a8, "class", "company svelte-1llvda");
    			add_location(a8, file$1, 17, 16, 596);
    			attr_dev(li1, "class", "svelte-1llvda");
    			add_location(li1, file$1, 16, 12, 575);
    			if (img3.src !== (img3_src_value = "../images/icon-arrow-light.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "arrow");
    			attr_dev(img3, "class", "svelte-1llvda");
    			add_location(img3, file$1, 26, 52, 1026);
    			attr_dev(a9, "href", "#0");
    			attr_dev(a9, "class", "svelte-1llvda");
    			add_location(a9, file$1, 28, 24, 1156);
    			attr_dev(a10, "href", "#0");
    			attr_dev(a10, "class", "svelte-1llvda");
    			add_location(a10, file$1, 29, 24, 1205);
    			attr_dev(a11, "href", "#0");
    			attr_dev(a11, "class", "svelte-1llvda");
    			add_location(a11, file$1, 30, 24, 1257);
    			attr_dev(div2, "class", "dropdown-connect svelte-1llvda");
    			add_location(div2, file$1, 27, 20, 1101);
    			attr_dev(a12, "href", "#0");
    			attr_dev(a12, "class", "connect svelte-1llvda");
    			add_location(a12, file$1, 26, 16, 990);
    			attr_dev(li2, "class", "svelte-1llvda");
    			add_location(li2, file$1, 25, 12, 969);
    			attr_dev(ul, "class", "svelte-1llvda");
    			add_location(ul, file$1, 6, 8, 164);
    			attr_dev(a13, "href", "#0");
    			attr_dev(a13, "class", "svelte-1llvda");
    			add_location(a13, file$1, 36, 20, 1433);
    			attr_dev(button0, "class", "svelte-1llvda");
    			add_location(button0, file$1, 36, 12, 1425);
    			attr_dev(a14, "href", "#0");
    			attr_dev(a14, "class", "svelte-1llvda");
    			add_location(a14, file$1, 37, 20, 1485);
    			attr_dev(button1, "class", "svelte-1llvda");
    			add_location(button1, file$1, 37, 12, 1477);
    			attr_dev(div3, "class", "btn-nav svelte-1llvda");
    			add_location(div3, file$1, 35, 8, 1391);
    			attr_dev(nav, "class", "svelte-1llvda");
    			add_location(nav, file$1, 2, 4, 33);
    			attr_dev(h1, "class", "svelte-1llvda");
    			add_location(h1, file$1, 41, 8, 1564);
    			attr_dev(p, "class", "svelte-1llvda");
    			add_location(p, file$1, 44, 8, 1632);
    			attr_dev(main, "class", "svelte-1llvda");
    			add_location(main, file$1, 40, 4, 1549);
    			attr_dev(a15, "href", "#0");
    			attr_dev(a15, "class", "svelte-1llvda");
    			add_location(a15, file$1, 47, 16, 1743);
    			attr_dev(button2, "class", "svelte-1llvda");
    			add_location(button2, file$1, 47, 8, 1735);
    			attr_dev(a16, "href", "#0");
    			attr_dev(a16, "class", "svelte-1llvda");
    			add_location(a16, file$1, 48, 16, 1800);
    			attr_dev(button3, "class", "svelte-1llvda");
    			add_location(button3, file$1, 48, 8, 1792);
    			attr_dev(div4, "class", "btn-botton svelte-1llvda");
    			add_location(div4, file$1, 46, 4, 1702);
    			attr_dev(div5, "class", "container svelte-1llvda");
    			add_location(div5, file$1, 1, 0, 1);
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
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a4);
    			append_dev(a4, t1);
    			append_dev(a4, img1);
    			append_dev(a4, t2);
    			append_dev(a4, div0);
    			append_dev(div0, a1);
    			append_dev(div0, t4);
    			append_dev(div0, a2);
    			append_dev(div0, t6);
    			append_dev(div0, a3);
    			append_dev(ul, t8);
    			append_dev(ul, li1);
    			append_dev(li1, a8);
    			append_dev(a8, t9);
    			append_dev(a8, img2);
    			append_dev(a8, t10);
    			append_dev(a8, div1);
    			append_dev(div1, a5);
    			append_dev(div1, t12);
    			append_dev(div1, a6);
    			append_dev(div1, t14);
    			append_dev(div1, a7);
    			append_dev(ul, t16);
    			append_dev(ul, li2);
    			append_dev(li2, a12);
    			append_dev(a12, t17);
    			append_dev(a12, img3);
    			append_dev(a12, t18);
    			append_dev(a12, div2);
    			append_dev(div2, a9);
    			append_dev(div2, t20);
    			append_dev(div2, a10);
    			append_dev(div2, t22);
    			append_dev(div2, a11);
    			append_dev(nav, t24);
    			append_dev(nav, div3);
    			append_dev(div3, button0);
    			append_dev(button0, a13);
    			append_dev(div3, t26);
    			append_dev(div3, button1);
    			append_dev(button1, a14);
    			append_dev(div5, t28);
    			append_dev(div5, main);
    			append_dev(main, h1);
    			append_dev(main, t30);
    			append_dev(main, p);
    			append_dev(div5, t32);
    			append_dev(div5, div4);
    			append_dev(div4, button2);
    			append_dev(button2, a15);
    			append_dev(div4, t34);
    			append_dev(div4, button3);
    			append_dev(button3, a16);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
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
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
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
